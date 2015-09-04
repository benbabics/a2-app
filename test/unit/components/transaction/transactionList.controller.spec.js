(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        moment,
        CommonService,
        TransactionManager,
        UserManager,
        UserModel,
        AccountModel,
        PostedTransactionModel,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        mockGlobals = {
            TRANSACTION_LIST: {
                "CONFIG"        : {
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

            module("app.shared");
            module("app.components");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            //mock dependencies:
            TransactionManager = jasmine.createSpyObj("TransactionManager", ["fetchPostedTransactions"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            inject(function (_$rootScope_, _$q_, _moment_,
                             _CommonService_, _UserModel_, _AccountModel_, _PostedTransactionModel_, $controller) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                moment = _moment_;
                UserModel = _UserModel_;
                AccountModel = _AccountModel_;
                CommonService = _CommonService_;
                PostedTransactionModel = _PostedTransactionModel_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("TransactionListController", {
                    $scope            : $scope,
                    globals           : mockGlobals,
                    CommonService     : CommonService,
                    TransactionManager: TransactionManager,
                    UserManager       : UserManager
                });

            });

            //setup spies
            spyOn(CommonService, "loadingBegin");
            spyOn(CommonService, "loadingComplete");

            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            //setup mocks
            mockUser = TestUtils.getRandomUser(UserModel, AccountModel);
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            // Doesn't do anything yet

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

            it("should call CommonService.loadingBegin", function () {
                expect(CommonService.loadingBegin).toHaveBeenCalledWith();
            });

            it("should call TransactionManager.fetchPostedTransactions with the expected values", function () {
                expect(TransactionManager.fetchPostedTransactions).toHaveBeenCalledWith(
                    mockUser.billingCompany.accountId,
                    moment().subtract(mockGlobals.TRANSACTION_LIST.SEARCH_OPTIONS.MAX_DAYS, "days").toDate(),
                    moment().toDate(),
                    0,
                    mockGlobals.TRANSACTION_LIST.SEARCH_OPTIONS.PAGE_SIZE
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

                it("should call CommonService.loadingComplete", function () {
                    expect(CommonService.loadingComplete).toHaveBeenCalledWith();
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

                it("should call CommonService.loadingComplete", function () {
                    expect(CommonService.loadingComplete).toHaveBeenCalledWith();
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

                it("should call CommonService.loadingComplete", function () {
                    expect(CommonService.loadingComplete).toHaveBeenCalledWith();
                });
            });
        });

    });

}());