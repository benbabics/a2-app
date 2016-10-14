(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function TransactionsResource($q, globals, AccountsResource) {
        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getPendingTransactions: getPendingTransactions,
            getPostedTransactions:  getPostedTransactions
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function getPendingTransactions(accountId, searchCriteria) {
            return $q.when(accountsResource.forAccount(accountId).getList(globals.ACCOUNT_MAINTENANCE_API.TRANSACTIONS.PENDING.BASE, searchCriteria));
        }

        function getPostedTransactions(accountId, searchCriteria) {
            return $q.when(accountsResource.forAccount(accountId).getList(globals.ACCOUNT_MAINTENANCE_API.TRANSACTIONS.POSTED.BASE, searchCriteria));
        }

    }

    angular
        .module("app.components.transaction")
        .factory("TransactionsResource", TransactionsResource);
})();
