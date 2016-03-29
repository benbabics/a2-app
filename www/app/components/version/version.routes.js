(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("version", {
            abstract: true,
            url     : "/version",
            views   : {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("version.status", {
            url  : "/status",
            cache: false,
            views: {
                "view@version": {
                    templateUrl: "app/components/version/templates/versionStatus.html",
                    controller : "VersionStatusController as vm",
                    resolve    : {
                        versionStatus: function(LoadingIndicator, VersionUtil) {
                            LoadingIndicator.begin();

                            return VersionUtil.determineVersionStatus()
                                .finally(function () {
                                    LoadingIndicator.complete();
                                });
                        }
                    }
                }
            },
            onEnter: function($cordovaSplashscreen, $interval, PlatformUtil) {
                //make sure the ionic platform is ready before hiding the splash screen
                PlatformUtil.waitForCordovaPlatform(function() {
                    $interval(function() {
                        $cordovaSplashscreen.hide();
                    }, 2000, 1);
                });
            }
        });
    }

    angular.module("app.components.version")
        .config(configureRoutes);
}());
