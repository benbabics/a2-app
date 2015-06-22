(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function CommonService(_, $rootScope) {

        var service = {
            // common dependencies
            "_": _,

            // utility functions
            "maskAccountNumber"    : maskAccountNumber,
            "loadingBegin"         : loadingBegin,
            "loadingComplete"      : loadingComplete,
            "fieldHasError"        : fieldHasError
        },
            loadingIndicatorCount = 0;

        return service;
        //////////////////////

        // Common utility functions go here

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
    }

    angular
        .module("app.shared.core")
        .factory("CommonService", CommonService);
})();