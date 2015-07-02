(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("landing", {
            url: "/landing",
            views: {
                "@": {
                    templateUrl: "app/components/landing/templates/landing.html",
                    controller: "LandingController as vm"
                }
            }
        });
    }

    angular.module("app.components.landing")
        .config(configureRoutes);
}());
