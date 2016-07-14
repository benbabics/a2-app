(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function filterCardTransactionList() {
        return {
            restrict:    "E",
            templateUrl: "app/components/transaction/templates/filterCardTransactionList.directive.html",
            scope: {
                cardId:   '=',
                cacheKey: '@'
            },
            controller: controller
        };

        function controller($scope, globals, moment, Logger, CardManager, UserManager, wexInfiniteListService) {
            var serviceDelegate = {
                makeRequest: makeRequest
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
                $scope.infiniteScrollService.resetCollection();
            }

            function makeRequest(requestConfig) {
                var SEARCH_OPTIONS   = globals.CARD_LIST.SEARCH_OPTIONS,
                    billingAccountId = UserManager.getUser().billingCompany.accountId;

                return CardManager.fetchCards(
                    billingAccountId, null, null, null, SEARCH_OPTIONS.STATUS_ACTIVE, requestConfig.currentPage, requestConfig.pageSize
                );
            }

            $scope.config                = globals.TRANSACTION_LIST.CONFIG;
            $scope.searchOptions         = globals.TRANSACTION_LIST.SEARCH_OPTIONS;
            $scope.infiniteScrollService = new wexInfiniteListService( serviceDelegate, _.pick($scope, 'cacheKey') );;
            $scope.transactions          = $scope.infiniteScrollService.model.collection;

            $scope.loadNextPage       = loadNextPage;
            $scope.resetSearchResults = resetSearchResults;
        }
    }

    angular.module("app.components.transaction")
        .directive("filterCardTransactionList", filterCardTransactionList);
}());
