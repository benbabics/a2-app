(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function CardListController(_, $scope, globals, $controller, UserManager, CardManager, AnalyticsUtil, Logger) {
        var vm = this;

        vm.config        = globals.CARD_LIST.CONFIG;
        vm.searchOptions = globals.CARD_LIST.SEARCH_OPTIONS;
        vm.searchFilter  = "";

        vm.cardsComparator = cardsComparator;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            var infiniteListController = $controller("WexInfiniteListController", {
                $scope,
                $attrs: {
                    isGreeking: true,
                    cacheKey:   "cards-list"
                }
            });

            infiniteListController.assignServiceDelegate({
                makeRequest:      handleMakeRequest,
                onError:          handleOnError,
                onRequestItems:   handleOnRequestItems,
                onRenderComplete: handleOnRenderComplete,
                onResetItems:     handleOnResetItems
            });

            vm.cards = $scope.infiniteScrollService.model;
            handleOnResetItems(); // initially add collections
        }

        function handleOnResetItems() {
            vm.cards.active     = [];
            vm.cards.suspended  = [];
            vm.cards.terminated = [];
        }

        function handleMakeRequest(requestConfig) {
            let billingAccountId = UserManager.getUser().billingCompany.accountId;
            return CardManager.fetchCards( billingAccountId );
        }

        function handleOnRequestItems() {
            if ( !isGreeking() ) {
                // grab items that are currently greeking
                var cards = _.filter( vm.cards.collection, card => card.isGreekLoading );

                // since we're rendering vm.cards.active|suspended|terminated instead of vm.cards.collection
                // we will feed in greeking results into active, suspended & terminated collections
                // onRenderComplete is delegated the responsibility to sort and
                // reassign the appropriate items to which collections
                Array.prototype.push.apply( vm.cards.active,    cards.splice(-1) );
                Array.prototype.push.apply( vm.cards.suspended, cards.splice(-1) );
                Array.prototype.push.apply( vm.cards.terminated, cards.splice(-12) );
            }
        }

        function handleOnError(errorResponse) {
            Logger.error( `Failed to fetch next page of cards: ${errorResponse}` );
        }

        function handleOnRenderComplete() {
            // ensure we do not receive any greeking items
            var cards = _.filter( vm.cards.collection, card => !card.isGreekLoading );

            // now reassign schedule and completed collections their appropriate items
            filterCards( cards );
        }

        function filterCards(cards) {
            var unsortedActiveCards, unsortedSuspendedCards, unsortedTerminatedCards,
                sortingCriteria = [ "status", "embossedCardNumber" ];

            // filter cards into collections
            unsortedActiveCards     = _.filter( cards, card => card.isActive() );
            unsortedSuspendedCards  = _.filter( cards, card => card.isSuspended() );
            unsortedTerminatedCards = _.filter( cards, card => card.isTerminated() );

            // sort the cards collections
            vm.cards.active     = _.orderBy( unsortedActiveCards,     sortingCriteria, [ "asc" ] );
            vm.cards.suspended  = _.orderBy( unsortedSuspendedCards,  sortingCriteria, [ "asc" ] );
            vm.cards.terminated = _.orderBy( unsortedTerminatedCards, sortingCriteria, [ "asc" ] );

            return cards;
        }

        function isGreeking() {
            let cardActive     = _.find( vm.cards.active,     card => card.isGreekLoading ) || [],
                cardSuspended  = _.find( vm.cards.suspended,  card => card.isGreekLoading ) || [],
                cardTerminated = _.find( vm.cards.terminated, card => card.isGreekLoading ) || [];

            return ( cardActive.length && cardSuspended.length && cardTerminated.length ) > 0;
        }

        function cardsComparator(card, term) {
            // term doesn't yet exist, display each item in the collection
            if ( !term ) { return true; }

            // use card data to compare against the term
            if ( _.isObject(card) ) {
                let embossedCardNumber = ( _.get( card, "embossedCardNumber" ) || "" ).toLowerCase(),
                    embossingValue2    = ( _.get( card, "embossingValue2"    ) || "" ).toLowerCase(),
                    embossingValue1    = ( _.get( card, "embossingValue1"    ) || "" ).toLowerCase();

                // not case-sensitive; strip out spaces and possible * char
                term = term.toLowerCase().replace( /\*|\s/g, "" );

                return embossedCardNumber.replace( /\s/g, "" ).indexOf( term ) >= 0 ||
                       embossingValue2.replace( /\s/g, "" ).indexOf( term )    >= 0 ||
                       embossingValue1.replace( /\s/g, "" ).indexOf( term )    >= 0;
            }
        }
    }

    angular.module( "app.components.card" )
        .controller( "CardListController", CardListController );
})();
