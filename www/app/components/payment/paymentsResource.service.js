(function () {
    "use strict";

    /* @ngInject */
    function PaymentsResource(AccountMaintenanceRestangular, globals) {
        return AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE);
    }

    angular
        .module("app.components.payment")
        .factory("PaymentsResource", PaymentsResource);
})();