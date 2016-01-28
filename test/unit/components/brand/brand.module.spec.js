(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        BrandManager;

    describe("A Brand Module", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.brand");

            inject(function (_$rootScope_, _$ionicPlatform_, _BrandManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                BrandManager = _BrandManager_;
            });

            spyOn(BrandManager, "clearCachedValues");
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

                it("should clear all cached values in BrandManager", function () {
                    expect(BrandManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
