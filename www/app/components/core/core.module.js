(function () {
    "use strict";

    function coreRun($rootScope, $state, AuthenticationManager) {

        //when navigating to any page that isn't the login page, validate that the user is logged in
        function validateLoggedIn(event, toState, toParams, fromState, fromParams) {

            //if user is not logged in and is trying to access any other pages, redirect back to the login page
            if (toState.name !== "user.auth.login" && !AuthenticationManager.userLoggedIn()) {
                event.preventDefault();
                $state.go("user.auth.login");
            }
        }


        $rootScope.$on("$stateChangeStart", validateLoggedIn);
    }

    angular.module("app.components.core", [])
        .run(coreRun);
})();
