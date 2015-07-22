(function () {
    "use strict";

    describe("A Core Module run block", function () {

        var $rootScope,
            $state,
            AuthenticationManager;

        beforeEach(function () {

            module("app.shared.dependencies");
            module("app.components.core");
            module("app.shared");
            module("app.components.user");
            module("app.components.landing");
            module("app.html");

            inject(function (_$rootScope_, _$state_, _AuthenticationManager_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                AuthenticationManager = _AuthenticationManager_;

                spyOn($rootScope, "$on").and.callThrough();
            });

        });

        describe("should set an event handler that", function () {
            var loginRoute = "user.auth.login",
                notLoginRoute = "landing";

            //TODO - the module's run block finishes before the spy can be injected into $rootScope
            //Figure out how to test this
            xit("should be set on the $stateChangeStart event", function () {
                expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeStart", jasmine.any(Function));
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    spyOn(AuthenticationManager, "userLoggedIn").and.returnValue(true);
                });

                describe("when the user is navigating to the login page", function () {

                    beforeEach(function () {
                        $state.go(loginRoute);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });

                describe("when the user is navigating to a page that's NOT the login page", function () {

                    beforeEach(function () {
                        $state.go(notLoginRoute);
                        $rootScope.$digest();
                    });

                    //TODO - figure out why this doesn't work. The resolve method does not seem to be getting called
                    xit("should continue to the page", function () {
                        expect($state.current.name).toEqual(notLoginRoute);
                    });
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    spyOn(AuthenticationManager, "userLoggedIn").and.returnValue(false);
                });

                describe("when the user is navigating to the login page", function () {

                    beforeEach(function () {
                        $state.go(loginRoute);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });

                describe("when the user is navigating to a page that's NOT the login page", function () {

                    beforeEach(function () {
                        $state.go(notLoginRoute);
                        $rootScope.$digest();
                    });

                    it("should redirect to the login page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });
            });
        });
    });
})();