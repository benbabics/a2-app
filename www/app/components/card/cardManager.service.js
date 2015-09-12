(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function CardManager($q, $rootScope, CardModel, CardsResource, CommonService, Logger) {
        // Private members
        var cards;

        // Revealed Public members
        var _ = CommonService._,
            service = {
                fetchCard : fetchCard,
                fetchCards: fetchCards,
                getCards  : getCards,
                setCards  : setCards
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("userLoggedOut", clearCachedValues);

            clearCachedValues();
        }

        function clearCachedValues() {
            cards = [];
        }

        function createCard(cardResource) {
            var cardModel = new CardModel();
            cardModel.set(cardResource);

            return cardModel;
        }

        function fetchCard(cardId) {
            return $q.when(_.find(cards, {cardId: cardId}));
        }

        function fetchCards(accountId, embossedCardNumberFilter, embossingValue2Filter, statuses, pageNumber, pageSize) {
            var params = {
                embossedCardNumberFilter: embossedCardNumberFilter,
                embossingValue2Filter   : embossingValue2Filter,
                status                  : statuses,
                pageNumber              : pageNumber,
                pageSize                : pageSize
            };

            return CardsResource.getCards(accountId, params)
                .then(function (cardsResponse) {
                    if (cardsResponse && cardsResponse.data) {
                        //map the card data to model objects
                        var fetchedCards = _.map(cardsResponse.data, createCard);

                        //reset the cache if we're fetching the first page of results
                        if (pageNumber === 0) {
                            cards = [];
                        }

                        //only cache the fetched cards that haven't been cached yet
                        cards = _.unique(cards.concat(fetchedCards), "cardId");

                        return fetchedCards;
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from getting the Cards";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                // get cards failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Cards failed: " + CommonService.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getCards() {
            return cards;
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setCards(cardsInfo) {
            cards = cardsInfo;
        }
    }

    angular
        .module("app.components.card")
        .factory("CardManager", CardManager);
})();