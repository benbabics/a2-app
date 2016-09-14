(function () {
    "use strict";

    var $rootScope,
        $scope,
        $stateParams = {},
        $q,
        $stateParams,
        $localStorage,
        $ionicScrollDelegateMock,
        wexInfiniteListService,
        AnalyticsUtil,
        moment,
        LoadingIndicator,
        TransactionManager,
        UserManager,
        UserModel,
        UserAccountModel,
        PostedTransactionModel,
        ElementUtil,
        cardIdFilter,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        mockGlobals = {
            TRANSACTION_LIST: {
                "CONFIG"        : {
                    "ANALYTICS"                 : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "events": {
                            "date"  : ["Transaction", "Date"],
                            "card"  : ["Transaction", "CardNumber"],
                            "driver": ["Transaction", "DriverName"],
                            "scroll": ["Transaction", "InfiniteScroll"]
                        }
                    },
                    "title"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "reloadDistance" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "buttonLabels"  : {
                        "date"  : "Date",
                        "driver": "Driver Name",
                        "card"  : "Card Number"
                    }
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
            wexInfiniteListService = jasmine.createSpyObj("wexInfiniteListService", ["emptyCache"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);
            ElementUtil = jasmine.createSpyObj("ElementUtil", ["resetInfiniteList"]);
            $ionicScrollDelegateMock = jasmine.createSpyObj("$ionicScrollDelegate", ["scrollTop"]);

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

            inject(function (_$rootScope_, _$stateParams_, $controller, _$localStorage_, _AnalyticsUtil_) {
                $rootScope             = _$rootScope_;
                $stateParams           = _$stateParams_;
                $localStorage          = _$localStorage_;
                AnalyticsUtil          = _AnalyticsUtil_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                cardIdFilter = getRandomCardIdFilter();
                $stateParams.cardId = cardIdFilter;

                ctrl = $controller("TransactionListController", {
                    $scope                : $scope,
                    $stateParams          : $stateParams,
                    globals               : mockGlobals,
                    ElementUtil           : ElementUtil,
                    $localStorage         : $localStorage,
                    $ionicScrollDelegate  : $ionicScrollDelegateMock,
                    wexInfiniteListService: wexInfiniteListService,
                    AnalyticsUtil         : AnalyticsUtil
                });

            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        it("should set backStateOverride to the expected value", function () {
            expect(ctrl.backStateOverride).toEqual(getExpectedBackStateOverride(cardIdFilter));
        });

        describe("has a filterViews.transactionsFilterValue property that", function () {
            it("should default to the value 'date', if not  previously set", function () {
                expect(ctrl.filterViews.transactionsFilterValue).toEqual('date');
            });
        });

        describe("has a handleFilterSelection function that", function () {
            var params;

            it("should call $ionicScrollDelegate.scrollTop", function () {
                params = { target: { value: 'foo' } };
                ctrl.handleFilterSelection( params );
                expect($ionicScrollDelegateMock.scrollTop).toHaveBeenCalled();
            });
        });

        describe("has a handleLoadSubsequentData function that", function () {
          it("should send a message to AnalyticsUtil.trackEvent", function () {
            var params = mockGlobals.TRANSACTION_LIST.CONFIG.ANALYTICS.events.scroll;
            ctrl.handleLoadSubsequentData();
            expect(AnalyticsUtil.trackEvent).toHaveBeenCalledWith( params[0], params[1] );
          });
        });

        xdescribe("has a loadNextPage function that", function () {
            var fetchPostedTransactionsDeferred,
                currentDate = TestUtils.getRandomDate();

            beforeEach(function () {
                fetchPostedTransactionsDeferred = $q.defer();
                TransactionManager.fetchPostedTransactions.and.returnValue(fetchPostedTransactionsDeferred.promise);

                jasmine.clock().mockDate(currentDate);
            });

            beforeEach(function () {
                ctrl.loadNextPage()
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call TransactionManager.fetchPostedTransactions with the expected values", function () {
                expect(TransactionManager.fetchPostedTransactions).toHaveBeenCalledWith(
                    mockUser.billingCompany.accountId,
                    moment(currentDate).subtract(mockGlobals.TRANSACTION_LIST.SEARCH_OPTIONS.MAX_DAYS, "days").toDate(),
                    currentDate,
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

                it("should set loadingComplete to true", function () {
                    expect(ctrl.loadingComplete).toBeTruthy();
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

            describe("when fetchPostedTransactions resolves with a non-empty, non-full list of transactions", function () {
                var mockTransactions;

                beforeEach(function () {
                    var numTransactions = TestUtils.getRandomInteger(1, mockGlobals.TRANSACTION_LIST.SEARCH_OPTIONS.PAGE_SIZE);
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

                it("should set loadingComplete to true", function () {
                    expect(ctrl.loadingComplete).toBeTruthy();
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

            describe("when fetchPostedTransactions resolves with a full list of transactions", function () {
                var mockTransactions;

                beforeEach(function () {
                    spyOn($scope, "$broadcast");

                    var numTransactions = mockGlobals.TRANSACTION_LIST.SEARCH_OPTIONS.PAGE_SIZE;
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

                it("should set loadingComplete to false", function () {
                    expect(ctrl.loadingComplete).toBeFalsy();
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should broadcast the 'scroll.refreshComplete' event", function () {
                    expect($scope.$broadcast).toHaveBeenCalledWith("scroll.refreshComplete");
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when fetchPostedTransactions rejects", function () {

                beforeEach(function () {
                    spyOn($scope, "$broadcast");

                    fetchPostedTransactionsDeferred.reject();

                    $rootScope.$digest();
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should set loadingComplete to true", function () {
                    expect(ctrl.loadingComplete).toBeTruthy();
                });

                it("should resolve with a value of true", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(true);
                });

                it("should broadcast the 'scroll.refreshComplete' event", function () {
                    expect($scope.$broadcast).toHaveBeenCalledWith("scroll.refreshComplete");
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });
        });

        xdescribe("has a resetSearchResults function that", function () {

            beforeEach(function () {
                TransactionManager.fetchPostedTransactions.and.returnValue($q.resolve());

                ctrl.resetSearchResults();
            });

            it("should set loadingComplete to false", function () {
                expect(ctrl.loadingComplete).toBeFalsy();
            });

            xit("should set currentPage to 0", function () {
                //TODO figure out how to test this
            });

            it("should set postedTransactions to an empty array", function () {
                expect(ctrl.postedTransactions).toEqual([]);
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
