(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        mockPayment = {
            amount       : 150.00,
            bankAccount  : "bank account value",
            scheduledDate: "2015-05-26"
        },
        Payment;

    describe("A Payment Confirmation Controller", function () {

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
            Payment = jasmine.createSpyObj("Payment", ["getPayment"]);

            inject(function ($controller, $rootScope, CommonService) {

                _ = CommonService._;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentSummaryController", {
                    $scope        : $scope,
                    Payment       : Payment
                });

            });

            Payment.getPayment.and.returnValue(mockPayment);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            it("should set the payment", function () {
                $scope.$broadcast("$ionicView.beforeEnter");

                expect(ctrl.payment).toEqual(mockPayment);
            });

        });

    });

}());