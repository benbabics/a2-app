(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function AccountsResource(AccountMaintenanceRestangular, globals) {

        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            forAccount: forAccount,
            getAccount: getAccount
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

        function getAccount(accountId) {
            return forAccount(accountId).get();
        }

    }

    angular
        .module("app.components.account")
        .factory("AccountsResource", AccountsResource);
})();