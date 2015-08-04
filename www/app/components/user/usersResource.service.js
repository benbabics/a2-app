(function () {
    "use strict";

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