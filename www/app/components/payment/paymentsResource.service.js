(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentsResource($q, globals, AccountsResource) {

        // Private members
        var accountsResource;

        // Revealed Public members
        var service = {
            addPayment               : addPayment,
            getPayment               : getPayment,
            getPaymentAddAvailability: getPaymentAddAvailability,
            getPayments              : getPayments,
            postPayment              : postPayment
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            accountsResource = AccountsResource;
        }

        function addPayment(accountId, payment) {
            return $q.when(accountsResource.forAccount(accountId).post(globals.ACCOUNT_MAINTENANCE_API.PAYMENTS.BASE, payment));
        }

        function getPayment(accountId, paymentId) {
            return $q.when(accountsResource.forAccount(accountId).doGET(globals.ACCOUNT_MAINTENANCE_API.PAYMENTS.BASE + "/" + paymentId));
        }

        function getPaymentAddAvailability(accountId) {
            return $q.when(accountsResource.forAccount(accountId).doGET(globals.ACCOUNT_MAINTENANCE_API.PAYMENTS.PAYMENT_ADD_AVAILABILITY));
        }

        function getPayments(accountId, searchCriteria) {
            return $q.when(accountsResource.forAccount(accountId).getList(globals.ACCOUNT_MAINTENANCE_API.PAYMENTS.BASE, searchCriteria));
        }

        function postPayment(accountId, paymentId, payment) {
            return $q.when(accountsResource.forAccount(accountId).doPOST(payment, globals.ACCOUNT_MAINTENANCE_API.PAYMENTS.BASE + "/" + paymentId));
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentsResource", PaymentsResource);
})();