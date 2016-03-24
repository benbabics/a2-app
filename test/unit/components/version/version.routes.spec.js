(function () {
    "use strict";

    describe("A Version Module Route Config", function () {

        var $rootScope,
            $state;

        beforeEach(function () {

            module("app.shared");
            module("app.components.version");
            module("app.html");

            inject(function (_$rootScope_, _$state_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
            });
        });

        describe("has a version state that", function () {
            var state,
                stateName = "version";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be defined", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function() {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/version");
            });
        });

        describe("has a version.status state that", function () {
            var state,
                stateName = "version.status";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be defined", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/status");
            });

            it("should define a version view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@version"]).toBeDefined();
            });
        });
    });
})();