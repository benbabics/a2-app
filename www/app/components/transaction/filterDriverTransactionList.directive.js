(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function filterDriverTransactionList() {
        var infiniteScrollService;

        return {
            restrict:    "E",
            templateUrl: "app/components/transaction/templates/filterDriverTransactionList.directive.html",
            scope: {
                cardId: '='
            },
            controller: controller
        };

        function controller($scope, globals, moment, Logger, DriverManager, UserManager, wexInfiniteListService) {
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
                var SEARCH_OPTIONS   = globals.DRIVER_LIST.SEARCH_OPTIONS,
                    billingAccountId = UserManager.getUser().billingCompany.accountId;

                return DriverManager.fetchDrivers(billingAccountId, {
                    status:     SEARCH_OPTIONS.STATUS_ACTIVE,
                    pageNumber: requestConfig.currentPage,
                    pageSize:   requestConfig.pageSize
                });
            }

            if ( !infiniteScrollService ) {
                infiniteScrollService = new wexInfiniteListService( serviceDelegate );
            }

            $scope.config                = globals.TRANSACTION_LIST.CONFIG;
            $scope.searchOptions         = globals.TRANSACTION_LIST.SEARCH_OPTIONS;
            $scope.infiniteScrollService = infiniteScrollService;
            $scope.transactions          = $scope.infiniteScrollService.model.collection;

            $scope.loadNextPage       = loadNextPage;
            $scope.resetSearchResults = resetSearchResults;
        }
    }

    angular.module("app.components.transaction")
        .directive("filterDriverTransactionList", filterDriverTransactionList);
}());
