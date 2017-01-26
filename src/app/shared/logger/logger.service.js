(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function Logger($log) {
        var _isEnabled = false,
            service = {
                debug    : debug,
                enabled  : enabled,
                error    : error,
                info     : info,
                isEnabled: isEnabled,
                log      : log,
                warn     : warn
            };

        return service;
        //////////////////////

        function debug() {
            _enhanceLogging("debug", arguments);
        }

        function enabled(_enabled) {
            _isEnabled = !!_enabled;
        }

        function error() {
            _enhanceLogging("error", arguments);
        }

        function info() {
            _enhanceLogging("info", arguments);
        }

        function isEnabled() {
            return _isEnabled;
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

            if (!_isEnabled) {
                return;
            }

            modifiedArguments = [].slice.call(args);
            modifiedArguments[0] = [_getFormattedTimestamp() + ": "] + modifiedArguments[0];
            $log[loggingFunctionName].apply(null, modifiedArguments);
        }
    }

    angular
        .module("app.shared.logger")
        .factory("Logger", Logger);
})();
