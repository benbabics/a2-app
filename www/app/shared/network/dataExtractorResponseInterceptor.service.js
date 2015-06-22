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

        function response(data, operation) {
            var coreData = {},
                extractedData = operation === "getList" ? [{}] : {};

            if (!_.isEmpty(data)) {

                if (!_.isEmpty(data.data) && !_.isEmpty(data.data[0])) {

                    coreData = data.data[0];

                    // When the operation gets a Collection
                    if (coreData.searchResults) {
                        extractedData = coreData.searchResults;
                        extractedData.totalResults = coreData.totalResults;
                    }
                    // when the operation gets an Object
                    else {
                        extractedData = coreData;
                    }
                }
                else {
                    extractedData = data;
                }

                extractedData.message = data.message || null;
            }

            return extractedData;
        }

    }

    angular
        .module("app.network")
        .factory("DataExtractorResponseInterceptor", DataExtractorResponseInterceptor);
})();