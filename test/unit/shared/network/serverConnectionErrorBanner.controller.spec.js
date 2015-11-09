(function () {
    "use strict";

    var $scope,
        $rootScope,
        ctrl;

    describe("A ServerConnectionErrorBannerController", function () {
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

                ctrl = $controller("ServerConnectionErrorBannerController", {
                    $scope    : $scope,
                    $rootScope: $rootScope
                });
            });
        });

        describe("has a network:serverConnectionSuccess event handler function that", function () {
            beforeEach(function () {
                ctrl.isConnected = null;

                $rootScope.$emit("network:serverConnectionSuccess");
            });

            it("should set isConnected to true", function () {
                expect(ctrl.isConnected).toEqual(true);
            });
        });

        describe("has a network:serverConnectionError event handler function that", function () {
            beforeEach(function () {
                ctrl.isConnected = null;

                $rootScope.$emit("network:serverConnectionError");
            });

            it("should set isConnected to false", function () {
                expect(ctrl.isConnected).toEqual(false);
            });
        });

        describe("has a $stateChangeStart event handler function that", function () {
            beforeEach(function () {
                ctrl.isConnected = null;

                $rootScope.$broadcast("$stateChangeStart");
            });

            it("should set isConnected to true", function () {
                expect(ctrl.isConnected).toEqual(true);
            });
        });
    });
}());