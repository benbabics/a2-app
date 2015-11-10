(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    // jshint maxparams:8
    function CardReissueFormController($scope, $state, globals, cardReissueDetails,
                                       CardManager, CommonService, Logger, UserManager) {

        var _ = CommonService._,
            vm = this;

        vm.config = globals.CARD_REISSUE.CONFIG;
        vm.cardReissueDetails = cardReissueDetails;

        vm.isFormComplete = isFormComplete;
        vm.promptReissue = promptReissue;

        activate();

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }

        function confirmReissue() {
            var accountId = UserManager.getUser().billingCompany.accountId;

            CommonService.loadingBegin();

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
                .finally(CommonService.loadingComplete);
        }

        function isFormComplete() {
            return !_.isEmpty(vm.cardReissueDetails.shippingAddress) &&
                !_.isEmpty(vm.cardReissueDetails.selectedShippingMethod) &&
                vm.cardReissueDetails.reissueReason;
        }

        function promptReissue() {
            return CommonService.displayConfirm({
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
