(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function NavigationUtil($state, globals, ElementUtil, Logger) {
        // Revealed Public members
        var service = {
            "exitApp"      : exitApp,
            "goToBackState": goToBackState
        };

        return service;
        //////////////////////

        function exitApp() {
            //close the app (this does not work on iOS since it does not allow apps to close themselves)
            if (navigator.app) {
                navigator.app.exitApp();
            }

            //app couldn't be closed (i.e. on iOS or a browser, so just go back to the login page)
            $state.go(globals.LOGIN_STATE);
        }

        /**
         * Goes to the back state specified by a given back button.
         *
         * @param {jqLite} [backButton] The back button to use (default: the active back button)
         * @return {Boolean} True if the call is successful
         * @throws {Error} Throws error if the back button couldn't be found
         */
        function goToBackState(backButton) {
            var backButtonScope;

            backButton = backButton || ElementUtil.findActiveBackButton();

            //if there is a back button, call its goBack function
            if (backButton) {
                backButtonScope = backButton.isolateScope();
                if (backButtonScope) {
                    backButtonScope.goBack();
                    return true;
                }
            }

            var error = "Couldn't find the back button to go the back state";
            Logger.error(error);
            throw new Error(error);
        }
    }

    angular
        .module("app.shared.util")
        .factory("NavigationUtil", NavigationUtil);
})();
