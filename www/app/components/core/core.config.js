(function () {
    "use strict";

    var angularConfig = function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    };

    var urlConfig = function ($urlRouterProvider, appGlobals) {

        //set default route
        $urlRouterProvider.otherwise(appGlobals.DEFAULT_ROUTE);
    };

    var ionicConfig = function ($ionicConfigProvider) {

        // clear the default text from the back button
        $ionicConfigProvider.backButton.text("");

        // do not show the title of the previous page
        $ionicConfigProvider.backButton.previousTitleText(false);

    };

    var ngIdleConfig = function (appGlobals, IdleProvider) {
        //set the idle timeout length until the user is automatically logged out
        IdleProvider.idle(appGlobals.USER_IDLE_TIMEOUT);

        //disable user timeout warning response
        IdleProvider.timeout(false);
    };

    var ngStorageConfig = function ($localStorageProvider, appGlobals) {
        $localStorageProvider.setKeyPrefix(appGlobals.LOCALSTORAGE.CONFIG.keyPrefix);
    };

    angular
        .module("app.components.core")
        .config(angularConfig)
        .config(urlConfig)
        .config(ionicConfig)
        .config(ngStorageConfig)
        .config(ngIdleConfig);
})();
