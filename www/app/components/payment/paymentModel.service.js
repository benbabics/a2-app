(function () {
    "use strict";

    var PaymentModel = function (globals, BankModel, CommonService) {

        // Constants
        var PAYMENT_STATUS = globals.PAYMENT.STATUS,
            PAYMENT_METHOD = globals.PAYMENT.METHOD;

        var _ = CommonService._;

        function PaymentModel() {
            this.id = "";
            this.scheduledDate = "";
            this.amount = "";
            this.bankAccount = new BankModel();
            this.status = "";
            this.confirmationNumber = "";
            this.method = "";
        }

        PaymentModel.prototype.set = function (paymentResource) {
            angular.extend(this, paymentResource);
            this.bankAccount = new BankModel();
            this.bankAccount.set(paymentResource.bankAccount);
        };

        PaymentModel.prototype.getBankAccountDisplayName = function () {
            var method = this.method ? this.method.toUpperCase() : null;

            if (method && _.has(PAYMENT_METHOD.BANK_ACCOUNT_NAME_DISPLAY_OVERRIDE, method)) {
                return PAYMENT_METHOD.BANK_ACCOUNT_NAME_DISPLAY_OVERRIDE[method];
            }

            return this.bankAccount.getDisplayName();
        };

        PaymentModel.prototype.getMethodDisplayName = function () {
            var method = this.method ? this.method.toUpperCase() : null;

            if (method && _.has(PAYMENT_METHOD.DISPLAY_MAPPINGS, method)) {
                return PAYMENT_METHOD.DISPLAY_MAPPINGS[method];
            }
            else {
                return PAYMENT_METHOD.DISPLAY_MAPPINGS.UNKNOWN;
            }
        };

        PaymentModel.prototype.isPending = function () {
            return this.status && this.status.toUpperCase() === PAYMENT_STATUS.PENDING;
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