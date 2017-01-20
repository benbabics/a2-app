(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function SecureApiRestangular(Restangular, ApiRestangular, AuthorizationHeaderRequestInterceptor) {

        // Revealed Public members
        var service = Restangular.withConfig(setUpConfiguration);

        service.customizeConfiguration = customizeConfiguration;

        activate();

        return service;
        //////////////////////

        function activate() {
            customizeConfiguration(service);
        }

        function customizeConfiguration(newConfig) {
            ApiRestangular.customizeConfiguration(newConfig);
        }

        function setUpConfiguration(RestangularConfigurer) {
            ApiRestangular.setUpConfiguration(RestangularConfigurer);

            // jshint maxparams:5
            RestangularConfigurer.addFullRequestInterceptor(function (element, operation, what, url, headers) { // args: element, operation, what, url, headers, params
                return AuthorizationHeaderRequestInterceptor.request(headers);
            });
        }

    }

    angular
        .module("app.shared.api")
        .factory("SecureApiRestangular", SecureApiRestangular);
})();
