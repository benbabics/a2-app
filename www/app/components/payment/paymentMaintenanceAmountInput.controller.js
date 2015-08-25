(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentMaintenanceAmountInputController($scope, $filter, $ionicHistory, globals, payment, invoiceSummary,
                                                     CommonService) {

        var DEFAULT_VALUE = 0,
            vm = this,
            paymentMaintenanceAmountInput = globals.PAYMENT_MAINTENANCE_FORM.INPUTS.AMOUNT,
            firstInput = true;

        //public members:
        vm.config = angular.extend({}, paymentMaintenanceAmountInput.CONFIG, globals.BUTTONS.CONFIG);
        vm.errors = paymentMaintenanceAmountInput.ERRORS;
        vm.amount = getDisplayAmount(DEFAULT_VALUE);

        vm.done = done;
        vm.onInputChange = onInputChange;

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

        function getActualAmount(value) {
            return $filter("wexPaymentAmount")(value);
        }

        function getDisplayAmount(value) {
            return value * 100;
        }

        function onInputChange(input, newValue, oldValue) {

            //reset the amount if this is the first time the user has entered a value since visiting the page
            if (firstInput) {
                if (input === "\b") {
                    clearInput();
                }
                else {
                    vm.amount = input;
                }

                firstInput = false;
            }
        }

        function showError(error) {
            CommonService.displayAlert({
                content: error
            });
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceAmountInputController", PaymentMaintenanceAmountInputController);
}());