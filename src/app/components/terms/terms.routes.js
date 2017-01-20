(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("termsOfUse", {
            url  : "/termsOfUse",
            cache: false,
            views: {
                "@": {
                    templateUrl: "app/components/terms/templates/termsOfUse.html",
                    controller : "TermsOfUseController as vm"
                }
            }
        });
    }

    angular.module("app.components.terms")
        .config(configureRoutes);
}());
