(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function ServiceLogManager(_, $q, ServiceLogResource, Logger, LoggerUtil) {
        // Revealed Public members
        var service = {
            log: log
        };

        return service;
        //////////////////////

        function log(value) {
            if (_.isNil(value)) {
                var error = "Failed to log data. Missing log value.";
                Logger.error(error);
                return $q.reject(error);
            }

            return ServiceLogResource.postLog(value)
                .catch(function (failureResponse) {
                    var error = "Failed to log data to service log: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    return $q.reject(error);
                });
        }
    }

    angular
        .module("app.shared.serviceLog")
        .factory("ServiceLogManager", ServiceLogManager);
})();
