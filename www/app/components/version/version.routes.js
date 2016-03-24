(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("version", {
            abstract: true,
            url     : "/version"
        });

        $stateProvider.state("version.status", {
            url  : "/status",
            cache: false,
            views: {
                "view@version": {
                    controller : "VersionStatusController as vm"
                }
            }
        });
    }

    angular.module("app.components.version")
        .config(configureRoutes);
}());
