(function () {
    "use strict";

    angular.module("app.shared.api", [])

        .run(function (Restangular, AuthenticationErrorInterceptor, HttpResponseReporterInterceptor) {

            /**
             * Set up Global Restangular Configuration
             */
            // jshint maxparams:6
            Restangular.addResponseInterceptor(function (data, operation, what, url, response) { // args: data, operation, what, url, response, deferred
                return HttpResponseReporterInterceptor.response(data, response);
            });

            Restangular.addErrorInterceptor(function(response) { // args: response, deferred, responseHandler
                return HttpResponseReporterInterceptor.responseError(response);
            });

            Restangular.addErrorInterceptor(function(response, deferred, responseHandler) {
                return AuthenticationErrorInterceptor.responseError(response, deferred, responseHandler);
            });
        });

})();
