(function () {
    "use strict";

    var $rootScope,
        $ionicLoading;

    describe("A Shared Module", function () {

        beforeEach(function () {

            module("app.shared");

            // mock dependencies
            $ionicLoading = jasmine.createSpyObj("$ionicLoading", ["show", "hide"]);

            module(function($provide) {
                $provide.value("$ionicLoading", $ionicLoading);
            });

            inject(function (_$rootScope_) {
                $rootScope = _$rootScope_;
            });

        });

        describe("has a run function that", function () {

            describe("has a loadingBegin event handler function that", function () {

                beforeEach(function () {
                    $rootScope.$broadcast("loadingBegin");
                });

                it("should call $ionicLoading.show", function () {
                    expect($ionicLoading.show).toHaveBeenCalled();
                });

                it("should display an ion-spinner", function () {
                    expect($ionicLoading.show.calls.mostRecent().args).toEqual([{
                        template: "<ion-spinner class='spinner-light'></ion-spinner>"
                    }]);
                });
            });

            describe("has a loadingComplete event handler function that", function () {

                beforeEach(function () {
                    $rootScope.$broadcast("loadingComplete");
                });

                it("should call $ionicLoading.hide", function () {
                    expect($ionicLoading.hide).toHaveBeenCalledWith();
                });
            });
        });

    });

})();