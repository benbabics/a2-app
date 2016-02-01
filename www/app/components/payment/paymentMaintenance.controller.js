(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentMaintenanceController(InvoiceManager, defaultBank, payment, maintenanceDetails) {

        activate();

        // Controller initialization
        function activate() {
            if (maintenanceDetails.state === maintenanceDetails.getStates().ADD) {
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
