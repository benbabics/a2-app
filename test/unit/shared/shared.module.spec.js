(function () {
    "use strict";

    var $rootScope,
        $ionicLoading;

    describe("A Shared Module", function () {

        beforeEach(function () {

            module("app.shared");

            // mock dependencies
            $ionicLoading = jasmine.createSpyObj("$ionicLoading", ["show", "hide"]);

            module(function($provide) {
                $provide.value("$ionicLoading", $ionicLoading);
            });

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

            describe("has an app:loadingBegin event handler function that", function () {

                beforeEach(function () {
                    $rootScope.$emit("app:loadingBegin");
                });

                it("should call $ionicLoading.show", function () {
                    expect($ionicLoading.show).toHaveBeenCalled();
                });

                it("should display an ion-spinner", function () {
                    expect($ionicLoading.show.calls.mostRecent().args).toEqual([{
                        template: "<ion-spinner class='spinner-light'></ion-spinner>"
                    }]);
                });
            });

            describe("has an app:loadingComplete event handler function that", function () {

                beforeEach(function () {
                    $rootScope.$emit("app:loadingComplete");
                });

                it("should call $ionicLoading.hide", function () {
                    expect($ionicLoading.hide).toHaveBeenCalledWith();
                });
            });
        });

    });

})();