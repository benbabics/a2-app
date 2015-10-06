(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function CardReissueManager($rootScope, $q, AccountManager, CardManager, CardReissueModel, CommonService, Logger) {
        // Private members
        var _ = CommonService._,
            cardReissueDetails = {};


        // Revealed Public members
        var service = {
            clearCardReissueDetails      : clearCardReissueDetails,
            getCardReissueDetails        : getCardReissueDetails,
            getOrCreateCardReissueDetails: getOrCreateCardReissueDetails,
            initializeCardReissueDetails : initializeCardReissueDetails,
            setCardReissueDetails        : setCardReissueDetails
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("userLoggedOut", clearCachedValues);
        }

        function clearCachedValues() {
            clearCardReissueDetails();
        }

        function clearCardReissueDetails() {
            setCardReissueDetails({});
        }

        function getCardReissueDetails() {
            return cardReissueDetails;
        }

        function getOrCreateCardReissueDetails(accountId, cardId) {
            if (!_.isEmpty(cardReissueDetails) && cardReissueDetails.account.accountId === accountId && cardReissueDetails.card.cardId === cardId) {
                return $q.when(cardReissueDetails);
            }

            return initializeCardReissueDetails(accountId, cardId);
        }

        function initializeCardReissueDetails(accountId, cardId) {
            return $q.all([AccountManager.fetchAccount(accountId), CardManager.fetchCard(cardId)])
                .then(function (values) {
                    cardReissueDetails = new CardReissueModel();

                    cardReissueDetails.account = values[0];
                    cardReissueDetails.card = values[1];

                    cardReissueDetails.shippingAddress = cardReissueDetails.account.defaultCardShippingAddress;

                    //only allow the user to use the "regular" shipping method if they are shipping to a PO Box
                    //note: this check will have to be moved once the user is allowed to modify the selected card shipping address
                    if(cardReissueDetails.shippingAddress.isPoBox()) {
                        cardReissueDetails.selectedShippingMethod = cardReissueDetails.account.regularCardShippingMethod;
                        cardReissueDetails.shippingMethods = [cardReissueDetails.selectedShippingMethod];
                    }
                    else {
                        cardReissueDetails.selectedShippingMethod = cardReissueDetails.account.cardShippingCarrier.getDefaultShippingMethod();
                        cardReissueDetails.shippingMethods = cardReissueDetails.account.cardShippingCarrier.shippingMethods.slice();

                        //move the Regular shipping method to the front of the array
                        _.remove(cardReissueDetails.shippingMethods, {id: cardReissueDetails.account.regularCardShippingMethod.id});
                        cardReissueDetails.shippingMethods.unshift(cardReissueDetails.account.regularCardShippingMethod);
                    }

                    cardReissueDetails.reissueReason = "";

                    return cardReissueDetails;
                })
                .catch(function (errorResponse) {
                    var error = "Failed to initialize card reissue details: " + errorResponse;
                    Logger.error(error);

                    return $q.reject(error);
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setCardReissueDetails(cardReissueDetailsInfo) {
            cardReissueDetails = cardReissueDetailsInfo;
        }
    }

    angular
        .module("app.components.card")
        .factory("CardReissueManager", CardReissueManager);
})();