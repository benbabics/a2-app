(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentMaintenanceController(InvoiceManager, defaultBank, payment, maintenance) {

        activate();

        // Controller initialization
        function activate() {
            if (maintenance.state === maintenance.states.ADD) {
                initializePaymentDetails();
            }
        }

        function initializePaymentDetails() {
            payment.amount = InvoiceManager.getInvoiceSummary().statementBalance;
            payment.scheduledDate = new Date();
            payment.bankAccount = defaultBank;
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceController", PaymentMaintenanceController);
})();
