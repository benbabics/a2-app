(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function VersionsResource($q, globals, UnsecureConfigurationApiRestangular) {
        // Private members
        var versionsResource;

        // Revealed Public members
        var service = {
            getVersionStatus: getVersionStatus
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            versionsResource = UnsecureConfigurationApiRestangular.service(globals.CONFIGURATION_API.VERSIONS.BASE);
        }

        function getVersionStatus(searchCriteria) {
            return $q.when(versionsResource.one().doGET(globals.CONFIGURATION_API.VERSIONS.STATUS, searchCriteria));
        }

    }

    angular
        .module("app.components.version")
        .factory("VersionsResource", VersionsResource);
})();
