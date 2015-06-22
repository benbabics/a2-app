(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function Logger($log) {
        var isEnabled = false,
            service = {
                debug: debug,
                enabled: enabled,
                error: error,
                info: info,
                log: log,
                warn: warn
            };

        return service;
        //////////////////////

        function debug() {
            _enhanceLogging("debug", arguments);
        }

        function enabled(_enabled) {
            isEnabled = !!_enabled;
        }

        function error() {
            _enhanceLogging("error", arguments);
        }

        function info() {
            _enhanceLogging("info", arguments);
        }

        function log() {
            _enhanceLogging("log", arguments);
        }

        function warn() {
            _enhanceLogging("warn", arguments);
        }

        function _getFormattedTimestamp() {
            var currentDateTime = new Date();

            return currentDateTime.getHours() + ":" +
                currentDateTime.getMinutes() + ":" +
                currentDateTime.getSeconds() + ":" +
                currentDateTime.getMilliseconds();
        }

        function _enhanceLogging(loggingFunctionName, args) {
            var modifiedArguments;

            if (!isEnabled) {
                return;
            }

            modifiedArguments = [].slice.call(args);
            modifiedArguments[0] = [_getFormattedTimestamp() + ": "]  + modifiedArguments[0];
            $log[loggingFunctionName].apply(null, modifiedArguments);
        }
    }

    angular
        .module("app.shared.logger")
        .factory("Logger", Logger);
})();