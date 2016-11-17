(function () {
    "use strict";

    var $rootScope,
        $ionicPlatform,
        InvoiceManager;

    describe("An Invoice Module", function () {

        beforeEach(function () {

            inject(function (_$rootScope_, _$ionicPlatform_, _InvoiceManager_) {
                $rootScope = _$rootScope_;
                $ionicPlatform = _$ionicPlatform_;
                InvoiceManager = _InvoiceManager_;
            });

            spyOn(InvoiceManager, "clearCachedValues");
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

                it("should clear all cached values in InvoiceManager", function () {
                    expect(InvoiceManager.clearCachedValues).toHaveBeenCalledWith();
                });

            });

        });

    });

})();
