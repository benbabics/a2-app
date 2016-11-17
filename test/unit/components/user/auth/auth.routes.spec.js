(function () {
    "use strict";

    describe("A User Auth Module Route Config", function () {

        var $rootScope,
            $state,
            AuthenticationManager,
            LoginManager,
            $q,
            globals,
            mockGlobals = {
                LOGIN_STATE: "user.auth.login",
                USER_LOGIN: {
                    CONFIG: {
                        ANALYTICS: {
                            pageName: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            };

        beforeEach(function () {

            //mock dependencies:
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["userLoggedIn"]);
            LoginManager = jasmine.createSpyObj("LoginManager", ["logOut"]);

            module(function($provide, sharedGlobals) {
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("LoginManager", LoginManager);
                $provide.value("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (_$rootScope_, _$state_, _$q_, _globals_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                $q = _$q_;
                globals = _globals_;
            });

        });

        describe("has a user.auth state that", function () {
            var state,
                stateName = "user.auth";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be valid", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function() {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/auth");
            });
        });

        describe("has a user.auth.login state that", function () {
            var state,
                stateName = "user.auth.login";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be valid", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function() {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/login?errorReason&toState&{timedOut:bool}&{logOut:bool}");
            });

            it("should define a view on the user view container", function() {
                expect(state.views).toBeDefined();
                expect(state.views["view@user"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/user/auth/login");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should call this.AnalyticsUtil.trackView", function () {
                    expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.USER_LOGIN.CONFIG.ANALYTICS.pageName);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should log the user out", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

            });
        });

        describe("has a user.auth.check state that", function () {
            var state,
                stateName = "user.auth.check";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be valid", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function() {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/check?state");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/user/auth/check");
            });

            describe("when navigated to", function () {
                var toState;

                beforeEach(function () {
                    toState = "alerts.list";
                });

                describe("when the user is logged in", function () {

                    beforeEach(function () {
                        AuthenticationManager.userLoggedIn.and.returnValue(true);
                    });

                    beforeEach(function () {
                        $state.go(stateName, {state: toState});
                        $rootScope.$digest();
                    });

                    it("should transition to the given page", function () {
                        expect($state.current.name).toBe(toState);
                    });
                });

                describe("when the user is NOT logged in", function () {

                    beforeEach(function () {
                        AuthenticationManager.userLoggedIn.and.returnValue(false);
                    });

                    beforeEach(function () {
                        $state.go(stateName, {state: toState});
                        $rootScope.$digest();
                    });

                    it("should transition to the login page with the expected toState", function () {
                        expect($state.current.name).toEqual(globals.LOGIN_STATE);
                        expect($state.params.toState).toEqual(toState);
                    });
                });
            });
        });
    });
})();
