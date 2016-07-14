(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function filterDateTransactionList() {
        var infiniteScrollService;

        return {
            restrict:    "E",
            templateUrl: "app/components/transaction/templates/filterDateTransactionList.directive.html",
            scope: {
                cardId:      '=',
                filterBy:    '=',
                filterValue: '=',
                cacheKey:    '@'
            },
            controller: controller
        };

        function controller($scope, globals, _, moment, Logger, TransactionManager, UserManager, wexInfiniteListService) {
            var serviceDelegate = {
                    makeRequest: makeRequestPostedTransactions
                },
                requestParams = {
                    billingAccountId: UserManager.getUser().billingCompany.accountId,
                    fromDate:         moment().subtract(900, "days").toDate(),
                    // fromDate:         moment().subtract(vm.searchOptions.MAX_DAYS, "days").toDate(),
                    toDate:           moment().toDate()
                };

            function loadNextPage() {
                return $scope.infiniteScrollService.loadNextPage()
                    .catch (function(errorResponse) {
                        //TODO - What do we do here?
                        Logger.error("Failed to fetch next page of posted transactions: " + errorResponse);
                    })
                    .finally(function() {
                        $scope.$broadcast("scroll.refreshComplete");
                    });
            }

            function resetSearchResults() {
                makeRequestPendingTransactions();
                $scope.infiniteScrollService.resetCollection();
            }

            function sortTransactionsByDate(transacstions) {
              return _.sortBy( transacstions, function(obj) {
                  return obj.postDate;
              }).reverse();
            }

            function makeRequestPostedTransactions(requestConfig) {
                return TransactionManager.fetchPostedTransactions(
                    requestParams.billingAccountId, requestParams.fromDate, requestParams.toDate, requestConfig.currentPage, requestConfig.pageSize, $scope.filterBy, $scope.filterValue, $scope.cardId
                )
                .then( sortTransactionsByDate );
            }

            function makeRequestPendingTransactions() {
                var fauxDate = moment( '04/16/2015' );
                var requestConfig = _.extend({}, $scope.infiniteScrollService.settings, {
                    fromDate: moment( fauxDate ).toDate(),
                    toDate  : moment( fauxDate ).add(13, 'days').toDate()
                });

                if ( $scope.transactions ) {
                    $scope.infiniteScrollService.model.pendingCollection = [];
                }

                TransactionManager.fetchPendingTransactions(
                    requestParams.billingAccountId, requestConfig.fromDate, requestConfig.toDate, requestConfig.currentPage, requestConfig.pageSize, requestConfig.filterBy, requestConfig.filterValue, $scope.filterBy, $scope.filterValue, $scope.cardId
                )
                    .then(function(transactionsCollection) {
                        transactionsCollection = sortTransactionsByDate( transactionsCollection );
                        $scope.infiniteScrollService.model.pendingCollection = transactionsCollection;
                    })
                    .catch(function() {
                        console.log('fetchPendingTransactions failure', arguments);
                    })
                    .finally(function() {
                        $scope.$broadcast("scroll.refreshComplete");
                    });
            }

            $scope.config                = globals.TRANSACTION_LIST.CONFIG;
            $scope.searchOptions         = globals.TRANSACTION_LIST.SEARCH_OPTIONS;
            $scope.infiniteScrollService = new wexInfiniteListService( serviceDelegate, _.pick($scope, 'cacheKey') );
            $scope.transactions          = $scope.infiniteScrollService.model;

            $scope.loadNextPage       = loadNextPage;
            $scope.resetSearchResults = resetSearchResults;

            if ( !$scope.transactions.pendingCollection ) {
                makeRequestPendingTransactions();
            }
        }
    }

    angular.module("app.components.transaction")
        .directive("filterDateTransactionList", filterDateTransactionList);
}());
