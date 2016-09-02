(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function NotificationsRestangular(globals, SecureApiRestangular) {

        // Revealed Public members
        var service = SecureApiRestangular.withConfig(setUpConfiguration);

        activate();

        return service;
        //////////////////////

        function activate() {
            SecureApiRestangular.customizeConfiguration(service);
        }

        function setUpConfiguration(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(globals.NOTIFICATIONS_API.BASE_URL);
        }
    }

    angular
        .module("app.shared.api")
        .factory("NotificationsRestangular", NotificationsRestangular);
})();