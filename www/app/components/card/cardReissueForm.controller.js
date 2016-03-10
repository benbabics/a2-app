(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function CardReissueFormController(_, $state, globals,
                                       cardReissueDetails, CardManager, LoadingIndicator, Logger, PopupUtil, UserManager) {

        var vm = this;

        vm.config = globals.CARD_REISSUE.CONFIG;
        vm.cardReissueDetails = cardReissueDetails;

        vm.isFormComplete = isFormComplete;
        vm.promptReissue = promptReissue;

        activate();

        // Controller initialization
        function activate() {
        }

        function confirmReissue() {
            var accountId = UserManager.getUser().billingCompany.accountId;

            LoadingIndicator.begin();

            CardManager.reissue(accountId,
                vm.cardReissueDetails.originalCard.cardId,
                vm.cardReissueDetails.reissueReason,
                vm.cardReissueDetails.selectedShippingMethod.id)
                .then(function(card) {
                    vm.cardReissueDetails.reissuedCard = card;

                    $state.go("card.reissue.confirmation", {cardId: vm.cardReissueDetails.originalCard.cardId});
                })
                .catch(function(errorResponse) {
                    //TODO - What do we do here?

                    Logger.error("Failed to reissue card: " + errorResponse);
                })
                .finally(LoadingIndicator.complete);
        }

        function isFormComplete() {
            return !_.isEmpty(vm.cardReissueDetails.shippingAddress) &&
                !_.isEmpty(vm.cardReissueDetails.selectedShippingMethod) &&
                vm.cardReissueDetails.reissueReason;
        }

        function promptReissue() {
            return PopupUtil.displayConfirm({
                content             : vm.config.confirmationPopup.content,
                okButtonText        : vm.config.confirmationPopup.yesButton,
                cancelButtonText    : vm.config.confirmationPopup.noButton,
                okButtonCssClass    : "button-submit",
                cancelButtonCssClass: "button-default"
            })
                .then(function (result) {
                    if (result) {
                        confirmReissue();
                    }
                    else {
                        //close the popup
                    }
                });
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueFormController", CardReissueFormController);
})();
