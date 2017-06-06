(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:11

    /* @ngInject */
    function LoginManager($q, $ionicSideMenuDelegate, $rootScope,
                          AnalyticsUtil, LoadingIndicator, LoggerUtil, Popup, UserManager) {
        // Private members


        // Revealed Public members
        var service = {
            "logIn" : logIn,
            "logOut": logOut
        };

        return service;
        //////////////////////

        function logIn() {
            return doLoginInitialization().then(() => $rootScope.$emit("app:login"));
        }

        function logOut() {
            return doLogoutCleanup().then(() => $rootScope.$emit("app:logout"));
        }

        function doLoginInitialization() {
            LoadingIndicator.begin();

            return UserManager.fetchCurrentUserDetails()
                .then(sendAnalyticUserDetails)
                .catch(function (error) {
                    throw new Error("Failed to complete login initialization: " + LoggerUtil.getErrorMessage(error));
                })
                .finally(LoadingIndicator.complete);
        }

        function doLogoutCleanup() {
            //close any opened popups
            Popup.closeAllPopups();

            //close the side menu
            $ionicSideMenuDelegate.toggleRight(false);

            return $q.resolve();
        }

        function sendAnalyticUserDetails() {
            var user = UserManager.getUser();

            //track all events with the user's ID
            AnalyticsUtil.setUserId(user.id);

            if ( user.brand ) {
                AnalyticsUtil.setCustomDimension( 2, user.brand );
            }
        }

    }

    angular
        .module("app.components.user.auth")
        .factory("LoginManager", LoginManager);
})();
