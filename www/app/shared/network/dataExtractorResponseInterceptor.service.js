(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function DataExtractorResponseInterceptor() {
        // Revealed Public members
        var service = {
            response: response
        };

        return service;
        //////////////////////

        function response(responseData, operation) {

            var extractedData = operation === "getList" ? [{}] : {};

            if (!_.isEmpty(responseData)) {

                if (!_.isEmpty(responseData.data) && !_.isEmpty(responseData.data[0])) {
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

            return extractedData;
        }

    }

    angular
        .module("app.shared.network")
        .factory("DataExtractorResponseInterceptor", DataExtractorResponseInterceptor);
})();