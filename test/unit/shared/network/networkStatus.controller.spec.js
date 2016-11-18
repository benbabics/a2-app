(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        ctrl;

    describe("A NetworkStatusController", function () {

        beforeEach(inject(function (_$rootScope_, _$q_, $controller) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            ctrl = $controller("NetworkStatusController", {
                $rootScope: $rootScope,
                $scope: $scope
            });
        }));

        describe("has a cordovaOnline event handler function that", function () {

            beforeEach(function () {
                this.PlatformUtil.isOnline.and.returnValue(true);
                ctrl.isOnline = null;
                $rootScope.$broadcast("$cordovaNetwork:online");
            });

            it("should set isOnline to true", function () {
                expect(ctrl.isOnline).toEqual(true);
            });
        });

        describe("has a cordovaOffline event handler function that", function () {

            beforeEach(function () {
                this.PlatformUtil.isOnline.and.returnValue(false);
                ctrl.isOnline = null;

                $rootScope.$broadcast("$cordovaNetwork:offline");
            });

            it("should set isOnline to false", function () {
                expect(ctrl.isOnline).toEqual(false);
            });
        });
    });
}());
