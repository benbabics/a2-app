(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function CardReissueManager($rootScope, $q, AccountManager, CardManager, CardReissueModel, CommonService, Logger) {
        // Private members
        var _ = CommonService._,
            cardReissue = {};


        // Revealed Public members
        var service = {
            clearCardReissue      : clearCardReissue,
            getCardReissue        : getCardReissue,
            getOrCreateCardReissue: getOrCreateCardReissue,
            initializeCardReissue : initializeCardReissue,
            setCardReissue        : setCardReissue
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("userLoggedOut", clearCachedValues);
        }

        function clearCachedValues() {
            clearCardReissue();
        }

        function clearCardReissue() {
            setCardReissue({});
        }

        function getCardReissue() {
            return cardReissue;
        }

        function getOrCreateCardReissue(accountId, cardId) {
            if (!_.isEmpty(cardReissue) && cardReissue.account.accountId === accountId && cardReissue.card.cardId === cardId) {
                return $q.when(cardReissue);
            }

            return initializeCardReissue(accountId, cardId);
        }

        function initializeCardReissue(accountId, cardId) {
            return $q.all([AccountManager.fetchAccount(accountId), CardManager.fetchCard(cardId)])
                .then(function (values) {
                    cardReissue = new CardReissueModel();

                    cardReissue.account = values[0];
                    cardReissue.card = values[1];

                    cardReissue.shippingAddress = cardReissue.account.defaultCardShippingAddress;

                    //only allow the user to use the "regular" shipping method if they are shipping to a PO Box
                    //note: this check will have to be moved once the user is allowed to modify the selected card shipping address
                    if(cardReissue.shippingAddress.isPoBox()) {
                        cardReissue.selectedShippingMethod = cardReissue.account.regularCardShippingMethod;
                        cardReissue.shippingMethods = [cardReissue.selectedShippingMethod];
                    }
                    else {
                        cardReissue.selectedShippingMethod = cardReissue.account.cardShippingCarrier.getDefaultShippingMethod();
                        cardReissue.shippingMethods = cardReissue.account.cardShippingCarrier.shippingMethods.slice();

                        //move the Regular shipping method to the front of the array
                        _.remove(cardReissue.shippingMethods, {id: cardReissue.account.regularCardShippingMethod.id});
                        cardReissue.shippingMethods.unshift(cardReissue.account.regularCardShippingMethod);
                    }

                    cardReissue.reissueReason = "";

                    return cardReissue;
                })
                .catch(function (errorResponse) {
                    var error = "Failed to initialize card reissue: " + errorResponse;
                    Logger.error(error);

                    return $q.reject(error);
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setCardReissue(cardReissueInfo) {
            cardReissue = cardReissueInfo;
        }
    }

    angular
        .module("app.components.card")
        .factory("CardReissueManager", CardReissueManager);
})();