(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        CardManager;

    describe("A Card Module", function () {

        beforeEach(function () {

            inject(function (_$rootScope_, _$ionicPlatform_, _CardManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                CardManager = _CardManager_;
            });

            spyOn(CardManager, "clearCachedValues");
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

                it("should clear all cached values in CardManager", function () {
                    expect(CardManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
