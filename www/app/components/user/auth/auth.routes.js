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
            url: "/login?reason",
            views: {
                "view@user": {
                    templateUrl: "app/components/user/auth/templates/login.html",
                    controller: "LoginController as vm"
                }
            },
            onEnter: function(AuthenticationManager) {
                //log out the user
                AuthenticationManager.logOut();
            }
        });
    }

    angular.module("app.components.user.auth")
        .config(configureRoutes);
}());