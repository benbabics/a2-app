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
            url: "/login?errorReason&{timedOut:bool}&{logOut:bool}",
            views: {
                "view@user": {
                    templateUrl: "app/components/user/auth/templates/login.html",
                    controller: "LoginController as vm"
                }
            },
            // jshint maxparams:5
            onEnter: function($cordovaSplashscreen, $interval, globals, AnalyticsUtil, LoginManager) {
                //log out the user
                LoginManager.logOut();

                AnalyticsUtil.trackView(globals.USER_LOGIN.CONFIG.ANALYTICS.pageName);
            }
        });
    }

    angular.module("app.components.user.auth")
        .config(configureRoutes);
}());
