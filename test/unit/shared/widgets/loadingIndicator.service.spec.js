(function () {
    "use strict";

    describe("A LoadingIndicator service", function () {

        var LoadingIndicator,
            $ionicLoading,
            $rootScope;

        beforeEach(function () {
            //mock dependencies
            $ionicLoading = jasmine.createSpyObj("$ionicLoading", ["hide", "show"]);

            module("app.shared", function ($provide) {
                $provide.value("$ionicLoading", $ionicLoading);
            });

            inject(function (_$rootScope_, _LoadingIndicator_) {
                LoadingIndicator = _LoadingIndicator_;
                $rootScope = _$rootScope_;
            });
        });

        describe("has an app:loadingBegin event handler function that", function () {

            beforeEach(function () {
                $rootScope.$emit("app:loadingBegin");
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

        describe("has an app:loadingComplete event handler function that", function () {

            beforeEach(function () {
                $rootScope.$emit("app:loadingComplete");
            });

            it("should call $ionicLoading.hide", function () {
                expect($ionicLoading.hide).toHaveBeenCalledWith();
            });
        });

        describe("has a begin function that", function () {
            beforeEach(function () {
                spyOn($rootScope, "$emit");
            });

            it("should broadcast the app:loadingBegin event when the first call is made.", function () {
                LoadingIndicator.begin();

                expect($rootScope.$emit).toHaveBeenCalledWith("app:loadingBegin");
            });

            it("should not emit the app:begin event when subsequent calls are made", function () {
                LoadingIndicator.begin();
                LoadingIndicator.begin();

                expect($rootScope.$emit.calls.count()).toBe(1);
            });
        });

        describe("has a complete function that", function () {
            beforeEach(function () {
                spyOn($rootScope, "$emit");
            });

            it("should not emit the app:loadingComplete event when multiple calls to begin were made", function () {
                LoadingIndicator.begin();
                LoadingIndicator.begin();
                LoadingIndicator.complete();

                expect($rootScope.$emit).not.toHaveBeenCalledWith("app:loadingComplete");
            });

            it("should emit the app:loadingComplete event when the number of complete calls equals the number of begin calls", function () {
                LoadingIndicator.begin();
                LoadingIndicator.complete();

                expect($rootScope.$emit).toHaveBeenCalledWith("app:loadingComplete");
            });
        });
    });
})();
