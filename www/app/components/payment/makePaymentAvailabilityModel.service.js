(function () {
    "use strict";

    var MakePaymentAvailabilityModel = function () {

        function MakePaymentAvailabilityModel() {
            this.bankAccountSetup = "";
            this.directDebitEnabled = "";
            this.makePaymentAllowed = "";
            this.outstandingPayment = "";
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