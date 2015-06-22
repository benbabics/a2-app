(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function HttpResponseReporterInterceptor($rootScope) {

        // Revealed Public members
        var service = {
            responseError: responseError,
            response     : response
        };

        return service;
        //////////////////////

        function responseError(responseObject) {

            if (isRemoteResponse(responseObject) && (responseObject.status === 404 || responseObject.status === 503)) {
                $rootScope.$broadcast("serverConnectionError");
            }

            return true;
        }

        function response(data, responseObject) {

            if (isRemoteResponse(responseObject)) {
                $rootScope.$broadcast("serverConnectionSuccess");
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