(function () {
    "use strict";
    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function DriversResource($q, globals, AccountsResource) {
        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getDrivers:       getDrivers,
            postStatusChange: postStatusChange
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

        function postStatusChange(accountId, driverId, newStatus, promptId) {
            const URL = `${globals.ACCOUNT_MAINTENANCE_API.DRIVERS.BASE}/${driverId}/${globals.ACCOUNT_MAINTENANCE_API.DRIVERS.STATUS}`;
            let request = accountsResource.forAccount( accountId ).doPOST( null, URL , { newStatus, promptId } );
            return $q.when( request );
        }
    }

    angular
        .module("app.components.driver")
        .factory("DriversResource", DriversResource);
})();
