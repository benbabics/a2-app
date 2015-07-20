(function () {
    "use strict";

    describe("A Payment Module Route Config", function () {

        var $rootScope,
            $state;

        beforeEach(function () {

            module("app.components.payment");
            module("app.html");

            inject(function (_$q_, _$rootScope_, _$state_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
            });
        });

        describe("has a payment.add state that", function () {
            var state,
                stateName = "payment.add";

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
                expect(state.url).toEqual("/add");
            });

            it("should define a payment-view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["payment-view"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/add");
            });

            it("should transition successfully", function() {
                $state.go("payment.add");
                $rootScope.$digest();
                expect($state.current.name).toBe("payment.add");
            });
        });
    });
})();