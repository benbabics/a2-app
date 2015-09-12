(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardListController($scope, globals, CardManager, CommonService, Logger, UserManager) {

        var _ = CommonService._,
            vm = this,
            currentPage = 0;

        vm.config = globals.CARD_LIST.CONFIG;
        vm.cards = [];
        vm.searchOptions = globals.CARD_LIST.SEARCH_OPTIONS;

        vm.loadNextPage = loadNextPage;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }

        function loadNextPage() {
            var billingAccountId = UserManager.getUser().billingCompany.accountId,
                embossedCardNumberFilter,
                embossingValue2Filter;

            CommonService.loadingBegin();

            //fetch the next page of cards
            return CardManager.fetchCards(billingAccountId, embossedCardNumberFilter, embossingValue2Filter, vm.searchOptions.STATUSES, currentPage, vm.searchOptions.PAGE_SIZE)
                .then(function (cards) {
                    if (_.isEmpty(cards)) {
                        return true;
                    }
                    else {
                        //add the fetched cards to the current list
                        vm.cards = vm.cards.concat(cards);

                        ++currentPage;
                        return false;
                    }
                })
                .catch(function (errorResponse) {
                    //TODO - What do we do here?
                    Logger.error("Failed to fetch next page of cards: " + errorResponse);
                })
                .finally(CommonService.loadingComplete);
        }
    }

    angular.module("app.components.card")
        .controller("CardListController", CardListController);
})();