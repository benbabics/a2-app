(function () {
    "use strict";

    describe("A User Module Route Config", function () {

        var $rootScope,
            $state;

        beforeEach(function () {

            module("app.shared");
            module("app.components.user");
            module("app.html");

            inject(function (_$rootScope_, _$state_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
            });
        });

        describe("has a user state that", function () {
            var state,
                stateName = "user";

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
                expect(state.url).toEqual("/user");
            });

            it("should define a view on the root container", function() {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });
        });
    });
})();