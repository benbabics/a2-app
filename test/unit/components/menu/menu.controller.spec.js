(function () {
    "use strict";

    var $ionicHistory,
        ctrl,
        AuthenticationManager,
        $state;

    describe("A Menu Controller", function () {

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

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut"]);
            $state = jasmine.createSpyObj("state", ["go"]);

            inject(function ($controller, _$ionicHistory_) {
                $ionicHistory = _$ionicHistory_;

                ctrl = $controller("MenuController", {
                    AuthenticationManager: AuthenticationManager,
                    $state: $state
                });
            });
        });

        describe("has an logOut function that", function () {
            beforeEach(function () {
                ctrl.logOut();
            });

            it("should log out the User", function () {
                expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
            });

            it("should navigate to the login page", function () {
                expect($state.go).toHaveBeenCalledWith("user.auth.login");
            });
        });

    });

}());