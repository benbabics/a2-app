(function () {
    "use strict";

    var $scope,
        $state,
        ctrl,
        mockGlobals = {
            LOGIN_STATE: "user.auth.login"
        },
        versionStatus;

    describe("A VersionStatus Controller", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.version");

            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            // mock dependencies
            $state = jasmine.createSpyObj("$state", [
                "go"
            ]);

            inject(function ($controller, $rootScope, VersionStatusModel) {
                $scope = $rootScope.$new();

                versionStatus = TestUtils.getRandomVersionStatus(VersionStatusModel);

                ctrl = $controller("VersionStatusController", {
                    $scope       : $scope,
                    $state       : $state,
                    versionStatus: versionStatus
                });
            });
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should redirect to the login state", function () {
                expect($state.go).toHaveBeenCalledWith(mockGlobals.LOGIN_STATE);
            });

        });

    });

}());
