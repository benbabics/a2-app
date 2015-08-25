(function () {
    "use strict";

    var _,
        $scope,
        $state,
        ctrl,
        Payment,
        mockPayment,
        mockScheduledPaymentsCount = TestUtils.getRandomInteger(0, 100);

    describe("A Payment View Controller", function () {

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

            // mock dependencies
            Payment = jasmine.createSpyObj("Payment", ["setPayment"]);
            $state = jasmine.createSpyObj("$state", ["go"]);

            inject(function ($controller, $rootScope, BankModel, CommonService, PaymentModel) {

                _ = CommonService._;

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentViewController", {
                    $scope                : $scope,
                    $state                : $state,
                    Payment               : Payment,
                    payment               : mockPayment,
                    scheduledPaymentsCount: mockScheduledPaymentsCount
                });
            });

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