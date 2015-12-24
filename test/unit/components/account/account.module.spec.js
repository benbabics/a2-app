(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        AccountManager;

    describe("An Account Module", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.account");

            inject(function (_$rootScope_, _$ionicPlatform_, _AccountManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                AccountManager = _AccountManager_;
            });

            spyOn(AccountManager, "clearCachedValues");
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

                it("should clear all cached values in AccountManager", function () {
                    expect(AccountManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
