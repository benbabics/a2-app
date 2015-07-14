(function () {
    "use strict";

    /* @ngInject */
    function UsersResource(AccountMaintenanceRestangular, globals) {
        return AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.USERS.BASE);
    }

    angular
        .module("app.components.user")
        .factory("UsersResource", UsersResource);
})();