(function () {
    "use strict";

    /* @ngInject */
    function configureRoutes($stateProvider) {

        $stateProvider.state("card", {
            abstract: true,
            url: "/card",
            views: {
                "@": {
                    template: "<ion-nav-view name='view'></ion-nav-view>"
                }
            }
        });

        $stateProvider.state("card.list", {
            cache      : false,
            url     : "/list",
            views   : {
                "view@card": {
                    templateUrl: "app/components/card/templates/cardList.html",
                    controller : "CardListController as vm"
                }
            }
        });
    }

    angular.module("app.components.card")
        .config(configureRoutes);
}());