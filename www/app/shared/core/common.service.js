(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function CommonService(_, $ionicPopup, $rootScope, globals) {

        // Private members
        var loadingIndicatorCount = 0;

        // Revealed Public members
        var service = {
            // common dependencies
            "_": _,

            // utility functions
            "displayAlert"     : displayAlert,
            "maskAccountNumber": maskAccountNumber,
            "loadingBegin"     : loadingBegin,
            "loadingComplete"  : loadingComplete,
            "fieldHasError"    : fieldHasError,
            "getErrorMessage"  : getErrorMessage
        };

        return service;
        //////////////////////

        // Common utility functions go here

        function displayAlert(options) {
            var mappedOptions = {};

            if (_.isObject(options)) {
                // Only set the options if they are provided as setting them to a option NOT specified
                // results in us passing undefined values which may or may not be acceptable
                if (_.isString(options.title)) {
                    mappedOptions.title = options.title;
                }

                if (_.isString(options.subTitle)) {
                    mappedOptions.subTitle = options.subTitle;
                }

                mappedOptions.cssClass = options.cssClass || "wex-alert-popup";

                if (_.isString(options.content)) {
                    mappedOptions.template = options.content;
                }

                if (_.isString(options.buttonText)) {
                    mappedOptions.okText = options.buttonText;
                }

                if (_.isString(options.buttonCssClass)) {
                    mappedOptions.okType = options.buttonCssClass;
                }
            }
            else {
                mappedOptions = {
                    cssClass: "wex-alert-popup"
                };
            }

            var alertPopup = $ionicPopup.alert(mappedOptions);

            alertPopup.then(function (resolution) {
                // close popup
            });
        }

        function maskAccountNumber(accountNumber) {

            var maskedNumber = "";

            if (!_.isEmpty(accountNumber)) {
                // Replace all but the last 4 characters with *
                maskedNumber = accountNumber.replace(/.(?=.{4})/g, "*");
            }

            return maskedNumber;
        }

        function loadingBegin() {
            if (loadingIndicatorCount === 0) {
                $rootScope.$broadcast("loadingBegin");
            }

            loadingIndicatorCount++;
        }

        function loadingComplete() {
            loadingIndicatorCount--;

            if (loadingIndicatorCount === 0) {
                $rootScope.$broadcast("loadingComplete");
            }
        }

        function fieldHasError(field) {
            return (field && field.$error && !_.isEmpty(field.$error));
        }

        /**
         * Decomposes the errorObject and pulls out the appropriate values with details about the
         * error whether it's the response of a failed remote request or simply a string message.
         *
         * @param errorObject
         * @return string the error message
         */
        function getErrorMessage(errorObject) {

            var errorMessage = "";

            if (_.isString(errorObject)) {
                errorMessage = errorObject;
            }
            else if (_.isObject(errorObject.data)) {
                errorMessage += errorObject.data.error ? errorObject.data.error + ": " : "";
                errorMessage += errorObject.data.error_description || "";
            }

            if (_.isEmpty(errorMessage)) {
                errorMessage = globals.GENERAL.ERRORS.UNKNOWN_EXCEPTION;
            }

            return errorMessage;
        }
    }

    angular
        .module("app.shared.core")
        .factory("CommonService", CommonService);
})();