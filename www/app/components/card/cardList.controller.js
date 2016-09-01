(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function CardListController(_, $scope, globals, AnalyticsUtil, CardManager, LoadingIndicator, Logger, UserManager) {

        var vm = this,
            activeSearchFilter = "",
            currentPage = 0;

        vm.config = globals.CARD_LIST.CONFIG;
        vm.cards = [];
        vm.loadingComplete = false;
        vm.searchFilter = "";
        vm.searchOptions = globals.CARD_LIST.SEARCH_OPTIONS;

        vm.applySearchFilter = applySearchFilter;
        vm.getActiveSearchFilter = getActiveSearchFilter;
        vm.loadNextPage = loadNextPage;
        vm.loadNextPageWithOverlay = loadNextPageWithOverlay;
        vm.resetSearchResults = resetSearchResults;

        activate();

        //////////////////////

        function activate() {
            //show the fullscreen loading indicator for the first page load
            LoadingIndicator.begin();
        }

        function applySearchFilter() {
            if (vm.searchFilter !== activeSearchFilter) {
                activeSearchFilter = vm.searchFilter;

                resetSearchResults();

                _.spread(AnalyticsUtil.trackEvent)(vm.config.ANALYTICS.events.searchSubmitted);
            }

        }

        function getActiveSearchFilter() {
            return activeSearchFilter;
        }

        /**
         * Loads the next page of card data.
         *
         * @param {Array} [cardsResult] An optional buffer to add the newly fetched cards to.
         */
        function loadNextPage(cardsResult) {
            var billingAccountId = UserManager.getUser().billingCompany.accountId;

            cardsResult = cardsResult || vm.cards;

            //fetch the next page of cards
            // Passing in activeSearchFilter 3 times seems strange but the controller wants to apply the same filter to the
            // card number, embossing line 1 and embossing line 2 and it doesn't seem right to have the manager know that
            return CardManager.fetchCards(billingAccountId, activeSearchFilter, activeSearchFilter, activeSearchFilter, vm.searchOptions.STATUSES, currentPage, vm.searchOptions.PAGE_SIZE)
                .then(function (cards) {
                    vm.loadingComplete = _.size(cards) < vm.searchOptions.PAGE_SIZE;

                    if (!_.isEmpty(cards)) {
                        //add the fetched cards to the current list
                        Array.prototype.push.apply(cardsResult, cards);

                        ++currentPage;
                    }

                    return vm.loadingComplete;
                })
                .catch(function (errorResponse) {
                    //TODO - What do we do here?
                    Logger.error("Failed to fetch next page of cards: " + errorResponse);

                    // There was an error fetching data so indicate that there is no more data to fetch
                    vm.loadingComplete = true;
                    return vm.loadingComplete;
                })
                .finally(function () {
                    $scope.$broadcast("scroll.refreshComplete");
                    LoadingIndicator.complete();
                });
        }

        //TODO - Remove this when greeking/alternative infinite list loading indicator is implemented
        function loadNextPageWithOverlay(cardsResult) {
            LoadingIndicator.begin();

            return loadNextPage(cardsResult)
                .finally(LoadingIndicator.complete);
        }

        function resetSearchResults() {
            vm.loadingComplete = false;
            currentPage = 0;

            //use double buffering so that the previous results don't disappear as the list is being refreshed
            var cardsBuffer = [];
            loadNextPage(cardsBuffer)
                .finally(function () {
                    vm.cards = cardsBuffer;
                });
        }
    }

    angular.module("app.components.card")
        .controller("CardListController", CardListController);
})();
