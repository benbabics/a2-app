(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    // jshint maxparams:5
    /* @ngInject */
    function PlatformUtil(_, $cordovaDevice, $ionicPlatform, $q, Logger, $cordovaNetwork) {
        // Private members
        var logCordovaPlatformWarning = _.once(function () {
                Logger.debug(
                    "waitForCordovaPlatform callback function skipped: Cordova is not available on this platform. " +
                    "Note: All future callbacks will also be skipped."
                );
            });

        // Revealed Public members
        var service = {
            "getPlatform"               : getPlatform,
            "platformHasCordova"        : platformHasCordova,
            "platformSupportsAppVersion": platformSupportsAppVersion,
            "waitForCordovaPlatform"    : waitForCordovaPlatform,
            "isOnline"                  : isOnline
        };

        return service;
        //////////////////////

        function getPlatform() {
            return $cordovaDevice.getPlatform();
        }

        function platformHasCordova() {
            return !!window.cordova;
        }

        function platformSupportsAppVersion() {
            return getPlatform() !== "browser";
        }

        function isOnline() {
            //when platform is a browser, $cordovaNetwork.isOnline() does not return true when it is online.
            if (getPlatform() === "browser") {
                return true;
            }
            return $cordovaNetwork.isOnline();
        }

        /**
         * Convenience function that executes a callback once Cordova/Ionic are ready and Cordova is available on the platform.
         *
         * @param {Function} [callback] A callback to execute when Cordova is ready and available.
         *
         * @return {Promise} a promise that will resolve when Cordova is ready and available, or reject if Cordova is not
         * available on the current platform. If a callback is given, the promise will resolve with the result of the callback.
         */
        function waitForCordovaPlatform(callback, failureCallback) {
            return $ionicPlatform.ready()
                .then(function () {
                    if (platformHasCordova()) {
                        //cordova is available, so execute the callback (if given)
                        if (_.isFunction(callback)) {
                            return callback();
                        }
                    }
                    else {
                        //Log the warning message (this only happens once per session)
                        logCordovaPlatformWarning();
                        if ( _.isFunction(failureCallback) ) {
                          failureCallback();
                        }
                        return $q.reject();
                    }
                });
        }
    }

    angular
        .module("app.shared.util")
        .factory("PlatformUtil", PlatformUtil);
})();
