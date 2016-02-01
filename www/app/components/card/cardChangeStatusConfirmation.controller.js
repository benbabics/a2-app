(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardChangeStatusConfirmationController(globals, card, CommonService, Logger) {

        var _ = CommonService._,
            vm = this;

        vm.card = card;
        vm.config = globals.CARD_CHANGE_STATUS_CONFIRMATION.CONFIG;

        vm.getConfirmationMessage = getConfirmationMessage;

        activate();

        //////////////////////

        // Controller initialization
        function activate() {
        }

        function getConfirmationMessage() {
            var status = vm.card.status ? vm.card.status.toLowerCase() : null;

            if (_.has(vm.config.confirmationMessages, status)) {
                return vm.config.confirmationMessages[status];
            }
            else {
                Logger.warn("Card has unknown status");

                //TODO - Display an alternative message?
                return "";
            }
        }
    }

    angular.module("app.components.card")
        .controller("CardChangeStatusConfirmationController", CardChangeStatusConfirmationController);

})();
