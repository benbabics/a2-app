(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function LocalStorage($window) {
        var service = {
            set: set,
            get: get,
            setObject: setObject,
            getObject: getObject
        };

        return service;
        //////////////////////

        function set(key, value) {
            $window.localStorage[key] = value;
        }

        function get(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }

        function setObject(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        function getObject(key) {
            return JSON.parse($window.localStorage[key] || "{}");
        }
    }

    angular
        .module("app.storage")
        .factory("LocalStorage", LocalStorage);
})();