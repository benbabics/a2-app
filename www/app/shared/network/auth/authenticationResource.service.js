(function () {
    "use strict";

    /* @ngInject */
    function AuthenticationResource(AuthApiRestangular, globals) {
        return AuthApiRestangular.service(globals.AUTH_API.AUTH.TOKENS);
    }

    angular
        .module("app.auth")
        .factory("AuthenticationResource", AuthenticationResource);
})();