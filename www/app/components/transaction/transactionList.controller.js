(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function TransactionListController(_, $stateParams, globals, moment, LoadingIndicator, Logger, TransactionManager, UserManager) {

        var vm = this,
            currentPage = 0;

        vm.config = globals.TRANSACTION_LIST.CONFIG;
        vm.firstPageLoaded = false;
        vm.postedTransactions = [];
        vm.searchOptions = globals.TRANSACTION_LIST.SEARCH_OPTIONS;

        vm.loadNextPage = loadNextPage;
        vm.pageLoaded = pageLoaded;

        //////////////////////

        function loadNextPage() {
            var billingAccountId = UserManager.getUser().billingCompany.accountId,
                fromDate = moment().subtract(vm.searchOptions.MAX_DAYS, "days").toDate(),
                toDate = moment().toDate(),
                cardId;

            if (_.has($stateParams, "cardId") &&
                !_.isEmpty($stateParams.cardId) &&
                _.isString($stateParams.cardId)) {
                cardId  = $stateParams.cardId;
            }

            LoadingIndicator.begin();

            //fetch the next page of transactions
            return TransactionManager.fetchPostedTransactions(billingAccountId, fromDate, toDate, currentPage, vm.searchOptions.PAGE_SIZE, cardId)
                .then(function (postedTransactions) {
                    if (_.isEmpty(postedTransactions)) {
                        return true;
                    }
                    else {
                        //add the fetched transactions to the current list
                        vm.postedTransactions = vm.postedTransactions.concat(postedTransactions);

                        ++currentPage;
                        return false;
                    }
                })
                .catch(function (errorResponse) {
                    //TODO - What do we do here?
                    Logger.error("Failed to fetch next page of posted transactions: " + errorResponse);

                    // There was an error fetching data so indicate that there is no more data to fetch
                    return true;
                })
                .finally(LoadingIndicator.complete);
        }

        function pageLoaded() {
            vm.firstPageLoaded = true;
        }

    }

    angular.module("app.components.transaction")
        .controller("TransactionListController", TransactionListController);
})();
