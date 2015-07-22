(function () {
    "use strict";

    var urlConfig = function ($urlRouterProvider, appGlobals) {

        //set default route
        $urlRouterProvider.otherwise(appGlobals.DEFAULT_ROUTE);
    };


    var ionicConfig = function ($ionicConfigProvider) {

        // clear the default text from the back button
        $ionicConfigProvider.backButton.text("");
    };

    angular
        .module("app.components.core")
        .config(urlConfig)
        .config(ionicConfig);
})();