(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AuthenticationManager($q, FormEncoder, AuthenticationResource, UserManager, CommonService, Logger) {

        // Private members
        var _ = CommonService._,
            oauth;

        // Revealed Public members
        var service = {
            authenticate          : authenticate,
            refreshAuthentication : refreshAuthentication,
            userLoggedIn          : userLoggedIn,
            hasRefreshToken       : hasRefreshToken,
            getAuthorizationHeader: getAuthorizationHeader,
            logOut                : logOut,
            //TODO - Remove this once we figure out how to test without being able to set the token
            setToken              : setToken
        };

        return service;
        //////////////////////

        function authenticate(username, password) {

            var data = FormEncoder.encode({
                "grant_type": "password",
                "username": username,
                "password": password,
                "scope": "read"
            });

            // Get a new token
            return getToken(username, data);
        }

        function refreshAuthentication() {
            var data;

            data = FormEncoder.encode({
                "grant_type": "refresh_token",
                "refresh_token": oauth.refresh_token || null
            });

            // Log the user out so that if the Refresh attempt fails we aren't keeping any invalid/expired tokens
            logOut();

            // Refresh the token
            return getToken(UserManager.getUsername(), data);
        }

        function getToken(username, data) {

            return $q.when(AuthenticationResource.post(data))
                .then(function (authResponse) {

                    if (authResponse.data) {

                        oauth = authResponse.data;

                        UserManager.setUsername(username);
                        return authResponse.data;

                    }
                    // authResponse didn't give us data
                    else {
                        Logger.error("No data in Response from getting an Auth Token");
                        throw new Error("No data in Response from getting an Auth Token");
                    }
                })
                // get token failed
                .catch(function (failureResponse) {
                    var error = CommonService.getErrorMessage(failureResponse);

                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors
                    Logger.error("Getting Auth Token failed: " + error);
                    throw new Error("Getting Auth Token failed: " + error);
                });

        }

        function userLoggedIn() {
            return (!_.isEmpty(oauth));
        }

        function hasRefreshToken() {
            return (!_.isEmpty(oauth.refresh_token));
        }

        function getAuthorizationHeader() {
            if (userLoggedIn()) {
                return "Bearer " + oauth.access_token;
            }

            return null;
        }

        function logOut() {
            oauth = null;
        }

        function setToken(token) {
            oauth = token;
        }
    }

    angular
        .module("app.shared.auth")
        .factory("AuthenticationManager", AuthenticationManager);
})();