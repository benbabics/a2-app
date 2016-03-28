(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    // jshint maxparams:7
    /* @ngInject */
    function VersionUtil($cordovaAppVersion, $q, globals, Logger, LoggerUtil, PlatformUtil, VersionManager) {
        // Revealed Public members
        var service = {
            "determineVersionStatus": determineVersionStatus
        };

        return service;
        //////////////////////

        function determineVersionStatus() {

            var fetchVersionStatus = function(versionNumber) {
                var clientId = globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID,
                    platform = PlatformUtil.getPlatform();

                return VersionManager.fetchVersionStatus(clientId, platform, versionNumber);
            };

            return PlatformUtil.waitForCordovaPlatform()
                .then(function() {
                    if (!PlatformUtil.platformSupportsAppVersion()) {
                        Logger.warn("Platform does not support application versioning");

                        // Return "ok" to indicate that this platform cannot be updated
                        return $q.when(globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.NO_UPDATE);
                    }

                    return $cordovaAppVersion.getVersionNumber().then(fetchVersionStatus);
                })
                .catch(function(failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Determining Version Status failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.warn(error);

                    // Return "ok" to indicate that as far as we know we are not out of date
                    return $q.when(globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.NO_UPDATE);
                });
        }
    }

    angular
        .module("app.components.version")
        .factory("VersionUtil", VersionUtil);
})();
