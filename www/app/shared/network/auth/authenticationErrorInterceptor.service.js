(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AuthenticationErrorInterceptor($injector, AuthenticationManager, AuthorizationHeaderRequestInterceptor, Logger) {

        // Revealed Public members
        var service = {
            responseError: responseError
        };

        return service;
        //////////////////////

        function responseError(rejection, deferred, responseHandler) {

            if (rejection.status === 401) {

                // The Access Token has probably expired
                if (AuthenticationManager.userLoggedIn() && AuthenticationManager.hasRefreshToken()) {

                    // Try refreshing the Access Token
                    refreshAuthentication(rejection, deferred, responseHandler)
                        .catch(function () {
                            handleUnrecoverableError(rejection, deferred);
                        });

                }
                // We haven't gotten an Access Token yet
                else {
                    // Get an Access Token
                    authenticate(rejection, deferred, responseHandler);
                    //TODO - Either remove or uncomment this once the changes to authenticate have been made to go to the login page
                        //.catch(function () {
                        //    handleUnrecoverableError(rejection, deferred);
                        //});
                }

                return false;

            }

            /* If not an authentication related error do nothing with this error.
             * This is necessary to make a "responseError"
             * interceptor a no-op. */
            return true;
        }

        function refreshAuthentication(originalFailedResponse, deferred, responseHandler) {
            return AuthenticationManager.refreshAuthentication()
                .then(function() {

                    // When Authentication successful, retry the previous failed request
                    return retryFailedRequest(originalFailedResponse.config, deferred, responseHandler);

                })
                .catch(function (failedRefreshError) {

                    Logger.log(failedRefreshError);

                    // Refresh didn't work - try getting a new Access Token and Refresh Token
                    return authenticate(originalFailedResponse, deferred, responseHandler);

                });
        }

        function authenticate(originalFailedResponse, deferred, responseHandler) {
            // TODO - Do something that results in the login page being displayed
            // TODO - Stretch goal - Remember what the user was trying to do and do it after auth

            return false;
        }

        function retryFailedRequest(failedRequest, deferred, responseHandler) {
            // Because no request interceptors are called this way, let's add the authorization header to the original request
            AuthorizationHeaderRequestInterceptor.request(failedRequest.headers);

            $injector.get("$http")(failedRequest).then(responseHandler, deferred.reject);

            return false;
        }

        function handleUnrecoverableError(failedRequest, deferred) {
            Logger.log("AuthenticationErrorInterceptor unable to handle the error.");
            deferred.reject(failedRequest);
        }
    }

    angular
        .module("app.shared.auth")
        .factory("AuthenticationErrorInterceptor", AuthenticationErrorInterceptor);
})();