(function () {
    "use strict";

    /* @ngInject */
    function InvoicesResource(AccountMaintenanceRestangular, globals) {
        return AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE);
    }

    function addCustomMethods(RestangularProvider, sharedGlobals) {
        RestangularProvider.addElementTransformer(sharedGlobals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE, false, function(account) {
            // This will add a method called currentInvoiceSummary that will do a GET  to the path payments/currentInvoiceSummary
            account.addRestangularMethod("currentInvoiceSummary", "get", sharedGlobals.ACCOUNT_MAINTENANCE_API.INVOICES.CURRENT_INVOICE_SUMMARY);

            return account;
        });
    }

    angular
        .module("app.components.invoice")
        .config(addCustomMethods)
        .factory("InvoicesResource", InvoicesResource);
})();