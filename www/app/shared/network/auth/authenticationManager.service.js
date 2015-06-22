(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AuthenticationManager($q, FormEncoder, AuthenticationResource, UserManager, globals, CommonService, Logger) {

        // Private members
        var _ = CommonService._;

        // Revealed Public members
        var service = {
            authenticate         : authenticate,
            refreshAuthentication: refreshAuthentication,
            getUserCredentials   : getUserCredentials,
            userLoggedIn         : userLoggedIn,
            hasRefreshToken      : hasRefreshToken
        };

        activate();

        return service;
        //////////////////////

        function activate() {

        }

        function authenticate() {

            var data,
                credentials;

            credentials = this.getUserCredentials();

            data = FormEncoder.encode({
                    "grant_type": "password",
                    "username": credentials.username,
                    "password": credentials.password,
                    "scope": "read"
                });

            // Get a new token
            return getToken(credentials.username, data);
        }

        function refreshAuthentication() {
            var data,
                userProfile = UserManager.getProfile();

            data = FormEncoder.encode({
                "grant_type": "refresh_token",
                "refresh_token": userProfile.oauth.refresh_token || null
            });

            // Clear out the oauth object so that if the Refresh attempt fails we aren't keeping any invalid/expired tokens
            userProfile.logOut();

            // Refresh the token
            return getToken(userProfile.username, data);
        }

        function getToken(username, data) {

            var deferred = $q.defer();

            AuthenticationResource.post(data)
                .then(function (authResponse) {

                    if (authResponse.data) {

                        UserManager.setProfile(username, authResponse.data);
                        deferred.resolve();

                    }
                    // authResponse didn't give us data
                    else {
                        Logger.log("No data in Response from getting an Auth Token");
                        deferred.reject();
                    }
                },
                // get token failed
                function (response) {

                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    Logger.log("Getting Auth Token failed");

                    deferred.reject(response);

                });

            return deferred.promise;

        }

        function getUserCredentials() {
            // Abstracting these hard coded values for now
            // In the future we'll retrieve these from the user directly

            return globals.USER.CREDENTIALS;
        }

        function userLoggedIn() {
            return (!_.isEmpty(UserManager.getProfile().loggedIn));
        }

        function hasRefreshToken() {
            return (!_.isEmpty(UserManager.getProfile().oauth.refresh_token));
        }
    }

    angular
        .module("app.auth")
        .factory("AuthenticationManager", AuthenticationManager);
})();