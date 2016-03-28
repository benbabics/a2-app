(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function VersionManager(Logger, LoggerUtil, VersionsResource, VersionStatusModel) {

        // Revealed Public members
        var service = {
            fetchVersionStatus: fetchVersionStatus
        };

        return service;
        //////////////////////

        function createVersionStatus(versionStatusResource) {
            var versionStatus = new VersionStatusModel();
            versionStatus.set(versionStatusResource);

            return versionStatus;
        }

        function fetchVersionStatus(clientId, platform, versionNumber) {
            var params = {
                clientId     : clientId,
                platform     : platform,
                versionNumber: versionNumber
            };

            return VersionsResource.getVersionStatus(params)
                .then(function (versionStatusResponse) {
                    if (versionStatusResponse && versionStatusResponse.data) {
                        return createVersionStatus(versionStatusResponse.data);
                    }
                    // no data in the response
                    else {
                        var error = "No response from getting the Version Status";

                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Version Status failed: " + LoggerUtil.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });

        }

    }

    angular
        .module("app.components.version")
        .factory("VersionManager", VersionManager);
})();
