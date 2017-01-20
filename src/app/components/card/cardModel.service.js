(function () {
    "use strict";

    var CardModel = function (globals) {

        // Constants
        var CARD_STATUS = globals.CARD.STATUS,
            CARD_STATUS_DISPLAY_MAPPINGS = globals.CARD.DISPLAY_MAPPINGS.STATUS;

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


        CardModel.prototype.getStatusDisplayName = function () {
            var status = this.status ? this.status.toUpperCase() : null;

            if (status && _.has(CARD_STATUS_DISPLAY_MAPPINGS, status)) {
                return CARD_STATUS_DISPLAY_MAPPINGS[status];
            }
            else {
                return CARD_STATUS_DISPLAY_MAPPINGS.UNKNOWN;
            }
        };

        CardModel.prototype.isActive = function () {
            return this.status && this.status.toLowerCase() === CARD_STATUS.ACTIVE;
        };

        CardModel.prototype.isSuspended = function () {
            return this.status && this.status.toLowerCase() === CARD_STATUS.SUSPENDED;
        };

        CardModel.prototype.isTerminated = function () {
            return this.status && this.status.toLowerCase() === CARD_STATUS.TERMINATED;
        };

        return CardModel;
    };

    angular
        .module("app.components.card")
        .factory("CardModel", CardModel);
})();