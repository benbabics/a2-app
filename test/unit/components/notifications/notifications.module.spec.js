(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform;

    describe("A Notifications Module", function () {

        beforeEach(function () {

            inject(function (_$rootScope_, _$ionicPlatform_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
            });
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

                it("should clear all cached values in NotificationItemsManager", function () {
                    expect(this.NotificationItemsManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
