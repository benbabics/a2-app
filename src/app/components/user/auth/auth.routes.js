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
            url: "/login?errorReason&toState&{timedOut:bool}&{logOut:bool}",
            views: {
                "view@user": {
                    templateUrl: "app/components/user/auth/templates/login.html",
                    controller: "LoginController as vm"
                }
            },
            // jshint maxparams:5
            onEnter: function($cordovaSplashscreen, $interval, globals, AnalyticsUtil, LoginManager, PlatformUtil) {
                //log out the user
                LoginManager.logOut();

                //make sure the ionic platform is ready before hiding the splash screen
                PlatformUtil.waitForCordovaPlatform(function() {
                    $cordovaSplashscreen.hide();
                });

                AnalyticsUtil.trackView(globals.USER_LOGIN.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("user.auth.check", {
            cache: false,
            url: "/check?state",
            resolve: {
                redirect: function (_, globals, $q, $state, $stateParams, AuthenticationManager) {
                    return $q.reject()
                        .finally(function () {
                            if (AuthenticationManager.userLoggedIn() && _.has($stateParams, "state")) {
                                $state.go($stateParams.state);
                            }
                            else {
                                $state.go(globals.LOGIN_STATE, {toState: $stateParams.state});
                            }
                        });
                }
            }
        });
    }

    angular.module("app.components.user.auth")
        .config(configureRoutes);
}());
