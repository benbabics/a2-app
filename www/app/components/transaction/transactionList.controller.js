(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function TransactionListController(_, $scope, $stateParams, $localStorage, globals, moment,
                                       LoadingIndicator, Logger, TransactionManager, UserManager) {

        var vm = this,
            cardIdFilter,
            currentPage = 0;

        vm.backStateOverride = null;
        vm.config = globals.TRANSACTION_LIST.CONFIG;
        vm.loadingComplete = false;
        vm.postedTransactions = [];
        vm.searchOptions = globals.TRANSACTION_LIST.SEARCH_OPTIONS;

        vm.filterViews = $localStorage.$default({
          transactionsFilterValue: "date"
        });

        vm.loadNextPage = loadNextPage;
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

            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            //show the fullscreen loading indicator for the first page load
            LoadingIndicator.begin();
        }

        /**
         * Loads the next page of transaction data.
         *
         * @param {Array} [postedTransactionsResult] An optional buffer to add the newly fetched transactions to.
         */
        function loadNextPage(postedTransactionsResult) {
            var billingAccountId = UserManager.getUser().billingCompany.accountId,
                fromDate = moment().subtract(vm.searchOptions.MAX_DAYS, "days").toDate(),
                toDate = moment().toDate();

            postedTransactionsResult = postedTransactionsResult || vm.postedTransactions;

            //fetch the next page of transactions
            return TransactionManager.fetchPostedTransactions(billingAccountId, fromDate, toDate, currentPage, vm.searchOptions.PAGE_SIZE, cardIdFilter)
                .then(function (postedTransactions) {
                    vm.loadingComplete = _.size(postedTransactions) < vm.searchOptions.PAGE_SIZE;

                    if (!_.isEmpty(postedTransactions)) {
                        //add the fetched transactions to the current list
                        Array.prototype.push.apply(postedTransactionsResult, postedTransactions);

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
                .finally(function () {
                    $scope.$broadcast("scroll.refreshComplete");
                    LoadingIndicator.complete();
                });
        }

        function resetSearchResults() {
            vm.loadingComplete = false;
            currentPage = 0;

            //use double buffering so that the previous results don't disappear as the list is being refreshed
            var postedTransactionsBuffer = [];
            loadNextPage(postedTransactionsBuffer)
                .finally(function () {
                    vm.postedTransactions = postedTransactionsBuffer;
                });
        }

    }

    angular.module("app.components.transaction")
        .controller("TransactionListController", TransactionListController);
})();
