(function () {
    "use strict";
    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function DriversResource($q, globals, AccountsResource) {
        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getDrivers: getDrivers
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function getDrivers(accountId, searchParams) {
            return $q.when(accountsResource.forAccount(accountId).getList(globals.ACCOUNT_MAINTENANCE_API.DRIVERS.BASE, searchParams));
        }
    }

    angular
        .module("app.components.driver")
        .factory("DriversResource", DriversResource);
})();
