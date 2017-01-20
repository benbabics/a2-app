(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("user", {
            abstract: true,
            url: "/user",
            views: {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });
    }

    angular.module("app.components.user")
        .config(configureRoutes);
}());
