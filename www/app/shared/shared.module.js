(function () {
    "use strict";

    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    angular.module("app.shared", [

        /* Our reusable cross app modules */
        "app.shared.dependencies",
        "app.shared.core",
        "app.shared.network",
        "app.shared.auth",
        "app.shared.api",
        "app.shared.integration",
        "app.shared.logger",
        "app.shared.widgets"
    ])

        .run(function ($ionicPlatform, _, $rootScope, $ionicLoading, globals, Logger) {  // Services may be included here in order to force them to be instantiated at startup
            $ionicPlatform.ready(function () {

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
                //apply a proxy event for the cordova pause event
                document.addEventListener("pause", function () {
                    $rootScope.$broadcast("cordovaPause");
                }, false);

                //apply a proxy event for the cordova resume event
                document.addEventListener("resume", function () {
                    $rootScope.$broadcast("cordovaResume");
                }, false);

                /**
                 * Set up loading indicator
                 */
                $rootScope.$on("loadingBegin", function () {
                    $ionicLoading.show({
                        template: "<ion-spinner class='spinner-light'></ion-spinner>"
                    });
                });

                $rootScope.$on("loadingComplete", function () {
                    $ionicLoading.hide();
                });
            });

        });

})();
