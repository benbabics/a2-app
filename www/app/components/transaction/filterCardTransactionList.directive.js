(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function filterCardTransactionList(globals, Logger, CardManager, UserManager) {
        return {
            restrict:    "E",
            templateUrl: "app/components/transaction/templates/filterCardTransactionList.directive.html",
            scope: {
                cardId: '=',
            },
            controller: 'WexInfiniteListController',
            link:       link
        };

        function link(scope, element, attrs, controller) {
            scope.config       = globals.TRANSACTION_LIST.CONFIG;
            scope.transactions = scope.infiniteScrollService.model;

            controller.assignServiceDelegate({
                makeRequest: handleMakeRequest,
                onError:     handleOnError
            });

            function handleMakeRequest(requestConfig) {
                var SEARCH_OPTIONS   = globals.CARD_LIST.SEARCH_OPTIONS,
                    billingAccountId = UserManager.getUser().billingCompany.accountId;

                return CardManager.fetchCards(
                    billingAccountId, null, null, null, SEARCH_OPTIONS.STATUS_ACTIVE, requestConfig.currentPage, requestConfig.pageSize
                );
            }

            function handleOnError(errorResponse) {
              //TODO - What do we do here?
              Logger.error( 'Failed to fetch next page of card transactions: ' + errorResponse );
            }
        }
    }

    angular.module("app.components.transaction")
        .directive("filterCardTransactionList", filterCardTransactionList);
}());
