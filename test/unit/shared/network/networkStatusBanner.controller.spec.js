(function () {
    "use strict";

    var $rootScope,
        $scope,
        ctrl;

    describe("A NetworkStatusBannerController", function () {
        beforeEach(function () {

            module("app.shared");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });
            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // INJECT! This part is critical
            // $rootScope - injected to create a new $scope instance.
            // $controller - injected to create an instance of our controller.
            inject(function (_$rootScope_, $controller) {

                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();

                ctrl = $controller("NetworkStatusBannerController", {
                    $rootScope: $rootScope,
                    $scope: $scope
                });
            });
        });

        describe("has a cordovaOnline event handler function that", function () {
            beforeEach(function () {
                ctrl.isOnline = null;

                $rootScope.$broadcast("$cordovaNetwork:online");
            });

            it("should set isOnline to true", function () {
                expect(ctrl.isOnline).toEqual(true);
            });
        });

        describe("has a cordovaOffline event handler function that", function () {
            beforeEach(function () {
                ctrl.isOnline = null;

                $rootScope.$broadcast("$cordovaNetwork:offline");
            });

            it("should set isOnline to false", function () {
                expect(ctrl.isOnline).toEqual(false);
            });
        });
    });
}());