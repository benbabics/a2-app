(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AuthorizationHeaderRequestInterceptor(UserManager) {

        // Revealed Public members
        var service = {
            request: request
        };

        return service;
        //////////////////////

        function request(headers) {

            if (UserManager.getProfile().loggedIn) {
                headers.Authorization = "Bearer " + UserManager.getProfile().oauth.access_token;
            }

            return {headers: headers};
        }

    }

    angular
        .module("app.auth")
        .factory("AuthorizationHeaderRequestInterceptor", AuthorizationHeaderRequestInterceptor);
})();