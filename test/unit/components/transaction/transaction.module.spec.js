(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        TransactionManager;

    describe("A Transaction Module", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.transaction");

            inject(function (_$rootScope_, _$ionicPlatform_, _TransactionManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                TransactionManager = _TransactionManager_;
            });

            spyOn(TransactionManager, "clearCachedValues");
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

                it("should clear all cached values in TransactionManager", function () {
                    expect(TransactionManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
