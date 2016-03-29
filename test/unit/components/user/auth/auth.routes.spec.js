(function () {
    "use strict";

    describe("A User Auth Module Route Config", function () {

        var $rootScope,
            $state,
            AnalyticsUtil,
            LoginManager,
            $q,
            mockGlobals = {
                USER_LOGIN: {
                    CONFIG: {
                        ANALYTICS: {
                            pageName: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            };

        beforeEach(function () {

            module("app.shared");
            module("app.components.user");
            module("app.components.user.auth");
            module("app.html");

            //mock dependencies:
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["trackView"]);
            LoginManager = jasmine.createSpyObj("LoginManager", ["logOut"]);

            module(function($provide, sharedGlobals) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("LoginManager", LoginManager);
                $provide.value("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (_$rootScope_, _$state_, _$q_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
                $q = _$q_;
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
                expect(state.url).toEqual("/login?errorReason&{timedOut:bool}");
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

                it("should call AnalyticsUtil.trackView", function () {
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.USER_LOGIN.CONFIG.ANALYTICS.pageName);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should log the user out", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

            });
        });
    });
})();
