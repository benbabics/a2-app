(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueController(CommonService, account, card, cardReissueDetails) {

        var _ = CommonService._,
            vm = this;

        activate();

        // Controller initialization
        function activate() {
            initializeCardReissueDetails();
        }

        function initializeCardReissueDetails() {
            cardReissueDetails.account = account;
            cardReissueDetails.originalCard = card;

            cardReissueDetails.shippingAddress = cardReissueDetails.account.defaultCardShippingAddress;

            //only allow the user to use the "regular" shipping method if they are shipping to a PO Box
            //note: this check will have to be moved once the user is allowed to modify the selected card shipping address
            if (cardReissueDetails.shippingAddress.isPoBox()) {
                cardReissueDetails.selectedShippingMethod = cardReissueDetails.account.regularCardShippingMethod;
                cardReissueDetails.shippingMethods = [cardReissueDetails.selectedShippingMethod];
            }
            else {
                cardReissueDetails.shippingMethods = cardReissueDetails.account.cardShippingCarrier.shippingMethods.slice();
                cardReissueDetails.selectedShippingMethod = cardReissueDetails.getDefaultShippingMethod();

                //move the Regular shipping method to the front of the array
                _.remove(cardReissueDetails.shippingMethods, {id: cardReissueDetails.account.regularCardShippingMethod.id});
                cardReissueDetails.shippingMethods.unshift(cardReissueDetails.account.regularCardShippingMethod);
            }

            cardReissueDetails.reissueReason = "";
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueController", CardReissueController);
})();