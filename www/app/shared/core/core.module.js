(function () {
    "use strict";

    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    angular.module("app.core", [
        /* Angular and Ionic modules */
        "ionic",
        "ngAnimate",
        "base64",
        "ui.router",
        //"ui.mask",

        /* Our reusable cross app modules */
        "app.storage",
        "app.network",
        "app.auth",
        "app.api",
        "app.integration",
        "app.logger",

        /* 3rd Party modules */
        "restangular",                // From https://github.com/mgonto/restangular
        //"angular-svg-round-progress", // From https://github.com/crisbeto/angular-svg-round-progressbar
        //"ngFitText",                  // From https://github.com/patrickmarabeas/ng-FitText.js
        "ngCordova"                   // From https://github.com/driftyco/ng-cordova
    ])

    .run(function ($ionicPlatform, _, $rootScope, $ionicLoading, globals, Logger) {  // Services may be included here in order to force them to be instantiated at startup
        $ionicPlatform.ready(function() {

            /**
             * app start up code goes in here
              */

            /**
             * Set up Logging
             */
            Logger.enabled(globals.LOGGING.ENABLED);

            /**
             * Set up Event Listeners
             */
            //apply a proxy event for the cordova resume event
            document.addEventListener("resume", function () {
                $rootScope.$broadcast("cordovaResume");
            }, false);

            //apply a proxy event for the cordova online event
            document.addEventListener("online", function () {
                $rootScope.$broadcast("cordovaOnline");
            }, false);

            //apply a proxy event for the cordova offline event
            document.addEventListener("offline", function () {
                $rootScope.$broadcast("cordovaOffline");
            }, false);

            /**
             * Set up loading indicator
             */
            $rootScope.$on("loadingBegin", function() {
                $ionicLoading.show({
                    template: "<ion-spinner class='spinner-light'></ion-spinner>"
                });
            });

            $rootScope.$on("loadingComplete", function() {
                $ionicLoading.hide();
            });
        });

    });

})();
