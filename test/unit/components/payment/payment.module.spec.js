(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        $state,
        PaymentManager;

    describe("A Payment Module", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components");

            inject(function (_$rootScope_, _$ionicPlatform_, _$state_, _PaymentManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                $state = _$state_;
                PaymentManager = _PaymentManager_;
            });

            spyOn(PaymentManager, "clearCachedValues");
            spyOn($state, "transitionTo");
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

                it("should clear all cached values in PaymentManager", function () {
                    expect(PaymentManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
