(function () {
    "use strict";

    angular.module("app.api", [])

        .run(function (Restangular, HttpResponseReporterInterceptor, AuthenticationErrorInterceptor) {

            /**
             * Set up Global Restangular Configuration
             */
            Restangular.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                return HttpResponseReporterInterceptor.response(data, response);
            });

            Restangular.addErrorInterceptor(function(response, deferred, responseHandler) {
                return HttpResponseReporterInterceptor.responseError(response);
            });

            Restangular.addErrorInterceptor(function(response, deferred, responseHandler) {
                return AuthenticationErrorInterceptor.responseError(response, deferred, responseHandler);
            });
        });

})();
