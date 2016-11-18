(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function filterDateTransactionList(globals, _, moment, Logger, TransactionManager, UserManager) {

        return {
            restrict:    "E",
            templateUrl: "app/components/transaction/templates/filterDateTransactionList.directive.html",
            scope: {
                cardId:      '=',
                filterBy:    '=',
                filterValue: '=',
                onScroll:    '&'
            },
            controller: 'WexInfiniteListController',
            link:       link
        };

        function link(scope, element, attrs, controller) {
            var requestParams;

            scope.config             = globals.TRANSACTION_LIST.CONFIG;
            scope.searchOptions      = globals.TRANSACTION_LIST.SEARCH_OPTIONS;
            scope.transactions       = scope.infiniteScrollService.model;
            scope.unlessAppIsClassic = !UserManager.getUser().isOnlineAppClassic;


            requestParams = {
                billingAccountId: UserManager.getUser().billingCompany.accountId,
                toDate:           moment().toDate()
            };

            controller.assignServiceDelegate({
                makeRequest:      handleMakeRequestPostedTransactions,
                onResetItems:     handleOnResetItems,
                onError:          handleOnError,
                onRenderComplete: handleOnRenderComplete
            });

            // if we have posted transactions, display the divider
            if ( scope.transactions.collection.length ) {
                scope.shouldDisplayPostedDivider  = true;
            }
            // if we have pending transactions, display the divider
            if ( scope.transactions.pendingCollection && scope.transactions.pendingCollection.length ) {
                scope.shouldDisplayPendingDivider = true;
            }
            // otherwise fetch them
            else {
                makeRequestPendingTransactions();
            }

            /**
             * Delegate Methods
            **/
            function handleMakeRequestPostedTransactions(requestConfig) {
                if ( requestConfig.currentPage > 0 && scope.onScroll ) {
                    scope.onScroll();
                }

                return TransactionManager.fetchPostedTransactions(
                    requestParams.billingAccountId, requestParams.fromDate, requestParams.toDate, requestConfig.currentPage, requestConfig.pageSize, scope.filterBy, scope.filterValue, scope.cardId
                );
            }

            function handleOnResetItems() {
              makeRequestPendingTransactions();
            }

            function handleOnError(errorResponse) {
                //TODO - What do we do here?
                Logger.error( 'Failed to fetch next page of posted transactions: ' + errorResponse );
            }

            function handleOnRenderComplete() {
                if ( scope.transactions.collection.length ) {
                    scope.shouldDisplayPostedDivider = true;
                }
            }

            /**
             * Private Methods
            **/
            function makeRequestPendingTransactions() {
                if ( scope.isAppClassic ) return;

                // hide pending transactions divider
                scope.shouldDisplayPendingDivider = false;

                var requestConfig = _.extend({}, scope.infiniteScrollService.settings, {
                    fromDate: moment().subtract(scope.searchOptions.PENDING_MAX_DAYS, 'days').toDate(),
                    toDate:   moment().toDate()
                });

                if ( scope.transactions ) {
                    scope.transactions.pendingCollection = [];
                }

                TransactionManager.fetchPendingTransactions(
                    requestParams.billingAccountId, requestConfig.fromDate, requestConfig.toDate, requestConfig.currentPage, requestConfig.pageSize, requestConfig.filterBy, requestConfig.filterValue, scope.filterBy, scope.filterValue, scope.cardId
                )
                    .then(function(transactionsCollection) {
                        scope.transactions.pendingCollection = transactionsCollection;
                    })
                    .catch(function() {
                        Logger.error( 'fetchPendingTransactions failure', arguments );
                    })
                    .finally(function() {
                        var shouldDisplay = scope.transactions.pendingCollection.length > 0;
                        scope.shouldDisplayPendingDivider = shouldDisplay;
                        scope.$broadcast( 'scroll.refreshComplete' );
                    });
            }
        }
    }

    angular.module("app.components.transaction")
        .directive("filterDateTransactionList", filterDateTransactionList);
}());
