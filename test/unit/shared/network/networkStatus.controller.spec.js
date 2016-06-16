(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        ctrl,
        PlatformUtil;

    describe("A NetworkStatusController", function () {
        beforeEach(function () {

            module("app.shared");
            module("app.html");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });
            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            PlatformUtil = jasmine.createSpyObj("PlatformUtil", [
                "isOnline",
                "waitForCordovaPlatform"
            ]);

            //setup spies
            PlatformUtil.waitForCordovaPlatform.and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });

            // INJECT! This part is critical
            // $rootScope - injected to create a new $scope instance.
            // $controller - injected to create an instance of our controller.
            inject(function (_$rootScope_, _$q_, $controller) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();

                ctrl = $controller("NetworkStatusController", {
                    $rootScope: $rootScope,
                    $scope: $scope,
                    PlatformUtil: PlatformUtil
                });
            });

        });

        describe("has a cordovaOnline event handler function that", function () {
            beforeEach(function () {
                PlatformUtil.isOnline.and.returnValue(true);
                ctrl.isOnline = null;
                $rootScope.$broadcast("$cordovaNetwork:online");
            });

            it("should set isOnline to true", function () {
                expect(ctrl.isOnline).toEqual(true);
            });

        });

        describe("has a cordovaOffline event handler function that", function () {

            beforeEach(function () {
                PlatformUtil.isOnline.and.returnValue(false);
                ctrl.isOnline = null;

                $rootScope.$broadcast("$cordovaNetwork:offline");
            });

                it("should set isOnline to false", function () {
                expect(ctrl.isOnline).toEqual(false);
            });
        });

    });

}());
