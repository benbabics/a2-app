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
            cache      : false,
            url     : "/list",
            views   : {
                "view@transaction": {
                    templateUrl: "app/components/transaction/templates/transactionList.html",
                    controller : "TransactionListController as vm"
                }
            },
            onEnter: function(globals, AnalyticsUtil) {
                AnalyticsUtil.trackView(globals.TRANSACTION_LIST.CONFIG.ANALYTICS.pageName);
            }
        });

        $stateProvider.state("transaction.posted", {
            abstract: true,
            url     : "/posted",
            views   : {
                "view@transaction": {
                    template: "<ion-nav-view></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("transaction.posted.detail", {
            url        : "/detail/:transactionId",
            cache      : false,
            templateUrl: "app/components/transaction/templates/postedTransactionDetail.html",
            controller : "PostedTransactionDetailController as vm",
            resolve    : {
                postedTransaction: function ($stateParams, CommonService, TransactionManager) {
                    var transactionId = $stateParams.transactionId;

                    CommonService.loadingBegin();

                    return TransactionManager.fetchPostedTransaction(transactionId)
                        .finally(function () {
                            CommonService.loadingComplete();
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
