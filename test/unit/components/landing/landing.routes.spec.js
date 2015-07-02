(function () {
    "use strict";

    describe("A Landing Module Route Config", function () {

        var $rootScope,
            $state;

        beforeEach(function () {

            module("app.components.landing");
            module("app.html");

            inject(function (_$rootScope_, _$state_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
            });
        });

        describe("has a landing state that", function () {
            var state,
                stateName = "landing";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/landing");
            });

            it("should define a view on the root view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/landing");
            });

            it("should transition successfully", function () {
                $state.go(stateName);
                $rootScope.$digest();
                expect($state.current.name).toBe(stateName);
            });
        });
    });
})();