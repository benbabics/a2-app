(function () {
    "use strict";

    var ctrl;

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

            inject(function ($controller, globals) {

                ctrl = $controller("PaymentAmountInputController", {
                    globals: globals
                });

            });
        });

        describe("has a clearInput function that", function () {
            var mockAmount = "500.00";

            beforeEach(function () {
                ctrl.amount = mockAmount;

                ctrl.clearInput();
            });

            it("should clear the amount", function () {
                expect(ctrl.amount).toEqual("");
            });
        });
    });
}());