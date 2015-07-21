(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UserManager($q, CommonService, globals, Logger, UserModel, UsersResource) {
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
            user = new UserModel();
        }

        function fetchCurrentUserDetails() {

            return $q.when(UsersResource.one().doGET(globals.ACCOUNT_MAINTENANCE_API.USERS.CURRENT))
                .then(function (currentUserDetailsResponse) {
                    if (currentUserDetailsResponse && currentUserDetailsResponse.data) {
                        setUser(currentUserDetailsResponse.data);
                        return user;
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

                    var error = "Getting Current User failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });

        }

        function getUser() {
            return user;
        }

        function setUser(userInfo) {
            user = userInfo;
        }

    }

    angular
        .module("app.components.user")
        .factory("UserManager", UserManager);
})();