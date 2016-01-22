(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:2

    /* @ngInject */
    function CardReissueConfirmationController(globals, cardReissueDetails) {

        var vm = this;

        vm.reissuedCard = cardReissueDetails.reissuedCard;
        vm.config = globals.CARD_REISSUE_CONFIRMATION.CONFIG;

        activate();

        //////////////////////

        // Controller initialization
        function activate() {
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueConfirmationController", CardReissueConfirmationController);

})();