(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function UserManager($rootScope, Logger, LoggerUtil, UserModel, UsersResource) {
        // Private members
        var user = {};

        // Revealed Public members
        var service = {
            fetchCurrentUserDetails: fetchCurrentUserDetails,
            getUser                : getUser,
            setUser                : setUser
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("app:logout", clearCachedValues);

            clearCachedValues();
        }

        function clearCachedValues() {
            user = new UserModel();
        }

        function fetchCurrentUserDetails() {

            return UsersResource.getDetails()
                .then(function (currentUserDetailsResponse) {
                    if (currentUserDetailsResponse && currentUserDetailsResponse.data) {
                        getUser().set(currentUserDetailsResponse.data);
                        return getUser();
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the current user");
                        throw new Error("No data in Response from getting the current user");
                    }
                })
                // get token failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Current User failed: " + LoggerUtil.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });

        }

        function getUser() {
            return user;
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setUser(userInfo) {
            user = userInfo;
        }

    }

    angular
        .module("app.components.user")
        .factory("UserManager", UserManager);
})();
