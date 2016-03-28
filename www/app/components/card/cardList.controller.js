(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function CardListController(_, globals,
                                AnalyticsUtil, CardManager, ElementUtil, LoadingIndicator, Logger, UserManager) {

        var vm = this,
            activeSearchFilter = "",
            currentPage = 0;

        vm.config = globals.CARD_LIST.CONFIG;
        vm.cards = [];
        vm.firstPageLoaded = false;
        vm.loadingComplete = false;
        vm.searchFilter = "";
        vm.searchOptions = globals.CARD_LIST.SEARCH_OPTIONS;

        vm.applySearchFilter = applySearchFilter;
        vm.getActiveSearchFilter = getActiveSearchFilter;
        vm.loadNextPage = loadNextPage;
        vm.pageLoaded = pageLoaded;

        //////////////////////

        function applySearchFilter() {
            if (vm.searchFilter !== activeSearchFilter) {
                activeSearchFilter = vm.searchFilter;

                resetSearch();

                _.spread(AnalyticsUtil.trackEvent)(vm.config.ANALYTICS.events.searchSubmitted);
            }
        }

        function getActiveSearchFilter() {
            return activeSearchFilter;
        }

        function loadNextPage() {
            var billingAccountId = UserManager.getUser().billingCompany.accountId;

            LoadingIndicator.begin();

            //fetch the next page of cards
            // Passing in activeSearchFilter 3 times seems strange but the controller wants to apply the same filter to the
            // card number, embossing line 1 and embossing line 2 and it doesn't seem right to have the manager know that
            return CardManager.fetchCards(billingAccountId, activeSearchFilter, activeSearchFilter, activeSearchFilter, vm.searchOptions.STATUSES, currentPage, vm.searchOptions.PAGE_SIZE)
                .then(function (cards) {
                    vm.loadingComplete = _.isEmpty(cards);

                    if (!vm.loadingComplete) {
                        //add the fetched cards to the current list
                        vm.cards = vm.cards.concat(cards);

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
                .finally(LoadingIndicator.complete);
        }

        function pageLoaded() {
            vm.firstPageLoaded = true;
        }

        function resetSearch() {
            vm.firstPageLoaded = false;
            vm.loadingComplete = false;
            currentPage = 0;
            vm.cards = [];

            ElementUtil.resetInfiniteList();
        }
    }

    angular.module("app.components.card")
        .controller("CardListController", CardListController);
})();
