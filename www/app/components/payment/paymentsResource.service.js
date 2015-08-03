(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentsResource($q, globals, AccountsResource) {

        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            getPaymentAddAvailability: getPaymentAddAvailability
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function getPaymentAddAvailability(accountId) {
            return $q.when(accountsResource.forAccount(accountId).doGET(globals.ACCOUNT_MAINTENANCE_API.PAYMENTS.PAYMENT_ADD_AVAILABILITY));
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentsResource", PaymentsResource);
})();