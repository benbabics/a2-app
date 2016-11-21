(function () {
    "use strict";

    var _,
        $rootScope,
        $scope,
        $q,
        ctrl,
        mockCompletedPayments,
        mockPayments,
        mockScheduledPayments,
        mockGlobals = {
            "PAYMENT_LIST": {
                "CONFIG"        : {
                    "ANALYTICS"                 : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "title"                     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "scheduledPaymentsHeading"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "noScheduledPaymentsMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "completedPaymentsHeading"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "noCompletedPaymentsMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                },
                "SEARCH_OPTIONS": {
                    "PAGE_NUMBER": TestUtils.getRandomInteger(0, 20),
                    "PAGE_SIZE"  : TestUtils.getRandomInteger(1, 100)
                }
            }
        },
        mockConfig = mockGlobals.PAYMENT_LIST.CONFIG,
        mockUser,
        UserManager,
        PaymentManager,
        LoadingIndicator,
        AnalyticsUtil,
        fetchPaymentsDeferred;

    describe("A Payment List Controller", function () {

        beforeEach(function () {

            //create mock dependencies
            UserManager = jasmine.createSpyObj("UserManager", ["getUser", "userLoggedIn"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchPayments"]);
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

            inject(function (___, globals, $controller, _$rootScope_, _$q_, BankModel, PaymentModel, UserAccountModel, UserModel) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;

                // setup mock objects
                mockCompletedPayments = getRandomNotScheduledPayments(PaymentModel, BankModel);
                mockScheduledPayments = getRandomScheduledPayments(PaymentModel, BankModel);
                mockPayments = _.union(mockCompletedPayments, mockScheduledPayments);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
                fetchPaymentsDeferred = $q.defer();

                UserManager.getUser.and.returnValue(mockUser);
                UserManager.userLoggedIn.and.returnValue(true);
                PaymentManager.fetchPayments.and.returnValue(fetchPaymentsDeferred.promise);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentListController", {
                    $scope:           $scope,
                    globals:          mockGlobals,
                    LoadingIndicator: LoadingIndicator,
                    PaymentManager:   PaymentManager,
                    UserManager:      UserManager
                });
            });
        });

        describe("has an activate function that", function () {
            it("should have infiniteListController methods on $scope", function () {
                expect( $scope.loadNextPage ).toBeDefined();
                expect( $scope.resetSearchResults ).toBeDefined();
            });

            it("should have infiniteScrollService defined on $scope", function () {
                expect( $scope.infiniteScrollService ).toBeDefined();
            });

            it("should have vm.payments equal model", function () {
                expect( ctrl.payments ).toEqual( $scope.infiniteScrollService.model );
            });
        });

        describe("has a handleMakeRequest function that", function () {
            beforeEach(function () {
                $scope.loadNextPage();
            });

            it("should call LoadingIndicator.begin", function () {
                expect( LoadingIndicator.begin ).toHaveBeenCalled();
            });

            it("should call PaymentManager.fetchPayments", function () {
                expect( PaymentManager.fetchPayments ).toHaveBeenCalledWith(
                    mockUser.billingCompany.accountId,
                    $scope.infiniteScrollService.settings.currentPage,
                    $scope.infiniteScrollService.settings.pageSize
                );
            });

            describe("when the payments are successfully fetched", function () {
                beforeEach(function () {
                    fetchPaymentsDeferred.resolve( mockPayments );
                    $rootScope.$digest();
                });

                it("should set the completed payments", function () {
                    var payments = _.orderBy( mockCompletedPayments, ["scheduledDate"], ["desc"] );
                    expect( ctrl.payments.completed ).toEqual( payments );
                });

                it("should set the scheduled payments", function () {
                    var payments = _.orderBy( mockScheduledPayments, ["scheduledDate"], ["asc"] );
                    expect( ctrl.payments.scheduled ).toEqual( payments );
                });

                it("should call LoadingIndicator.complete", function () {
                    expect( LoadingIndicator.complete ).toHaveBeenCalled();
                });
            });

            describe("when the payments are NOT successfully fetched", function () {
                beforeEach(function () {
                    fetchPaymentsDeferred.reject();
                    $rootScope.$digest();
                });

                it("should NOT set the completed payments", function () {
                    expect( ctrl.payments.completed ).toEqual([]);
                });

                it("should NOT set the scheduled payments", function () {
                    expect( ctrl.payments.scheduled ).toEqual([]);
                });

                it("should call LoadingIndicator.complete", function () {
                    expect( LoadingIndicator.complete ).toHaveBeenCalled();
                });
            });
        });

    });

    function getRandomNotScheduledPayments(PaymentModel, BankModel) {
        var i,
            mockPaymentCollection,
            numModels;

        mockPaymentCollection = [];
        numModels = TestUtils.getRandomInteger(1, 100);
        for (i = 0; i < numModels; ++i) {
            mockPaymentCollection.push(TestUtils.getRandomPayment(PaymentModel, BankModel));
        }

        return mockPaymentCollection;
    }

    function getRandomScheduledPayment(PaymentModel, BankModel) {
        var mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

        mockPayment.status = "SCHEDULED";

        return mockPayment;
    }

    function getRandomScheduledPayments(PaymentModel, BankModel) {
        var i,
            mockPaymentCollection,
            numModels;

        mockPaymentCollection = [];
        numModels = TestUtils.getRandomInteger(1, 100);
        for (i = 0; i < numModels; ++i) {
            mockPaymentCollection.push(getRandomScheduledPayment(PaymentModel, BankModel));
        }

        return mockPaymentCollection;
    }

}());
