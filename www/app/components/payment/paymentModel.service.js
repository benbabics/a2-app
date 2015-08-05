(function () {
    "use strict";

    var PaymentModel = function (BankModel) {

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
        };

        return PaymentModel;
    };

    angular
        .module("app.components.payment")
        .factory("PaymentModel", PaymentModel);
})();