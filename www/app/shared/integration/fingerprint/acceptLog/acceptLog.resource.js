(function () {
    "use strict";
    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function FingerprintAcceptLogResource($q, globals, ConfigurationApiRestangular) {
        //Private members
        var CONFIGURATION_API = globals.CONFIGURATION_API,
            gkResource;

        // Revealed Public members
        var service = {
            post: post
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            gkResource = ConfigurationApiRestangular.service(CONFIGURATION_API.ACCEPT_TOUCH_ID.BASE);
        }

        function post() {
            return $q.when(gkResource.post());
        }
    }

    angular
        .module("app.shared.integration.fingerprint.acceptLog")
        .factory("FingerprintAcceptLogResource", FingerprintAcceptLogResource);
})();
