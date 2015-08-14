(function () {
    "use strict";

    var _,
        $scope,
        ctrl;

    describe("A Payment List Controller", function () {

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

                ctrl = $controller("PaymentListController", {
                    $scope        : $scope
                });

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the completed payments", function () {
                expect(ctrl.completedPayments).toEqual({});
            });

            it("should set the scheduled payments", function () {
                expect(ctrl.scheduledPayments).toEqual({});
            });

        });

    });

}());