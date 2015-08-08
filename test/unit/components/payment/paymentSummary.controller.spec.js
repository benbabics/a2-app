(function () {
    "use strict";

    var _,
        $scope,
        ctrl,
        mockPayment = {
            amount     : "amount value",
            bankAccount: "bank account value",
            paymentDate: "payment date value"
        };

    describe("A Payment Summary Controller", function () {

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

            inject(function ($controller, $rootScope, CommonService) {

                _ = CommonService._;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentSummaryController", {
                    $scope        : $scope,
                    payment       : mockPayment
                });

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the payment", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });

        });

    });

}());