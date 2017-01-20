(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function FingerprintAcceptLogManager($q, FingerprintAcceptLogResource, Logger, LoggerUtil) {
        // Revealed Public members
        var service = {
            log: log
        };

        return service;
        //////////////////////

        function log() {
            return FingerprintAcceptLogResource.post()
                .catch(function (failureResponse) {
                    var error = "Failed to log to fingerprint acceptance log: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    return $q.reject(error);
                });
        }
    }

    angular
        .module("app.shared.integration.fingerprint.acceptLog")
        .factory("FingerprintAcceptLogManager", FingerprintAcceptLogManager);
})();
