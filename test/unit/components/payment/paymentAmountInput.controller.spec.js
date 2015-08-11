(function () {
    "use strict";

    var ctrl,
        scope,
        mockPayment = {
            amount: 123456.78
        };

    describe("A Payment Amount Input Controller", function () {

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

            inject(function ($rootScope, $controller, $filter, globals) {

                scope = $rootScope.$new();

                ctrl = $controller("PaymentAmountInputController", {
                    $scope: scope,
                    $filter: $filter,
                    globals: globals,
                    payment: mockPayment
                });

            });
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the amount to the display payment amount", function () {
                expect(ctrl.amount).toEqual(getDisplayAmount(mockPayment.amount));
            });
        });

        describe("has a clearInput function that", function () {
            var mockAmount = "500.00";

            beforeEach(function () {
                ctrl.amount = mockAmount;

                ctrl.clearInput();
            });

            it("should set the amount to 0", function () {
                expect(ctrl.amount).toEqual(getDisplayAmount(0));
            });
        });
    });

    function getDisplayAmount(value) {
        return value * 100;
    }
}());