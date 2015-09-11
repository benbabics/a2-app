(function () {
    "use strict";

    var CardModel = function () {

        function CardModel() {
            this.cardId = "";
            this.accountId = "";
            this.cardType = "";
            this.embossedAccountNumber = "";
            this.embossedCardNumber = "";
            this.embossingValue1 = "";
            this.embossingValue2 = "";
            this.embossingValue3 = "";
            this.status = "";
        }

        CardModel.prototype.set = function (cardResource) {
            angular.extend(this, cardResource);
        };

        return CardModel;
    };

    angular
        .module("app.components.card")
        .factory("CardModel", CardModel);
})();