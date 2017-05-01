(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:11

    /* @ngInject */
    function LoginManager($q, $localStorage, $ionicSideMenuDelegate, $rootScope, globals,
                          AnalyticsUtil, LoadingIndicator, LoggerUtil, Popup, UserManager) {
        // Private members
        const USER_ID_KEY = globals.LOCALSTORAGE.KEYS.USER_ID;


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
                .then(setTrackerUserId)
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

        function setTrackerUserId() {
            var user = UserManager.getUser();

            //track all events with the user's ID
            AnalyticsUtil.setUserId(user.id);

            //store the user id for tracking during login
            $localStorage[USER_ID_KEY] = user.id;
        }

    }

    angular
        .module("app.components.user.auth")
        .factory("LoginManager", LoginManager);
})();
