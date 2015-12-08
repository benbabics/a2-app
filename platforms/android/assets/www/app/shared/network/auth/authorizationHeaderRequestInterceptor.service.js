(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AuthorizationHeaderRequestInterceptor(AuthenticationManager) {

        // Revealed Public members
        var service = {
            request: request
        };

        return service;
        //////////////////////

        function request(headers) {

            if (AuthenticationManager.userLoggedIn()) {
                headers.Authorization = AuthenticationManager.getAuthorizationHeader();
            }

            return {headers: headers};
        }

    }

    angular
        .module("app.shared.auth")
        .factory("AuthorizationHeaderRequestInterceptor", AuthorizationHeaderRequestInterceptor);
})();
