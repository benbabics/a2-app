(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("user.auth", {
            abstract: true,
            url: "/auth"
        });

        $stateProvider.state("user.auth.login", {
            cache: false,
            url: "/login",
            views: {
                "view@user": {
                    templateUrl: "app/components/user/auth/templates/login.html",
                    controller: "LoginController as vm"
                }
            }
        });
    }

    angular.module("app.components.user.auth")
        .config(configureRoutes);
}());