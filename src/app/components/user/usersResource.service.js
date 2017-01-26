(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UsersResource($q, globals, AccountMaintenanceRestangular) {
        // Private members
        var usersResource;

        // Revealed Public members
        var service = {
            getDetails: getDetails
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            usersResource = AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.USERS.BASE);
        }

        function getDetails() {
            return $q.when(usersResource.one().doGET(globals.ACCOUNT_MAINTENANCE_API.USERS.CURRENT));
        }

    }

    angular
        .module("app.components.user")
        .factory("UsersResource", UsersResource);
})();
