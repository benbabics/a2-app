(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        NotificationItemsManager;

    describe("A Notifications Module", function () {

        beforeEach(function () {

            inject(function (_$rootScope_, _$ionicPlatform_, _NotificationItemsManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                NotificationItemsManager = _NotificationItemsManager_;
            });

            spyOn(NotificationItemsManager, "clearCachedValues");
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
                    expect(NotificationItemsManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
