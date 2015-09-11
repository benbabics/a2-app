(function () {
    "use strict";

    describe("A Card Module Route Config", function () {

        var $state;

        beforeEach(function () {

            module("app.shared");
            module("app.components.card");
            module("app.html");

            inject(function (_$state_) {
                $state = _$state_;
            });
        });

        describe("has a card state that", function () {
            var state,
                stateName = "card";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/card");
            });

            it("should define a view on the root container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });
        });
    });
})();