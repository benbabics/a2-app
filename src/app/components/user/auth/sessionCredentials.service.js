(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function sessionCredentials($rootScope, $q, SecureStorage) {
        var service = {
            set:   set,
            get:   get,
            reset: reset
        };

        // on session end, reset session credentials
        $rootScope.$on("app:logout", () => service.reset());

        return service;

        /**
         * Public Methods
        **/
        function set(credentials) {
            var promises;

            if ( !credentials.clientId || !credentials.clientSecret ) {
                return $q.reject();
            }

            promises = {
                clientId:     SecureStorage.set( "sessionClientId", credentials.clientId ),
                clientSecret: SecureStorage.set( "sessionClientSecret", credentials.clientSecret )
            };

            return $q.all( promises );
        }

        function get() {
            var promises = {
                clientId:     SecureStorage.get( "sessionClientId" ),
                clientSecret: SecureStorage.get( "sessionClientSecret" )
            };

            return $q.all( promises );
        }

        function reset() {
            var promises = {
                clientId:     SecureStorage.remove( "sessionClientId" ),
                clientSecret: SecureStorage.remove( "sessionClientSecret" )
            };

            return $q.all( promises );
        }
    }

    angular
        .module("app.components.user.auth")
        .factory("sessionCredentials", sessionCredentials);
})();
