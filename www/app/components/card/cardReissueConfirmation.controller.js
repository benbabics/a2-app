(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueConfirmationController(globals, cardReissueDetails, Navigation) {

        var vm = this;

        vm.reissuedCard = cardReissueDetails.reissuedCard;
        vm.config = globals.CARD_REISSUE_CONFIRMATION.CONFIG;

        vm.goToCards = Navigation.goToCards;

        //////////////////////

    }

    angular.module("app.components.card")
        .controller("CardReissueConfirmationController", CardReissueConfirmationController);

})();
