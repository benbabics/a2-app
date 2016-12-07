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
                        versionStatus: function(LoadingIndicator, VersionManager) {
                            LoadingIndicator.begin();

                            return VersionManager.determineVersionStatus()
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
                        $cordovaSplashscreen.hide();
                });
            }
        });
    }

    angular.module("app.components.version")
        .config(configureRoutes);
}());
