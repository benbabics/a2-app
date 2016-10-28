(function () {
    "use strict";

    var $scope,
        $rootScope,
        ctrl;

    describe("A ServerConnectionErrorBannerController", function () {

        beforeAll(function () {
            this.includeAppDependencies = false;
        });

        beforeEach(function () {

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