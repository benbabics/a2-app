(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentAmountInputController($scope, $filter, globals, payment) {

        var DEFAULT_VALUE = 0,
            vm = this;
        //public members:
        vm.config = angular.extend({}, globals.PAYMENT.INPUTS.AMOUNT.CONFIG, globals.BUTTONS.CONFIG);
        vm.amount = getDisplayAmount(DEFAULT_VALUE);

        vm.clearInput = clearInput;

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
            return $filter("wexPaymentAmountFilter")(value);
        }

        function getDisplayAmount(value) {
            return value * 100;
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentAmountInputController", PaymentAmountInputController);
}());