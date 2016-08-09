(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function filterDateTransactionList(globals, _, moment, Logger, TransactionManager, UserManager) {
        var infiniteScrollService;

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

            scope.shouldDisplayPendingDivider = false;
            scope.shouldDisplayPostedDivider  = false;

            requestParams = {
                billingAccountId: UserManager.getUser().billingCompany.accountId,
                fromDate:         moment().subtract( scope.searchOptions.MAX_DAYS, 'days' ).toDate(),
                toDate:           moment().toDate()
            };

            controller.assignServiceDelegate({
                makeRequest:      handleMakeRequestPostedTransactions,
                onResetItems:     handleOnResetItems,
                onError:          handleOnError,
                onRenderComplete: handleOnRenderComplete
            });

            // if we don't yet have pending transactions, fetch them
            if ( !scope.transactions.pendingCollection ) {
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
                )
                .then( sortTransactionsByDate );
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
            function sortTransactionsByDate(transacstions) {
                return _.sortBy( transacstions, function(obj) {
                    return obj.postDate;
                }).reverse();
            }

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
                        transactionsCollection = sortTransactionsByDate( transactionsCollection );
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
