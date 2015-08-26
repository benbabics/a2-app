(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentViewController($scope, $state, globals, payment, scheduledPaymentsCount,
                                   CommonService, Payment, PaymentManager, UserManager) {

        var vm = this;

        vm.config = globals.PAYMENT_VIEW.CONFIG;

        vm.payment = {};
        vm.scheduledPaymentsCount = 0;

        vm.confirmPaymentCancel = confirmPaymentCancel;
        vm.editPayment = editPayment;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.scheduledPaymentsCount = scheduledPaymentsCount;
            vm.payment = payment;
        }

        function cancelPayment() {
            return PaymentManager.removePayment(UserManager.getUser().billingCompany.accountId, vm.payment.id);
        }

        function confirmPaymentCancel() {
            displayCancelPaymentPopup()
                .then(function (result) {
                    if (result) {
                        cancelPayment()
                            .then(function () {
                                $state.go("payment.list.view");
                            })
                            .catch(function (errorResponse) {
                                //TODO - What do we do here?
                            });
                    }
                    else {
                        //close the popup
                    }
                });
        }

        function displayCancelPaymentPopup() {
            return CommonService.displayConfirm({
                content             : vm.config.cancelPaymentConfirm.content,
                okButtonText        : vm.config.cancelPaymentConfirm.yesButton,
                cancelButtonText    : vm.config.cancelPaymentConfirm.noButton,
                okButtonCssClass    : "button-submit",
                cancelButtonCssClass: "button-default"
            });
        }

        function editPayment() {
            Payment.setPayment(vm.payment);
            $state.go("payment.update");
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentViewController", PaymentViewController);
})();