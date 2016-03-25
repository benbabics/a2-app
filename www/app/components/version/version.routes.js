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
                    controller : "VersionStatusController as vm"
                }
            }
        });
    }

    angular.module("app.components.version")
        .config(configureRoutes);
}());
