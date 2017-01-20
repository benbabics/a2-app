(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function DataExtractorResponseInterceptor(_) {

        // Revealed Public members
        var service = {
            response: response
        };

        return service;
        //////////////////////

        function response(responseData, operation) {

            var extractedData = operation === "getList" ? [{}] : {};

            // This check allows for primitive types (number, boolean) and 0-length strings as response data.
            // Otherwise the response would become {} .
            if (!_.isNil(responseData) && !_.isObject(responseData) ) {
                return responseData;
            }

            if (!_.isEmpty(responseData)) {

                if (_.isObject(responseData)) {

                    if (_.has(responseData, "data")) {
                        extractedData = responseData.data;

                        if (_.has(responseData, "totalResults")) {
                            extractedData.totalResults = responseData.totalResults;
                        }
                    }
                    else {
                        extractedData = responseData;
                    }

                    extractedData.message = responseData.message || null;
                }
                else {
                    extractedData = responseData;
                }

            }

            return extractedData;
        }

    }

    angular
        .module("app.shared.network")
        .factory("DataExtractorResponseInterceptor", DataExtractorResponseInterceptor);
})();
