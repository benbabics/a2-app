(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function InvoicesResource(AccountMaintenanceRestangular, globals) {
        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            forAccount: forAccount
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE);
        }

        function forAccount(accountId) {
            return accountsResource.one(accountId);
        }

    }

    function addCustomMethods(RestangularProvider, sharedGlobals) {
        RestangularProvider.addElementTransformer(sharedGlobals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE, false, function(account) {
            // This will add a method called getCurrentInvoiceSummary that will do a GET  to the path payments/currentInvoiceSummary
            account.addRestangularMethod("getCurrentInvoiceSummary", "get", sharedGlobals.ACCOUNT_MAINTENANCE_API.INVOICES.CURRENT_INVOICE_SUMMARY);

            return account;
        });
    }

    angular
        .module("app.components.invoice")
        .config(addCustomMethods)
        .factory("InvoicesResource", InvoicesResource);
})();