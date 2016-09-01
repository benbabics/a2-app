(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardDetailController($state, globals, card) {

        var vm = this;

        vm.config = globals.CARD_DETAIL.CONFIG;
        vm.card = card;

        vm.goToTransactionActivity = goToTransactionActivity;

        function goToTransactionActivity() {
            return $state.go("transaction.filterBy", {
                filterBy: "card",
                filterValue: vm.card.cardId
            });
        }

    }

    angular.module("app.components.card")
        .controller("CardDetailController", CardDetailController);
})();
