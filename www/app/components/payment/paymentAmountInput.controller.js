(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentAmountInputController($scope, $filter, $ionicHistory, globals, payment, invoiceSummary, CommonService) {

        var DEFAULT_VALUE = 0,
            vm = this;
        //public members:
        vm.config = angular.extend({}, globals.PAYMENT_ADD.INPUTS.AMOUNT.CONFIG, globals.BUTTONS.CONFIG);
        vm.errors = globals.PAYMENT_ADD.INPUTS.AMOUNT.ERRORS;
        vm.amount = getDisplayAmount(DEFAULT_VALUE);

        vm.clearInput = clearInput;
        vm.done = done;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.amount = getDisplayAmount(payment.amount);
        }

        function clearInput() {
            vm.amount = getDisplayAmount(DEFAULT_VALUE);
        }

        function getActualAmount(value) {
            return $filter("wexPaymentAmount")(value);
        }

        function getDisplayAmount(value) {
            return value * 100;
        }

        function done() {
            var actualAmount = getActualAmount(vm.amount);

            if (actualAmount === 0 || !actualAmount) {
                showError(vm.errors.zeroPayment);
            }
            else if (actualAmount > invoiceSummary.currentBalance) {
                showError(vm.errors.paymentTooLarge);
            }
            else {
                payment.amount = actualAmount;

                $ionicHistory.goBack();
            }
        }

        function showError(error) {
            CommonService.displayAlert({
                content: error
            });
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentAmountInputController", PaymentAmountInputController);
}());