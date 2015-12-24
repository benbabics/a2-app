(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        BankManager;

    describe("A Bank Module", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.bank");

            inject(function (_$rootScope_, _$ionicPlatform_, _BankManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                BankManager = _BankManager_;
            });

            spyOn(BankManager, "clearCachedValues");
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

                it("should clear all cached values in BankManager", function () {
                    expect(BankManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
