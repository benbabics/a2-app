(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BanksResource($q, globals, AccountsResource) {

        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getActiveBanks: getActiveBanks
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function getActiveBanks(accountId) {
            return $q.when(accountsResource.forAccount(accountId).doGET(globals.ACCOUNT_MAINTENANCE_API.BANKS.ACTIVE_BANKS));
        }

    }

    angular
        .module("app.components.bank")
        .factory("BanksResource", BanksResource);
})();