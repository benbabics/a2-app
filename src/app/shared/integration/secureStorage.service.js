/* Service provider for cordova-plugin-secure-storage */
(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function SecureStorage(_, $q, globals, Logger, LoggerUtil, PlatformUtil) {
        var secureStorage,
            availableDeferred = $q.defer();

        init();

        return {
            isAvailable: isAvailable,
            set        : set,
            get        : get,
            remove     : remove
        };

        //Public functions:
        function isAvailable() {
            return availableDeferred.promise;
        }

        function set(key, value) {
            return whenReady(function (secureStorage) {
                var deferred = $q.defer();

                secureStorage.set(deferred.resolve, deferred.reject, key, value);

                return deferred.promise;
            });
        }

        function get(key) {
            return whenReady(function (secureStorage) {
                var deferred = $q.defer();

                secureStorage.get(deferred.resolve, deferred.reject, key);

                return deferred.promise;
            });
        }

        function remove(key) {
            return whenReady(function (secureStorage) {
                var deferred = $q.defer();

                secureStorage.remove(deferred.resolve, deferred.reject, key);

                return deferred.promise;
            });
        }

        //Private functions:
        function init() {
            PlatformUtil.waitForCordovaPlatform(function () {
                //initialize SecureStorage plugin
                secureStorage = new cordova.plugins.SecureStorage(
                    availableDeferred.resolve,
                    availableDeferred.reject,
                    globals.LOCALSTORAGE.CONFIG.keyPrefix
                );

                return availableDeferred.promise
                    .catch(function (error) {
                        Logger.info("SecureStorage is not available on this device. " + LoggerUtil.getErrorMessage(error));
                        return $q.reject(error);
                    });
            });
        }

        function whenReady(callback) {
            return PlatformUtil.waitForCordovaPlatform(function () {
                return secureStorage || $q.reject(new Error("SecureStorage is not available."));
            }).then(callback || _.noop);
        }
    }

    angular
        .module("app.shared.integration")
        .factory("SecureStorage", SecureStorage);
}());
