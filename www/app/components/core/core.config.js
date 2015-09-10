(function () {
    "use strict";

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

    var ngStorageConfig = function ($localStorageProvider, appGlobals) {
        $localStorageProvider.setKeyPrefix(appGlobals.LOCALSTORAGE.CONFIG.keyPrefix);
    };

    angular
        .module("app.components.core")
        .config(urlConfig)
        .config(ionicConfig)
        .config(ngStorageConfig);
})();