(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardListController($scope, globals, CardManager, CommonService, Logger, UserManager) {

        var _ = CommonService._,
            vm = this,
            activeSearchFilter = "",
            currentPage = 0;

        vm.config = globals.CARD_LIST.CONFIG;
        vm.cards = [];
        vm.loadingComplete = false;
        vm.searchFilter = "";
        vm.searchOptions = globals.CARD_LIST.SEARCH_OPTIONS;

        vm.applySearchFilter = applySearchFilter;
        vm.loadNextPage = loadNextPage;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function applySearchFilter() {
            if(vm.searchFilter !== activeSearchFilter) {
                activeSearchFilter = vm.searchFilter;

                resetSearch();
            }
        }

        function beforeEnter() {
        }

        function loadNextPage() {
            var billingAccountId = UserManager.getUser().billingCompany.accountId;

            CommonService.loadingBegin();

            //fetch the next page of cards
            return CardManager.fetchCards(billingAccountId, vm.searchFilter, vm.searchFilter, vm.searchOptions.STATUSES, currentPage, vm.searchOptions.PAGE_SIZE)
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
                })
                .finally(CommonService.loadingComplete);
        }

        function resetSearch() {
            var view = CommonService.getFocusedView();

            //this should never happen
            if(!view) {
                var error = "Failed to apply search filter: Couldn't find the active view";
                Logger.error(error);
                throw new Error(error);
            }

            vm.loadingComplete = false;
            currentPage = 0;
            vm.cards = [];

            //TODO: Remove this kludge when Ionic's collection-repeat is fixed to remove previous items from the list
            angular.element(view[0].querySelector(".card-list").querySelectorAll(".row")).remove();

            //TODO: Remove this kludge when Ionic's ion-infinite-scroll is fixed to call onInfinite() when a collection is reset
            $scope.$$postDigest(function () {
                var infiniteList = angular.element(view[0].querySelector("ion-infinite-scroll"));

                if(!infiniteList) {
                    var error = "Failed to reset infinite scroll: No infinite scroll found";
                    Logger.error(error);
                    throw new Error(error);
                }

                //force the infinite scroll to re-evaluate the bounds so that an onInfinite update occurs
                infiniteList.controller("ionInfiniteScroll").checkBounds();
            });
        }
    }

    angular.module("app.components.card")
        .controller("CardListController", CardListController);
})();