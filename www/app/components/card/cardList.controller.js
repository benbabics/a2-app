(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function CardListController(_, $scope, globals, $controller, AnalyticsUtil, CardManager, LoadingIndicator, Logger, UserManager) {

        var vm = this,
            activeSearchFilter = "";

        vm.config = globals.CARD_LIST.CONFIG;
        vm.searchFilter = "";
        vm.searchOptions = globals.CARD_LIST.SEARCH_OPTIONS;

        vm.applySearchFilter     = applySearchFilter;
        vm.getActiveSearchFilter = getActiveSearchFilter;

        activate();

        //////////////////////

        function activate() {
            var infiniteListController = $controller("WexInfiniteListController", {
                $scope: $scope,
                $attrs: {
                    isGreeking: true,
                    cacheKey:   "cards-list"
                }
            });

            infiniteListController.assignServiceDelegate({
                makeRequest: handleMakeRequest,
                onError:     handleOnError
            });

            vm.cards = $scope.infiniteScrollService.model;
        }

        function handleMakeRequest(requestConfig) {
            var billingAccountId = UserManager.getUser().billingCompany.accountId;

            // Passing in activeSearchFilter 3 times seems strange but the controller wants to apply the same filter to the
            // card number, embossing line 1 and embossing line 2 and it doesn't seem right to have the manager know that
            return CardManager.fetchCards(
                billingAccountId, activeSearchFilter, activeSearchFilter, activeSearchFilter,
                vm.searchOptions.STATUSES, requestConfig.currentPage, requestConfig.pageSize
            );
        }

        function handleOnError(errorResponse) {
            // TODO - What do we do here?
            Logger.error( "Failed to fetch next page of cards: " + errorResponse );
        }

        function applySearchFilter() {
            if (vm.searchFilter !== activeSearchFilter) {
                activeSearchFilter = vm.searchFilter;
                $scope.resetSearchResults();
                _.spread(AnalyticsUtil.trackEvent)(vm.config.ANALYTICS.events.searchSubmitted);
            }
        }

        function getActiveSearchFilter() {
            return activeSearchFilter;
        }
    }

    angular.module("app.components.card")
        .controller("CardListController", CardListController);
})();
