(function () {
    "use strict";

    var PaymentAddAvailabilityModel = function () {

        function PaymentAddAvailabilityModel() {
            this.makePaymentAllowed = "";
            this.shouldDisplayCurrentBalanceDueMessage = "";
            this.shouldDisplayBankAccountSetupMessage = "";
            this.shouldDisplayDirectDebitEnabledMessage = "";
            this.shouldDisplayOutstandingPaymentMessage = "";
        }

        PaymentAddAvailabilityModel.prototype.set = function (paymentAddAvailabilityResource) {
            angular.extend(this, paymentAddAvailabilityResource);
        };

        return PaymentAddAvailabilityModel;
    };

    angular
        .module("app.components.payment")
        .factory("PaymentAddAvailabilityModel", PaymentAddAvailabilityModel);
})();