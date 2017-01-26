(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UnsecureConfigurationApiRestangular(globals, ApiRestangular) {

        // Revealed Public members
        var service = ApiRestangular.withConfig(setUpConfiguration);

        activate();

        return service;
        //////////////////////

        function activate() {
            ApiRestangular.customizeConfiguration(service);
        }

        function setUpConfiguration(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(globals.CONFIGURATION_API.BASE_URL);
        }

    }

    angular
        .module("app.shared.api")
        .factory("UnsecureConfigurationApiRestangular", UnsecureConfigurationApiRestangular);
})();
