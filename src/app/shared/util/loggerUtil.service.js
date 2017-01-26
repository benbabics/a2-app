(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function LoggerUtil(_, globals) {
        // Revealed Public members
        var service = {
            "getErrorMessage": getErrorMessage
        };

        return service;
        //////////////////////

        /**
         * Decomposes the errorObject and pulls out the appropriate values with details about the
         * error whether it's the response of a failed remote request or simply a string message.
         *
         * @param errorObject
         * @return string the error message
         */
        function getErrorMessage(errorObject) {

            var errorMessage = "";

            if (_.isArray(errorObject)) {
                errorMessage = _.reduce(errorObject, function (message, error) {
                    return message + "\n- " + getErrorMessage(error);
                }, "");
            }
            else if (_.isString(errorObject)) {
                errorMessage = errorObject;
            }
            // if an Error class object
            else if (_.has(errorObject, "message")) {
                errorMessage = getErrorMessage(errorObject.message);
            }
            else if (_.has(errorObject, "error")) {
                errorMessage += getErrorMessage(errorObject.error);
            }
            else if (_.has(errorObject, "error_description")) {
                errorMessage += ": " + getErrorMessage(errorObject.error_description);
            }
            else if (_.has(errorObject, "data")) {
                errorMessage += getErrorMessage(errorObject.data);
            }

            if (_.isEmpty(errorMessage)) {
                errorMessage = globals.GENERAL.ERRORS.UNKNOWN_EXCEPTION;
            }

            return errorMessage;
        }
    }

    angular
        .module("app.shared.util")
        .factory("LoggerUtil", LoggerUtil);
})();
