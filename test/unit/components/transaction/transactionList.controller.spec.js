(function () {
    "use strict";

    var $scope,
        ctrl;

    describe("A Transaction List Controller", function () {

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

            inject(function ($controller, $rootScope) {

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("TransactionListController", {
                    $scope  : $scope
                });

            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function () {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            // Doesn't do anything yet

        });

    });

}());