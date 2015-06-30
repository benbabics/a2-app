(function () {
    "use strict";

    angular.module("app.shared.api", [])

        .run(function (Restangular, HttpResponseReporterInterceptor) {

            /**
             * Set up Global Restangular Configuration
             */
            Restangular.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                return HttpResponseReporterInterceptor.response(data, response);
            });

            Restangular.addErrorInterceptor(function(response, deferred, responseHandler) {
                return HttpResponseReporterInterceptor.responseError(response);
            });
        });

})();
