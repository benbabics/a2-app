(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function CardReissueController(_, Logger, account, card, cardReissueDetails) {

        activate();

        // Controller initialization
        function activate() {
            initializeCardReissueDetails();
        }

        function initializeCardReissueDetails() {
            cardReissueDetails.account = account;
            cardReissueDetails.originalCard = card;

            cardReissueDetails.shippingAddress = cardReissueDetails.account.defaultCardShippingAddress;

            if (cardReissueDetails.shippingAddress.isPoBox()) {
                //if user is shipping to a PO Box, only allow them to use the "regular" shipping method
                //note: this check will have to be moved once the user is allowed to modify the selected card shipping address
                if (account.hasRegularShippingMethod()) {
                    cardReissueDetails.selectedShippingMethod = cardReissueDetails.account.regularCardShippingMethod;
                    cardReissueDetails.shippingMethods = [cardReissueDetails.account.regularCardShippingMethod];
                }
                else {
                    //TODO - what do we do here?

                    Logger.error("Cannot reissue card as the default shipping address is a PO box and user doesn't have regular shipping available");
                }
            }
            else {
                cardReissueDetails.shippingMethods = cardReissueDetails.account.cardShippingCarrier.shippingMethods.slice();
                cardReissueDetails.selectedShippingMethod = cardReissueDetails.getDefaultShippingMethod();

                //move the Regular shipping method to the front of the array if there is one
                if (account.hasRegularShippingMethod()) {
                    _.remove(cardReissueDetails.shippingMethods, {id: cardReissueDetails.account.regularCardShippingMethod.id});
                    cardReissueDetails.shippingMethods.unshift(cardReissueDetails.account.regularCardShippingMethod);
                }
            }

            cardReissueDetails.reissueReason = "";
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueController", CardReissueController);
})();
