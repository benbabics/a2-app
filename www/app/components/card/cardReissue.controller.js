(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueController($scope, $state, globals, cardReissue,
                                   CardManager, CommonService, Logger, UserManager) {

        var _ = CommonService._,
            vm = this;

        vm.config = globals.CARD_REISSUE.CONFIG;
        vm.cardReissue = cardReissue;

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

            CardManager.reissue(accountId, vm.cardReissue.card.cardId, vm.cardReissue.reissueReason, vm.cardReissue.selectedShippingMethod.id)
                .then(function(card) {
                    $state.go("card.reissue.confirmation", {cardId: card.cardId});
                })
                .catch(function(errorResponse) {
                    //TODO - What do we do here?

                    Logger.error("Failed to reissue card: " + errorResponse);
                })
                .finally(CommonService.loadingComplete);
        }

        function isFormComplete() {
            return !_.isEmpty(vm.cardReissue.shippingAddress) &&
                !_.isEmpty(vm.cardReissue.selectedShippingMethod) &&
                vm.cardReissue.reissueReason;
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
        .controller("CardReissueController", CardReissueController);
})();