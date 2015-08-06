(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AccountMaintenanceRestangular(globals, SecureApiRestangular) {

        // Revealed Public members
        var service = SecureApiRestangular.withConfig(setUpConfiguration);

        activate();

        return service;
        //////////////////////

        function activate() {
            SecureApiRestangular.customizeConfiguration(service);
        }

        function setUpConfiguration(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(globals.ACCOUNT_MAINTENANCE_API.BASE_URL);
        }

    }

    angular
        .module("app.shared.api")
        .factory("AccountMaintenanceRestangular", AccountMaintenanceRestangular);
})();
