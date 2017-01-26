(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("settings", {
            url  : "/settings",
            cache: false,
            views: {
                "@": {
                    templateUrl: "app/components/settings/templates/settings.html",
                    controller:  "SettingsController as vm"
                }
            }
        });
    }

    angular.module("app.components.settings")
        .config(configureRoutes);
}());
