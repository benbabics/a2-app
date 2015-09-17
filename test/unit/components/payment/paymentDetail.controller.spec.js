(function () {
    "use strict";

    var _,
        $rootScope,
        $scope,
        $state,
        ctrl,
        CommonService,
        PaymentMaintenance,
        PaymentManager,
        UserManager,
        confirmDeferred,
        removePaymentDeferred,
        mockPayment,
        mockScheduledPaymentsCount = TestUtils.getRandomInteger(0, 100),
        mockGlobals = {
            PAYMENT_VIEW: {
                "CONFIG": {
                    "title"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "amount"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "bankAccount"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "postedDate"          : TestUtils.getRandomDate(),
                    "scheduledDate"       : TestUtils.getRandomDate(),
                    "inProcess"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "method"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "editButton"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cancelButton"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cancelPaymentConfirm": {
                        "content"  : TestUtils.getRandomStringThatIsAlphaNumeric(20),
                        "yesButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "noButton" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        },
        mockConfig = mockGlobals.PAYMENT_VIEW.CONFIG,
        mockUser = {
            email         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            firstName     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            username      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
            company       : {
                accountId    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                accountNumber: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                name         : TestUtils.getRandomStringThatIsAlphaNumeric(10)
            },
            billingCompany: {
                accountId    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                accountNumber: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                name         : TestUtils.getRandomStringThatIsAlphaNumeric(10)
            }
        };

    describe("A Payment View Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components");

            module(function ($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, mockGlobals, sharedGlobals));
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            PaymentMaintenance = jasmine.createSpyObj("PaymentMaintenance", ["setPayment"]);
            $state = jasmine.createSpyObj("$state", ["go"]);
            CommonService = jasmine.createSpyObj("CommonService", ["displayConfirm"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["removePayment"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            inject(function (_$rootScope_, _CommonService_, $controller, $q, BankModel, PaymentModel) {

                $rootScope = _$rootScope_;
                _ = _CommonService_._;
                confirmDeferred = $q.defer();
                removePaymentDeferred = $q.defer();

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentDetailController", {
                    $scope                : $scope,
                    $state                : $state,
                    CommonService         : CommonService,
                    PaymentMaintenance    : PaymentMaintenance,
                    PaymentManager        : PaymentManager,
                    UserManager           : UserManager,
                    payment               : mockPayment,
                    scheduledPaymentsCount: mockScheduledPaymentsCount
                });
            });

            CommonService.displayConfirm.and.returnValue(confirmDeferred.promise);
            UserManager.getUser.and.returnValue(mockUser);
            PaymentManager.removePayment.and.returnValue(removePaymentDeferred.promise);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                //setup an existing values to test them being modified
                ctrl.payment = null;
                ctrl.scheduledPaymentsCount = null;

                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the payment", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });

            it("should set the scheduled payments count", function () {
                expect(ctrl.scheduledPaymentsCount).toEqual(mockScheduledPaymentsCount);
            });

        });

        describe("has a displayCancelPaymentPopup function that", function () {

            beforeEach(function () {
                ctrl.payment = mockPayment;

                ctrl.displayCancelPaymentPopup();
            });

            it("should call CommonService.displayConfirm with the expected values", function () {
                expect(CommonService.displayConfirm).toHaveBeenCalledWith({
                    content             : mockConfig.cancelPaymentConfirm.content,
                    okButtonText        : mockConfig.cancelPaymentConfirm.yesButton,
                    cancelButtonText    : mockConfig.cancelPaymentConfirm.noButton,
                    okButtonCssClass    : "button-submit",
                    cancelButtonCssClass: "button-default"
                });
            });

            describe("when the user confirms the cancel", function () {

                beforeEach(function() {
                    confirmDeferred.resolve(true);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.removePayment with the expected values", function () {
                    expect(PaymentManager.removePayment).toHaveBeenCalledWith(
                        mockUser.billingCompany.accountId,
                        mockPayment.id
                    );
                });

                describe("when removing the payment is successful", function () {

                    beforeEach(function () {
                        removePaymentDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should redirect to payment.list.view", function () {
                        expect($state.go).toHaveBeenCalledWith("payment.list.view");
                    });
                });

                describe("when removing the payment is NOT successful", function () {

                    beforeEach(function () {
                        removePaymentDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should NOT redirect to payment.list.view", function () {
                        expect($state.go).not.toHaveBeenCalledWith("payment.list.view");
                    });
                });
            });

            describe("when the user denies the cancel", function () {

                beforeEach(function () {
                    confirmDeferred.resolve(false);
                    $rootScope.$digest();
                });

                it("should NOT call PaymentManager.removePayment", function () {
                    expect(PaymentManager.removePayment).not.toHaveBeenCalledWith();
                });

                it("should NOT redirect to payment.list.view", function () {
                    expect($state.go).not.toHaveBeenCalledWith("payment.list.view");
                });
            });
        });

        describe("has an editPayment function that", function () {

            beforeEach(function () {
                ctrl.payment = mockPayment;

                ctrl.editPayment();
            });

            it("should call PaymentMaintenance.setPayment with the expected value", function () {
                expect(PaymentMaintenance.setPayment).toHaveBeenCalledWith(mockPayment);
            });

            it("should navigate to the payment.update flow", function () {
                expect($state.go).toHaveBeenCalledWith("payment.update");
            });
        });

    });

}());