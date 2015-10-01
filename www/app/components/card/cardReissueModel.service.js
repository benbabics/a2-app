(function () {
    "use strict";

    var CardReissueModel = function (AccountModel, AddressModel, CardModel, CommonService, ShippingMethodModel) {
        var _ = CommonService._;

        function CardReissueModel() {
            this.account = "";
            this.card = "";
            this.shippingAddress = "";
            this.selectedShippingMethod = "";
            this.shippingMethods = "";
            this.reissueReason = "";
        }

        CardReissueModel.prototype.set = function (cardReissueResource) {
            var self = this;

            angular.extend(this, cardReissueResource);

            this.account = new AccountModel();
            this.account.set(cardReissueResource.account);

            this.card = new CardModel();
            this.card.set(cardReissueResource.card);

            this.shippingAddress = new AddressModel();
            this.shippingAddress.set(cardReissueResource.shippingAddress);

            this.selectedShippingMethod = new ShippingMethodModel();
            this.selectedShippingMethod.set(cardReissueResource.selectedShippingMethod);

            this.shippingMethods = [];
            _.forEach(cardReissueResource.shippingMethods, function(shippingMethodResource) {
                var shippingMethod = new ShippingMethodModel();
                shippingMethod.set(shippingMethodResource);

                self.shippingMethods.push(shippingMethod);
            });
        };

        CardReissueModel.prototype.getShippingMethodDisplayName = function (shippingMethod) {
            var displayName = "";

            shippingMethod = shippingMethod || this.selectedShippingMethod;

            if(this.hasDefaultCarrier() && shippingMethod.id !== this.account.regularCardShippingMethod.id) {
                displayName = this.account.cardShippingCarrier.getDisplayName() + " - ";
            }

            displayName += shippingMethod.getDisplayName(!this.hasDefaultCarrier());
            return displayName;
        };

        CardReissueModel.prototype.hasDefaultCarrier = function () {
            return this.account.cardShippingCarrier.default;
        };

        return CardReissueModel;
    };

    angular
        .module("app.components.card")
        .factory("CardReissueModel", CardReissueModel);
})();