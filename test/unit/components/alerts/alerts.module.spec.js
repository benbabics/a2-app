(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        AlertsManager;

    describe("A Transaction Module", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.alerts");

            inject(function (_$rootScope_, _$ionicPlatform_, _AlertsManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                AlertsManager = _AlertsManager_;
            });

            spyOn(AlertsManager, "clearCachedValues");
        });

        describe("has a run function that", function () {

            //wait for ionic
            beforeEach(function (done) {
                $ionicPlatform.ready(done);
            });

            describe("has an app:logout event handler function that", function () {

                beforeEach(function() {
                    $rootScope.$emit("app:logout");
                    $rootScope.$digest();
                });

                it("should clear all cached values in AlertsManager", function () {
                    expect(AlertsManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
