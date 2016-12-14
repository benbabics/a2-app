/* Service provider for cordova-plugin-secure-storage */
(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    function StorageManager($localStorage, SecureStorage) {

        return {
            set   : set,
            get   : get,
            remove: remove
        };

        //Public functions:
        function set(key, value, options) {
            options = options || {};

            if (options.secure) {
                return SecureStorage.set(key, value);
            }
            else {
                return $localStorage[key] = value;
            }
        }

        function get(key, options) {
            options = options || {};

            if (options.secure) {
                return SecureStorage.get(key);
            }
            else {
                return $localStorage[key];
            }
        }

        function remove(key, options) {
            options = options || {};

            if (options.secure) {
                SecureStorage.remove(key);
            }
            else {
                delete $localStorage[key];
            }
        }
    }

    angular
        .module("app.shared.integration")
        .factory("StorageManager", StorageManager);
}());
