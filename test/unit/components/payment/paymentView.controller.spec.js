(function () {
    "use strict";

    var _,
        $scope,
        $state,
        ctrl,
        CommonService,
        Payment,
        confirmDeferred,
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
        mockConfig = mockGlobals.PAYMENT_VIEW.CONFIG;

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
            Payment = jasmine.createSpyObj("Payment", ["setPayment"]);
            $state = jasmine.createSpyObj("$state", ["go"]);
            CommonService = jasmine.createSpyObj("CommonService", ["displayConfirm"]);

            inject(function ($controller, $rootScope, $q, BankModel, _CommonService_, PaymentModel) {

                _ = _CommonService_._;
                confirmDeferred = $q.defer();

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentViewController", {
                    $scope                : $scope,
                    $state                : $state,
                    CommonService         : CommonService,
                    Payment               : Payment,
                    payment               : mockPayment,
                    scheduledPaymentsCount: mockScheduledPaymentsCount
                });
            });

            CommonService.displayConfirm.and.returnValue(confirmDeferred.promise);
            confirmDeferred.resolve();
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

        describe("has a confirmPaymentCancel function that", function () {

            beforeEach(function () {
                ctrl.confirmPaymentCancel();
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
        });

        describe("has an editPayment function that", function () {

            beforeEach(function () {
                ctrl.payment = mockPayment;

                ctrl.editPayment();
            });

            it("should call Payment.setPayment with the expected value", function () {
                expect(Payment.setPayment).toHaveBeenCalledWith(mockPayment);
            });

            it("should navigate to the payment.update flow", function () {
                expect($state.go).toHaveBeenCalledWith("payment.update");
            });
        });

    });

}());