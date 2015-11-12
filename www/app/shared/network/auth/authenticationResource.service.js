(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function AuthenticationResource($q, AuthApiRestangular, globals) {
        // Private members
        var authenticationResource;

        // Revealed Public members
        var service = {
            authenticate: authenticate
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            authenticationResource = AuthApiRestangular.service(globals.AUTH_API.AUTH.TOKENS);
        }

        function authenticate(credentials) {
            return $q.when(authenticationResource.post(credentials));
        }

    }

    angular
        .module("app.shared.auth")
        .factory("AuthenticationResource", AuthenticationResource);
})();
