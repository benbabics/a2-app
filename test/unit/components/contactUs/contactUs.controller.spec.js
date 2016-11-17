(function () {
    "use strict";

    var $scope,
        ctrl;

    describe("A Contact Us Controller", function () {

        beforeEach(function () {

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

                ctrl = $controller("ContactUsController", {
                    $scope: $scope
                });

            });

        });

    });

}());