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
            onEnter: function($cordovaSplashscreen, $ionicPlatform, $timeout, CommonService) {
                //log out the user
                CommonService.logOut();

                //make sure the ionic platform is ready before hiding the splash screen
                $ionicPlatform.ready(function() {
                    $timeout(function() {
                        $cordovaSplashscreen.hide();
                    }, 2000);
                });
            }
        });
    }

    angular.module("app.components.user.auth")
        .config(configureRoutes);
}());