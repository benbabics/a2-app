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
            // jshint maxparams:6
            onEnter: function($cordovaSplashscreen, $interval, globals, AnalyticsUtil, LoginManager, CommonService) {
                //log out the user
                LoginManager.logOut();

                //make sure the ionic platform is ready before hiding the splash screen
                CommonService.waitForCordovaPlatform(function() {
                    $interval(function() {
                        $cordovaSplashscreen.hide();
                    }, 2000, 1);
                });

                AnalyticsUtil.trackView(globals.USER_LOGIN.CONFIG.ANALYTICS.pageName);
            }
        });
    }

    angular.module("app.components.user.auth")
        .config(configureRoutes);
}());
