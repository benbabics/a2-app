(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function TransactionListController(_, $scope, $stateParams, $localStorage, $ionicScrollDelegate, globals, wexInfiniteListService) {

        var vm = this;

        vm.backStateOverride = null;
        vm.config = globals.TRANSACTION_LIST.CONFIG;

        vm.filterViews = $localStorage.$default({
          transactionsFilterValue: "date"
        });

        vm.handleFilterSelection = handleFilterSelection;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            if (_.has($stateParams, "cardId") && !_.isEmpty($stateParams.cardId) && _.isString($stateParams.cardId)) {
                vm.cardIdFilter = $stateParams.cardId;
            }
            else {
                vm.backStateOverride = "landing";
            }

            $scope.$on( '$destroy', handleResetCachedLists );
        }

        function handleFilterSelection() {
            $ionicScrollDelegate.scrollTop();
        }

        function handleResetCachedLists() {
            wexInfiniteListService.emptyCache( 'records-date' );
            wexInfiniteListService.emptyCache( 'records-driver' );
            wexInfiniteListService.emptyCache( 'records-card' );
        }

    }

    angular.module("app.components.transaction")
        .controller("TransactionListController", TransactionListController);
})();
