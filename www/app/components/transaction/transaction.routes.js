(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("transaction", {
            abstract: true,
            url: "/transaction",
            views: {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("transaction.list", {
            cache   : true,
            url     : "/list/:cardId",
            views   : {
                "view": {
                    templateUrl: "app/components/transaction/templates/transactionList.html",
                    controller : "TransactionListController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.TRANSACTION_LIST.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("transaction.filterBy", {
            url:   "/filter/:filterBy/:filterValue",
            cache: false,
            views: {
                "view": {
                    templateUrl: "app/components/transaction/templates/transactionFilterBy.html",
                    controller : "TransactionFilterByController as vm"
                }
            },
            params: {
                isGreeking: false
            },
            resolve: {
                filterDetails: function(_, $stateParams, CardManager, DriverManager) {
                    switch (_.toLower($stateParams.filterBy)) {
                        case "date":
                            return {};
                        case "card":
                            return CardManager.fetchCard($stateParams.filterValue);
                        case "driver":
                            return DriverManager.fetchDriver($stateParams.filterValue);
                        default:
                            throw new Error("Unrecognized transaction filterBy: " + $stateParams.filterBy);
                    }
                }
            }
        });

        $stateProvider.state("transaction.postedDetail", {
            url:   "/posted/detail/:transactionId",
            cache: false,
            views: {
              "view": {
                templateUrl: "app/components/transaction/templates/postedTransactionDetail.html",
                controller : "PostedTransactionDetailController as vm",
              }
            },
            params: {
                isGreeking: false
            },
            resolve: {
                postedTransaction: function ($stateParams, LoadingIndicator, TransactionManager) {
                    var transactionId = $stateParams.transactionId;

                    LoadingIndicator.begin();

                    return TransactionManager.fetchPostedTransaction(transactionId)
                        .finally(function () {
                            LoadingIndicator.complete();
                        });
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.POSTED_TRANSACTION_DETAIL.CONFIG.ANALYTICS.pageName);
            }
        });

    }

    angular.module("app.components.transaction")
        .config(configureRoutes);
}());
