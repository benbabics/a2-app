(function () {
    "use strict";

    var AccountModel = function (AddressModel, ShippingCarrierModel, ShippingMethodModel) {

        function AccountModel() {
            this.accountId = "";
            this.accountNumber = "";
            this.name = "";
            this.defaultCardShippingAddress = "";
            this.regularCardShippingMethod = "";
            this.cardShippingCarrier = "";
            this.status = "";
            this.statusReason = "";
        }

        AccountModel.prototype.set = function (accountResource) {
            angular.extend(this, accountResource);

            this.defaultCardShippingAddress = new AddressModel();
            this.defaultCardShippingAddress.set(accountResource.defaultCardShippingAddress);

            this.regularCardShippingMethod = new ShippingMethodModel();
            this.regularCardShippingMethod.set(accountResource.regularCardShippingMethod);

            this.cardShippingCarrier = new ShippingCarrierModel();
            this.cardShippingCarrier.set(accountResource.cardShippingCarrier);
        };

        return AccountModel;
    };

    angular
        .module("app.components.account")
        .factory("AccountModel", AccountModel);
})();