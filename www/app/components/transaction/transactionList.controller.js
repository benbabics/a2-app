(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:10

    /* @ngInject */
    function TransactionListController(_, $scope, $stateParams, globals, moment,
                                       ElementUtil, LoadingIndicator, Logger, TransactionManager, UserManager) {

        var vm = this,
            cardIdFilter,
            currentPage = 0;

        vm.backStateOverride = null;
        vm.config = globals.TRANSACTION_LIST.CONFIG;
        vm.firstPageLoaded = false;
        vm.loadingComplete = false;
        vm.postedTransactions = [];
        vm.searchOptions = globals.TRANSACTION_LIST.SEARCH_OPTIONS;

        vm.loadNextPage = loadNextPage;
        vm.pageLoaded = pageLoaded;
        vm.resetSearchResults = resetSearchResults;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            if (_.has($stateParams, "cardId") &&
                !_.isEmpty($stateParams.cardId) &&
                _.isString($stateParams.cardId)) {
                cardIdFilter  = $stateParams.cardId;
            }
            else {
                vm.backStateOverride = "landing";
            }
        }

        function loadNextPage() {
            var billingAccountId = UserManager.getUser().billingCompany.accountId,
                fromDate = moment().subtract(vm.searchOptions.MAX_DAYS, "days").toDate(),
                toDate = moment().toDate();

            LoadingIndicator.begin();

            //fetch the next page of transactions
            return TransactionManager.fetchPostedTransactions(billingAccountId, fromDate, toDate, currentPage, vm.searchOptions.PAGE_SIZE, cardIdFilter)
                .then(function (postedTransactions) {
                    vm.loadingComplete = _.size(postedTransactions) < vm.searchOptions.PAGE_SIZE;

                    if (!_.isEmpty(postedTransactions)) {
                        //add the fetched transactions to the current list
                        vm.postedTransactions = vm.postedTransactions.concat(postedTransactions);

                        ++currentPage;
                    }

                    return vm.loadingComplete;
                })
                .catch(function (errorResponse) {
                    //TODO - What do we do here?
                    Logger.error("Failed to fetch next page of posted transactions: " + errorResponse);

                    // There was an error fetching data so indicate that there is no more data to fetch
                    vm.loadingComplete = true;
                    return vm.loadingComplete;
                })
                .finally(LoadingIndicator.complete);
        }

        function pageLoaded() {
            vm.firstPageLoaded = true;
        }

        function resetSearchResults() {
            vm.firstPageLoaded = false;
            vm.loadingComplete = false;
            vm.postedTransactions = [];
            currentPage = 0;

            //note: we need to hide the refresher before resetting the infinite list or else it won't refetch the results
            $scope.$broadcast("scroll.refreshComplete");

            ElementUtil.resetInfiniteList();
        }

    }

    angular.module("app.components.transaction")
        .controller("TransactionListController", TransactionListController);
})();
