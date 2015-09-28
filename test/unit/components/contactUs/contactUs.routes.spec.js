(function () {
    "use strict";

    describe("A Contact Us Module Route Config", function () {

        var $injector,
            $rootScope,
            $state;

        beforeEach(function () {

            module("app.shared");
            module("app.components.contactUs");
            module("app.html");

            // mock dependencies
            module(function ($provide, sharedGlobals) {
                $provide.value("globals", sharedGlobals);
            });

            inject(function (_$injector_, _$rootScope_, _$state_) {
                $injector = _$injector_;
                $rootScope = _$rootScope_;
                $state = _$state_;
            });

        });

        describe("has a contactUs state that", function () {
            var state,
                stateName = "contactUs";

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

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/contactUs");
            });

            it("should define a view on the root view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/contactUs");
            });

        });
    });
})();