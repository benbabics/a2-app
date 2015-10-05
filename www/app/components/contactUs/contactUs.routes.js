(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("contactUs", {
            url  : "/contactUs",
            cache: false,
            views: {
                "@": {
                    templateUrl: "app/components/contactUs/templates/contactUs.html",
                    controller : "ContactUsController as vm"
                }
            }
        });
    }

    angular.module("app.components.contactUs")
        .config(configureRoutes);
}());
