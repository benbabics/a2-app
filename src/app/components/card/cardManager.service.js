(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function CardManager(_, $q, globals, CardModel, CardsResource, Logger, LoggerUtil) {
        // Private members
        var cards;

        // Revealed Public members
        var service = {
                clearCachedValues: clearCachedValues,
                fetchCard        : fetchCard,
                fetchCards       : fetchCards,
                getCards         : getCards,
                reissue          : reissue,
                setCards         : setCards,
                updateStatus     : updateStatus
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            clearCachedValues();
        }

        function clearCachedValues() {
            cards = [];
        }

        function createCard(cardResource) {
            var cardModel = new CardModel();
            if ( Math.random() >= 0.5 ) {
                cardResource.status = "SUSPENDED";
            }
            cardModel.set(cardResource);

            return cardModel;
        }

        function fetchCard(cardId) {
            return $q.when(_.find(cards, {cardId: cardId}));
        }

        function fetchCards(accountId, embossedCardNumberFilter, embossingValue1Filter, embossingValue2Filter, statuses, pageNumber, pageSize, orderBy) {
            var params = {
                embossedCardNumberFilter: embossedCardNumberFilter,
                embossingValue1Filter   : embossingValue1Filter,
                embossingValue2Filter   : embossingValue2Filter,
                status                  : statuses,
                pageNumber              : pageNumber,
                pageSize                : pageSize
            };
            if (undefined !== orderBy) {
                params.orderBy = orderBy;
            }

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
                        cards = _.uniqBy(cards.concat(fetchedCards), "cardId");

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

                    var error = "Getting Cards failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getCards() {
            return cards;
        }

        function reissue(accountId, cardId, reissueReason, shippingMethodId) {
            var params = {
                updateType      : globals.ACCOUNT_MAINTENANCE_API.CARDS.UPDATE_TYPES.REISSUE,
                reissueReason   : reissueReason,
                shippingMethodId: shippingMethodId
            };

            return CardsResource.postUpdate(accountId, cardId, params)
                .then(function (cardResponse) {
                    if (cardResponse && cardResponse.data) {
                        var currentCard = _.find(cards, {cardId: cardResponse.data.cardId});

                        if(currentCard) {
                            //update the existing card object in the cache
                            currentCard.set(cardResponse.data);
                        }
                        else {
                            //the reissued card has a new id, so map the data to a card model and add it to the cache
                            currentCard = createCard(cardResponse.data);

                            //the state of the previous card has now been changed, so we need to clear the cache
                            clearCachedValues();
                        }

                        return currentCard;
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from reissuing the Card";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                .catch(function(failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Reissuing Card failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setCards(cardsInfo) {
            cards = cardsInfo;
        }

        function updateStatus(accountId, cardId, newStatus) {
            return CardsResource.postStatusChange(accountId, cardId, newStatus)
                .then(function(cardResponse) {
                    if (cardResponse && cardResponse.data) {
                        var cachedCard = _.find(cards, {cardId: cardId});

                        if (cachedCard) {
                            //update the existing card object in the cache
                            cachedCard.set(cardResponse.data);
                        }
                        else {
                            //the card should be in the cache, so log a warning
                            Logger.warn("Updated card was not found in the cache (this should not happen)");

                            //map the data to a card model to be returned
                            cachedCard = createCard(cardResponse.data);
                        }

                        return cachedCard;
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from updating the Card Status";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                .catch(function(failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Updating Card Status failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }
    }

    angular
        .module("app.components.card")
        .factory("CardManager", CardManager);
})();
