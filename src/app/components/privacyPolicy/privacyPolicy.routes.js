(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("privacyPolicy", {
            url  : "/privacyPolicy",
            cache: false,
            views: {
                "@": {
                    templateUrl: "app/components/privacyPolicy/templates/privacyPolicy.html",
                    controller : "PrivacyPolicyController as vm"
                }
            }
        });
    }

    angular.module("app.components.privacyPolicy")
        .config(configureRoutes);
}());
