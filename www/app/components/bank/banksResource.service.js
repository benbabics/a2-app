(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BanksResource(AccountMaintenanceRestangular, globals) {

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

    //TODO - Look into creating a custom method on the collection of active banks to get the default bank from the list

    function addCustomMethods(RestangularProvider, sharedGlobals) {
        RestangularProvider.addElementTransformer(sharedGlobals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE, false, function(account) {
            // This will add a method called getActiveBanks that will do a GET to the path payments/activeBanks
            account.addRestangularMethod("getActiveBanks", "get", sharedGlobals.ACCOUNT_MAINTENANCE_API.BANKS.ACTIVE_BANKS);

            return account;
        });
    }

    angular
        .module("app.components.bank")
        .config(addCustomMethods)
        .factory("BanksResource", BanksResource);
})();