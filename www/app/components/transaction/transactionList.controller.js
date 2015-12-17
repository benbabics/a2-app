(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function TransactionListController($cordovaGoogleAnalytics, $scope, globals, moment,
                                       CommonService, Logger, TransactionManager, UserManager) {

        var _ = CommonService._,
            vm = this,
            currentPage = 0;

        vm.config = globals.TRANSACTION_LIST.CONFIG;
        vm.firstPageLoaded = false;
        vm.postedTransactions = [];
        vm.searchOptions = globals.TRANSACTION_LIST.SEARCH_OPTIONS;

        vm.loadNextPage = loadNextPage;
        vm.pageLoaded = pageLoaded;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

        function loadNextPage() {
            var billingAccountId = UserManager.getUser().billingCompany.accountId,
                fromDate = moment().subtract(vm.searchOptions.MAX_DAYS, "days").toDate(),
                toDate = moment().toDate();

            CommonService.loadingBegin();

            //fetch the next page of transactions
            return TransactionManager.fetchPostedTransactions(billingAccountId, fromDate, toDate, currentPage, vm.searchOptions.PAGE_SIZE)
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
                .finally(CommonService.loadingComplete);
        }

        function pageLoaded() {
            vm.firstPageLoaded = true;
        }

    }

    angular.module("app.components.transaction")
        .controller("TransactionListController", TransactionListController);
})();
