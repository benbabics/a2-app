(function () {
    "use strict";

    var $state,
        $rootScope,
        FlowUtil;

    describe("A Core Module Route Config", function () {

        beforeEach(function () {

            module("app.shared.core");
            module("app.html");

            module(function($provide) {
                //mock dependencies
                FlowUtil = jasmine.createSpyObj("FlowUtil", ["exitApp"]);

                $provide.value("FlowUtil", FlowUtil);
            });

            inject(function (_$state_, _$rootScope_) {
                $state = _$state_;
                $rootScope = _$rootScope_;
            });
        });

        describe("has an app state that", function () {
            var state,
                stateName = "app";

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
                expect(state.url).toEqual("/app");
            });

            it("should have the expected template", function () {
                expect(state.template).toEqual("<ion-nav-view></ion-nav-view>");
            });
        });

        describe("has an app.exit state that", function () {
            var state,
                stateName = "app.exit";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/exit");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should call FlowUtil.exitApp", function () {
                    expect(FlowUtil.exitApp).toHaveBeenCalledWith();
                });
            });
        });
    });

})();
