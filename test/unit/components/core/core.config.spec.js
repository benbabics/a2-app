(function () {
    "use strict";

    describe("A Core Module config", function () {

        var $ionicConfigProvider,
            $urlRouterProvider,
            appGlobals;

        beforeEach(function () {

            module("app.shared");

            module(function (_$ionicConfigProvider_, _$urlRouterProvider_) {
                $ionicConfigProvider = _$ionicConfigProvider_;
                $urlRouterProvider = _$urlRouterProvider_;

                $urlRouterProvider.otherwise = jasmine.createSpy("otherwise").and.callThrough();
                $ionicConfigProvider.backButton.text = jasmine.createSpy("text").and.callThrough();
                $ionicConfigProvider.backButton.previousTitleText = jasmine.createSpy("previousTitleText").and.callThrough();
            });

            module("app.components");
            module("app.shared");

            inject(function(_appGlobals_) {
                appGlobals = _appGlobals_;
            });
        });

        it("should set the default route to the expected value", function () {
            expect($urlRouterProvider.otherwise).toHaveBeenCalledWith(appGlobals.DEFAULT_ROUTE);
        });

        it("should set the back button text to the expected value", function () {
            expect($ionicConfigProvider.backButton.text).toHaveBeenCalledWith("");
        });

        it("should set the previous title text to be false", function () {
            expect($ionicConfigProvider.backButton.previousTitleText).toHaveBeenCalledWith(false);
        });

    });

})();