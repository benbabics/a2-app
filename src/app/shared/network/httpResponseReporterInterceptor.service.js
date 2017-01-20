(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function HttpResponseReporterInterceptor($rootScope, Network) {

        // Revealed Public members
        var service = {
            responseError: responseError,
            response     : response
        };

        return service;
        //////////////////////

        function responseError(responseObject) {

            if (isRemoteResponse(responseObject) && Network.isServerConnectionError(responseObject)) {
                $rootScope.$emit("network:serverConnectionError");
            }

            return true;
        }

        function response(data, responseObject) {

            if (isRemoteResponse(responseObject)) {
                $rootScope.$emit("network:serverConnectionSuccess");
            }

            return data;
        }

        function isRemoteResponse(responseObject) {
            return (responseObject.config && responseObject.config.url && !!responseObject.config.url.match(/^(http|\/)/));
        }

    }

    angular
        .module("app.shared.network")
        .factory("HttpResponseReporterInterceptor", HttpResponseReporterInterceptor);
})();
