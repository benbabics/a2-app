(function () {
    "use strict";

    describe("A User Auth Module Route Config", function () {

        var $rootScope,
            $state;

        beforeEach(function () {

            module("app.shared");
            module("app.components.user");
            module("app.components.user.auth");
            module("app.html");

            inject(function (_$rootScope_, _$state_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
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
                expect(state.url).toEqual("/login");
            });

            it("should define a view on the user view container", function() {
                expect(state.views).toBeDefined();
                expect(state.views["view@user"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/user/auth/login");
            });

            it("should transition successfully", function () {
                $state.go(stateName);
                $rootScope.$digest();
                expect($state.current.name).toBe(stateName);
            });
        });
    });
})();