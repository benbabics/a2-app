(function () {
    "use strict";

    var $rootScope;

    describe("A Shared Module", function () {

        beforeEach(function () {

            module("app.shared");

            inject(function (_$rootScope_) {
                $rootScope = _$rootScope_;
            });

        });

        describe("has a run function that", function () {

            describe("has a pause event handler function that", function () {

                beforeEach(function () {
                    var event = document.createEvent("HTMLEvents");
                    event.initEvent("pause", true, true);

                    spyOn($rootScope, "$emit");

                    document.dispatchEvent(event);
                });

                it("should call $rootScope.$emit", function () {
                    expect($rootScope.$emit).toHaveBeenCalledWith("app:cordovaPause");
                });

            });

            // TODO - The event fired by $rootScope.$broadcast was getting handled in core.module during the test.
            // Come back and enable this after copying over changes Erin is making in MCA
            xdescribe("has a resume event handler function that", function () {

                beforeEach(function () {
                    var event = document.createEvent("HTMLEvents");
                    event.initEvent("resume", true, true);

                    spyOn($rootScope, "$emit");

                    document.dispatchEvent(event);
                });

                it("should call $rootScope.$emit", function () {
                    expect($rootScope.$emit).toHaveBeenCalledWith("app:cordovaResume");
                });

            });

        });

    });

})();