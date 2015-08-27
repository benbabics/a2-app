(function () {
    "use strict";

    //TODO - Move as much logic out of here as possible

    function coreRun($rootScope, $state, $ionicPlatform, globals, AuthenticationManager, CommonService) {

        function isLoginPage(stateName) {
            return globals.LOGIN_STATE === stateName;
        }

        function validateRoutePreconditions(event, toState, toParams, fromState, fromParams) {

            var stateName = toState.name;

            if (!isLoginPage(stateName)) {
                // when navigating to any page that isn't the login page, validate that the user is logged in
                if (!AuthenticationManager.userLoggedIn()) {
                    // user is not logged in and is not trying to access the login page so redirect to the login page
                    event.preventDefault();
                    $state.go(globals.LOGIN_STATE);
                }
            }
        }

        function pauseApplication() {
            // log out the user
            AuthenticationManager.logOut();
        }

        function resumeApplication() {
            // Close any opened popups
            CommonService.closeAllPopups();

            // Go to the login page
            $state.go(globals.LOGIN_STATE);
        }

        //app must be set to fullscreen so that ionic headers are the correct size in iOS
        //see: http://forum.ionicframework.com/t/ion-nav-bar-top-padding-in-ios7/2488/12
        $ionicPlatform.ready(function() {
            ionic.Platform.fullScreen(true, true);
        });

        $rootScope.$on("$stateChangeStart", validateRoutePreconditions);
        $rootScope.$on("cordovaPause", pauseApplication);
        $rootScope.$on("cordovaResume", resumeApplication);
    }

    angular.module("app.components.core", [])
        .run(coreRun);
})();
