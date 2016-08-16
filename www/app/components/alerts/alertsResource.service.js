(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function AlertsResource($q, globals, AccountsResource) {
        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getAlerts:   getAlerts,
            deleteAlert: deleteAlert
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function getAlerts(accountId, criteria) {
            var account = accountsResource.forAccount( accountId );
            return $q.when( account.getList(globals.ACCOUNT_MAINTENANCE_API.ALERTS.BASE, criteria) );
        }

        function deleteAlert(alertId) {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }

    }

    angular
        .module("app.components.alerts")
        .factory("AlertsResource", AlertsResource);
})();
