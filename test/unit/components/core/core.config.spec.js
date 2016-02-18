(function () {
    "use strict";

    // TODO: Fix this test by mocking indexedDB
    xdescribe("A Core Module config", function () {

        var $compileProvider,
            $ionicConfigProvider,
            $urlRouterProvider,
            appGlobals;

        beforeEach(function () {

            module("app.shared");

            module(function (_$compileProvider_, _$ionicConfigProvider_, _$urlRouterProvider_) {
                $ionicConfigProvider = _$ionicConfigProvider_;
                $urlRouterProvider = _$urlRouterProvider_;
                $compileProvider = _$compileProvider_;

                $compileProvider.imgSrcSanitizationWhitelist = jasmine.createSpy("imgSrcSanitizationWhitelist");
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

        it("should set the img-src sanitization whitelist to the expected value", function () {
            expect($compileProvider.imgSrcSanitizationWhitelist).toHaveBeenCalledWith(/^\s*(https?|file|blob|cdvfile):|data:image\//);
        });

    });

})();