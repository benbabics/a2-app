(function () {
    "use strict";

    var PaymentModel = function (globals, BankModel) {

        // Constants
        var PAYMENT_STATUS = globals.PAYMENT.STATUS;

        function PaymentModel() {
            this.id = "";
            this.scheduledDate = "";
            this.amount = "";
            this.bankAccount = new BankModel();
            this.status = "";
            this.confirmationNumber = "";
        }

        PaymentModel.prototype.set = function (paymentResource) {
            angular.extend(this, paymentResource);
            this.bankAccount = new BankModel();
            this.bankAccount.set(paymentResource.bankAccount);
        };

        PaymentModel.prototype.isScheduled = function () {
            return this.status && this.status.toUpperCase() === PAYMENT_STATUS.SCHEDULED;
        };

        return PaymentModel;
    };

    angular
        .module("app.components.payment")
        .factory("PaymentModel", PaymentModel);
})();