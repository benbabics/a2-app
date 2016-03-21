(function () {
    "use strict";

    var $rootScope,
        $scope,
        $stateParams = {},
        $q,
        moment,
        LoadingIndicator,
        TransactionManager,
        UserManager,
        UserModel,
        UserAccountModel,
        PostedTransactionModel,
        AnalyticsUtil,
        cardIdFilter,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        mockGlobals = {
            TRANSACTION_LIST: {
                "CONFIG"        : {
                    "ANALYTICS"                 : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reloadDistance" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "SEARCH_OPTIONS": {
                    "MAX_DAYS" : TestUtils.getRandomInteger(1, 100),
                    "PAGE_SIZE": TestUtils.getRandomInteger(1, 100)
                }
            }
        };

    describe("A Transaction List Controller", function () {

        beforeEach(function () {

            //mock dependencies:
            TransactionManager = jasmine.createSpyObj("TransactionManager", ["fetchPostedTransactions"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);

            module("app.shared");
            module("app.components", function ($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function (_$rootScope_, _$q_, _moment_, _UserModel_, _UserAccountModel_, _PostedTransactionModel_, $controller) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                moment = _moment_;
                UserModel = _UserModel_;
                UserAccountModel = _UserAccountModel_;
                PostedTransactionModel = _PostedTransactionModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                cardIdFilter = getRandomCardIdFilter();
                $stateParams.cardId = cardIdFilter;

                ctrl = $controller("TransactionListController", {
                    $scope            : $scope,
                    $stateParams      : $stateParams,
                    globals           : mockGlobals,
                    LoadingIndicator  : LoadingIndicator,
                    TransactionManager: TransactionManager,
                    UserManager       : UserManager
                });

            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            //setup mocks
            mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
            UserManager.getUser.and.returnValue(mockUser);
        });

        it("should set backStateOverride to the expected value", function () {
            expect(ctrl.backStateOverride).toEqual(getExpectedBackStateOverride(cardIdFilter));
        });

        describe("has a loadNextPage function that", function () {
            var fetchPostedTransactionsDeferred;

            beforeEach(function () {
                fetchPostedTransactionsDeferred = $q.defer();
                TransactionManager.fetchPostedTransactions.and.returnValue(fetchPostedTransactionsDeferred.promise);
            });

            beforeEach(function () {
                ctrl.loadNextPage()
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call LoadingIndicator.begin", function () {
                expect(LoadingIndicator.begin).toHaveBeenCalledWith();
            });

            it("should call TransactionManager.fetchPostedTransactions with the expected values", function () {
                expect(TransactionManager.fetchPostedTransactions).toHaveBeenCalledWith(
                    mockUser.billingCompany.accountId,
                    moment().subtract(mockGlobals.TRANSACTION_LIST.SEARCH_OPTIONS.MAX_DAYS, "days").toDate(),
                    moment().toDate(),
                    0,
                    mockGlobals.TRANSACTION_LIST.SEARCH_OPTIONS.PAGE_SIZE,
                    getExpectedCardId(cardIdFilter)
                );
            });

            describe("when fetchPostedTransactions resolves with an empty list of transactions", function () {

                beforeEach(function () {
                    fetchPostedTransactionsDeferred.resolve([]);

                    $rootScope.$digest();
                });

                it("should resolve with a value of true", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(true);
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when fetchPostedTransactions resolves with a non-empty list of transactions", function () {
                var mockTransactions;

                beforeEach(function () {
                    var numTransactions = TestUtils.getRandomInteger(1, 100);
                    mockTransactions = [];
                    for (var i = 0; i < numTransactions; ++i) {
                        mockTransactions.push(TestUtils.getRandomPostedTransaction(PostedTransactionModel));
                    }
                });

                beforeEach(function () {
                    fetchPostedTransactionsDeferred.resolve(mockTransactions);

                    $rootScope.$digest();
                });

                it("should add the transactions to the list", function () {
                    expect(ctrl.postedTransactions).toEqual(mockTransactions);
                });

                xit("should increment the current page", function () {
                    //TODO figure out how to test this
                });

                it("should resolve with a value of false", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(false);
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when fetchPostedTransactions rejects", function () {

                beforeEach(function () {
                    fetchPostedTransactionsDeferred.reject();

                    $rootScope.$digest();
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should resolve with a value of true", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(true);
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });
        });

        describe("has a pageLoaded function that", function () {

            xit("should set firstPageLoaded to truer", function () {
                //TODO figure out how to test this
            });

        });

    });

    function getExpectedBackStateOverride(cardIdFilter) {
        if (isFilteredByCardId(cardIdFilter)) {
            return null;
        }

        return "landing";
    }

    function getExpectedCardId(cardIdFilter) {
        if (isFilteredByCardId(cardIdFilter)) {
            return cardIdFilter;
        }

        return undefined;
    }

    function isFilteredByCardId(cardIdFilter) {
        return !_.isEmpty(cardIdFilter) && _.isString(cardIdFilter);
    }

    function getRandomCardIdFilter() {
        var randomValue = TestUtils.getRandomInteger(0, 3);

        if (randomValue === 0) {
            return TestUtils.getRandomStringThatIsAlphaNumeric(10);
        }
        if (randomValue === 1) {
            return "";
        }
        if (randomValue === 2) {
            return null;
        }

        return undefined;
    }

}());
