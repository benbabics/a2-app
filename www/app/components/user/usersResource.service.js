(function () {
    "use strict";

    /* @ngInject */
    function UsersResource(AccountMaintenanceRestangular, globals) {
        return AccountMaintenanceRestangular.service(globals.ACCOUNT_MAINTENANCE_API.USERS.BASE);
    }

    function addCustomMethods(RestangularProvider, sharedGlobals) {
        RestangularProvider.addElementTransformer(sharedGlobals.ACCOUNT_MAINTENANCE_API.USERS.BASE, false, function(user) {
            // This will add a method called current that will do a GET to the path current
            user.addRestangularMethod("current", "get", sharedGlobals.ACCOUNT_MAINTENANCE_API.USERS.CURRENT);

            return user;
        });
    }

    angular
        .module("app.components.user")
        .config(addCustomMethods)
        .factory("UsersResource", UsersResource);
})();