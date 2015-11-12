(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function CardChangeStatusController($scope, $state, globals, card,
                                        CardManager, CommonService, Logger, UserManager) {

        var vm = this;

        vm.card = card;
        vm.cardStatuses = globals.CARD.STATUS;
        vm.config = globals.CARD_CHANGE_STATUS.CONFIG;

        vm.promptStatusChange = promptStatusChange;

        activate();

        //////////////////////

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }

        function confirmStatusChange(newStatus) {
            var accountId = UserManager.getUser().billingCompany.accountId;

            CommonService.loadingBegin();

            CardManager.updateStatus(accountId, vm.card.cardId, newStatus)
                .then(function(card) {
                    $state.go("card.changeStatus.confirmation", {cardId: card.cardId});
                })
                .catch(function(errorResponse) {
                    //TODO - What do we do here?

                    Logger.error("Failed to change card status: " + errorResponse);
                })
                .finally(CommonService.loadingComplete);
        }

        function promptStatusChange(newStatus) {
            return CommonService.displayConfirm({
                content             : vm.config.confirmationPopup.contentMessages[newStatus],
                okButtonText        : vm.config.confirmationPopup.yesButton,
                cancelButtonText    : vm.config.confirmationPopup.noButton,
                okButtonCssClass    : "button-submit",
                cancelButtonCssClass: "button-default"
            })
                .then(function (result) {
                    if (result) {
                        confirmStatusChange(newStatus);
                    }
                    else {
                        //close the popup
                    }
                });
        }
    }

    angular.module("app.components.card")
        .controller("CardChangeStatusController", CardChangeStatusController);

})();
