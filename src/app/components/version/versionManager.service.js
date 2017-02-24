(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    // jshint maxparams:8
    /* @ngInject */
    function VersionManager($cordovaAppVersion, $q, globals, Logger, LoggerUtil, PlatformUtil, VersionsResource, VersionStatusModel) {

        // Revealed Public members
        var service = {
            determineVersionStatus: determineVersionStatus,
            fetchVersionStatus    : fetchVersionStatus
        };

        return service;
        //////////////////////

        function createVersionStatus(versionStatusResource) {
            var versionStatus = new VersionStatusModel();

            versionStatus["version"] = versionStatusResource.versionNumber;
            versionStatus["status"] = versionStatusResource.status;

            return versionStatus;
        }

        function determineVersionStatus() {

            var fetchVersionStatus = (versionNumber) => {
                var clientId = globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID,
                    platform = PlatformUtil.getPlatform();

                return this.fetchVersionStatus(clientId, platform, versionNumber);
            };

            return PlatformUtil.waitForCordovaPlatform()
                .then(() => {
                    if (!PlatformUtil.platformSupportsAppVersion()) {
                        Logger.warn("Platform does not support application versioning");

                        // Return "ok" to indicate that this platform cannot be updated
                        return $q.when(globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.NO_UPDATE);
                    }

                    return $cordovaAppVersion.getVersionNumber().then(fetchVersionStatus);
                })
                .catch((failureResponse) => {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Determining Version Status failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.warn(error);

                    // Return "ok" to indicate that as far as we know we are not out of date
                    return $q.when(globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.NO_UPDATE);
                });
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
