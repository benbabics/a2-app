(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function filterDriverTransactionList(globals, Logger, DriverManager, UserManager) {
        return {
            restrict:    "E",
            templateUrl: "app/components/transaction/templates/filterDriverTransactionList.directive.html",
            scope: {
                cardId: '=',
            },
            controller: 'WexInfiniteListController',
            link:       link
        };

        function link(scope, element, attrs, controller) {
            scope.config        = globals.TRANSACTION_LIST.CONFIG;
            scope.searchOptions = globals.TRANSACTION_LIST.SEARCH_OPTIONS;

            controller.assignServiceDelegate({
                makeRequest: handleMakeRequest,
                onError:     handleOnError
            });

            function handleMakeRequest(requestConfig) {
                var SEARCH_OPTIONS   = globals.DRIVER_LIST.SEARCH_OPTIONS,
                    billingAccountId = UserManager.getUser().billingCompany.accountId;

                return DriverManager.fetchDrivers(billingAccountId, {
                    status:     SEARCH_OPTIONS.STATUS_ACTIVE,
                    pageNumber: requestConfig.currentPage,
                    pageSize:   requestConfig.pageSize
                });
            }

            function handleOnError(errorResponse) {
                //TODO - What do we do here?
                Logger.error( 'Failed to fetch next page of driver transactions: ' + errorResponse );
            }
        }
    }

    angular.module("app.components.transaction")
        .directive("filterDriverTransactionList", filterDriverTransactionList);
}());
