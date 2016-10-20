(function () {
    "use strict";
    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function ServiceLogResource($q, globals, ConfigurationApiRestangular) {
        //Private members
        var CONFIGURATION_API = globals.CONFIGURATION_API,
            gkResource;

        // Revealed Public members
        var service = {
            postLog: postLog
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            gkResource = ConfigurationApiRestangular.service(CONFIGURATION_API.BASE_URL);
        }

        function postLog(value) {
            return $q.when(gkResource.post(CONFIGURATION_API.SERVICE_LOG.BASE, value));
        }
    }

    angular
        .module("app.shared.serviceLog")
        .factory("ServiceLogResource", ServiceLogResource);
})();
