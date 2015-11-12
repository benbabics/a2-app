(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function InvoicesResource($q, globals, AccountsResource) {

        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getCurrentInvoiceSummary: getCurrentInvoiceSummary
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function getCurrentInvoiceSummary(accountId) {
            return $q.when(accountsResource.forAccount(accountId).doGET(globals.ACCOUNT_MAINTENANCE_API.INVOICES.CURRENT_INVOICE_SUMMARY));
        }

    }

    angular
        .module("app.components.invoice")
        .factory("InvoicesResource", InvoicesResource);
})();
