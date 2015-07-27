(function () {
    "use strict";

    var PaymentAddModel = function () {

        function PaymentAddModel() {
            this.amount = "";
            this.bankAccount = "";
            this.paymentDate = "";
        }

        PaymentAddModel.prototype.set = function (paymentAddResource) {
            angular.extend(this, paymentAddResource);
        };

        return PaymentAddModel;
    };

    angular
        .module("app.components.payment")
        .factory("PaymentAddModel", PaymentAddModel);
})();