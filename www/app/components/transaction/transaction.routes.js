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
            }
        });

    }

    angular.module("app.components.transaction")
        .config(configureRoutes);
}());