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
        fetchPaymentsDeferred,
        resolveHandler,
        rejectHandler;

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
                    $scope          : $scope,
                    globals         : mockGlobals,
                    LoadingIndicator: LoadingIndicator,
                    PaymentManager  : PaymentManager,
                    UserManager     : UserManager
                });

            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has an activate function that", function () {

            it("should call LoadingIndicator.begin", function () {
                expect(LoadingIndicator.begin).toHaveBeenCalledWith();
            });

            it("should call PaymentManager.fetchPayments", function () {
                expect(PaymentManager.fetchPayments).toHaveBeenCalledWith(mockUser.billingCompany.accountId,
                    mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_NUMBER,
                    mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_SIZE);
            });

            describe("when the payments are successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.resolve(mockPayments);
                    $rootScope.$digest();
                });

                it("should set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual(_.sortByOrder(mockCompletedPayments, ["scheduledDate"], ["desc"]));
                });

                it("should set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual(_.sortByOrder(mockScheduledPayments, ["scheduledDate"], ["asc"]));
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when the payments are NOT successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.reject();
                    $rootScope.$digest();
                });

                it("should NOT set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual({});
                });

                it("should NOT set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual({});
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });
        });

        describe("has a fetchPayments function that", function () {

            beforeEach(function () {
                spyOn($scope, "$broadcast").and.callThrough();

                ctrl.fetchPayments()
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should broadcast 'scroll.refreshComplete'", function () {
                expect($scope.$broadcast).toHaveBeenCalledWith("scroll.refreshComplete");
            });

            it("should call LoadingIndicator.begin", function () {
                expect(LoadingIndicator.begin).toHaveBeenCalledWith();
            });

            it("should call PaymentManager.fetchPayments", function () {
                expect(PaymentManager.fetchPayments).toHaveBeenCalledWith(mockUser.billingCompany.accountId,
                    mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_NUMBER,
                    mockGlobals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_SIZE);
            });

            describe("when the payments are successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.resolve(mockPayments);
                    $rootScope.$digest();
                });

                it("should set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual(_.sortByOrder(mockCompletedPayments, ["scheduledDate"], ["desc"]));
                });

                it("should set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual(_.sortByOrder(mockScheduledPayments, ["scheduledDate"], ["asc"]));
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when the payments are NOT successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.reject();
                    $rootScope.$digest();
                });

                it("should NOT set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual({});
                });

                it("should NOT set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual({});
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });

                it("should reject", function () {
                    expect(rejectHandler).toHaveBeenCalled();
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
