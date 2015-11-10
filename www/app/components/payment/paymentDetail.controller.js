(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    // jshint maxparams:9
    function PaymentDetailController($scope, $state, globals, isPaymentEditable, payment,
                                     CommonService, Logger, PaymentManager, UserManager) {

        var vm = this;

        vm.config = globals.PAYMENT_VIEW.CONFIG;

        vm.payment = {};
        vm.isPaymentEditable = "";

        vm.displayCancelPaymentPopup = displayCancelPaymentPopup;
        vm.editPayment = editPayment;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.isPaymentEditable = isPaymentEditable;
            vm.payment = payment;
        }

        function confirmPaymentCancel() {
            PaymentManager.removePayment(UserManager.getUser().billingCompany.accountId, vm.payment.id)
                .then(function () {
                    $state.go("payment.list.view");
                })
                .catch(function (errorResponse) {
                    //TODO - What do we do here?
                    Logger.error("Failed to remove payment: " + errorResponse);
                });
        }

        function displayCancelPaymentPopup() {
            return CommonService.displayConfirm({
                content             : vm.config.cancelPaymentConfirm.content,
                okButtonText        : vm.config.cancelPaymentConfirm.yesButton,
                cancelButtonText    : vm.config.cancelPaymentConfirm.noButton,
                okButtonCssClass    : "button-submit",
                cancelButtonCssClass: "button-default"
            })
                .then(function (result) {
                    if (result) {
                        confirmPaymentCancel();
                    }
                    else {
                        //close the popup
                    }
                });
        }

        function editPayment() {
            $state.go("payment.update", {paymentId: vm.payment.id});
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentDetailController", PaymentDetailController);
})();
