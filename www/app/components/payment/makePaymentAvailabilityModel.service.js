(function () {
    "use strict";

    var MakePaymentAvailabilityModel = function () {

        function MakePaymentAvailabilityModel() {
            this.makePaymentAllowed = "";
            this.shouldDisplayBankAccountSetupMessage = "";
            this.shouldDisplayDirectDebitEnabledMessage = "";
            this.shouldDisplayOutstandingPaymentMessage = "";
        }

        MakePaymentAvailabilityModel.prototype.set = function (makePaymentAvailabilityResource) {
            angular.extend(this, makePaymentAvailabilityResource);
        };

        return MakePaymentAvailabilityModel;
    };

    angular
        .module("app.components.payment")
        .factory("MakePaymentAvailabilityModel", MakePaymentAvailabilityModel);
})();