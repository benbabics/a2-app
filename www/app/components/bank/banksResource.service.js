(function () {
    "use strict";

    /* @ngInject */
    function BanksResource(AccountMaintenanceRestangular, globals) {
        return AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE);
    }

    //TODO - Look into creating a custom method on the collection of active banks to get the default bank from the list

    function addCustomMethods(RestangularProvider, sharedGlobals) {
        RestangularProvider.addElementTransformer(sharedGlobals.ACCOUNT_MAINTENANCE_API.ACCOUNTS.BASE, false, function(account) {
            // This will add a method called activeBanks that will do a GET to the path payments/activeBanks
            account.addRestangularMethod("activeBanks", "get", sharedGlobals.ACCOUNT_MAINTENANCE_API.BANKS.ACTIVE_BANKS);

            return account;
        });
    }

    angular
        .module("app.components.bank")
        .config(addCustomMethods)
        .factory("BanksResource", BanksResource);
})();