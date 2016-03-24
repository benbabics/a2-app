(function () {
    "use strict";

    describe("A Core Module config", function () {

        var $compileProvider,
            $ionicConfigProvider,
            $urlRouterProvider,
            IdleProvider,
            appGlobals;

        beforeEach(function () {

            module("app.shared");

            module(function (_$compileProvider_, _$ionicConfigProvider_, _$urlRouterProvider_, _IdleProvider_) {
                $ionicConfigProvider = _$ionicConfigProvider_;
                $urlRouterProvider = _$urlRouterProvider_;
                $compileProvider = _$compileProvider_;
                IdleProvider = _IdleProvider_;

                $compileProvider.imgSrcSanitizationWhitelist = jasmine.createSpy("imgSrcSanitizationWhitelist");
                $urlRouterProvider.otherwise = jasmine.createSpy("otherwise");
                $ionicConfigProvider.backButton.text = jasmine.createSpy("text");
                $ionicConfigProvider.backButton.previousTitleText = jasmine.createSpy("previousTitleText");
                IdleProvider.idle = jasmine.createSpy("idle");
                IdleProvider.timeout = jasmine.createSpy("timeout");
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

        it("should set the idle timeout length to the expected value", function () {
            expect(IdleProvider.idle).toHaveBeenCalledWith(appGlobals.USER_IDLE_TIMEOUT);
        });

        it("should disable user timeout warning response", function () {
            expect(IdleProvider.timeout).toHaveBeenCalledWith(false);
        });

    });

})();
