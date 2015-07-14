(function () {
    "use strict";

    /* @ngInject */
    function InvoicesResource(AccountMaintenanceRestangular, globals) {
        return AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE);
    }

    angular
        .module("app.components.invoice")
        .factory("InvoicesResource", InvoicesResource);
})();