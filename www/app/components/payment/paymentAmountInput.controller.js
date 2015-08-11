(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentAmountInputController(globals) {

        var vm = this;
        //public members:
        vm.config = angular.extend({}, globals.PAYMENT.INPUTS.AMOUNT.CONFIG, globals.BUTTONS.CONFIG);
        vm.amount = "";

        vm.clearInput = clearInput;

        function clearInput() {
            vm.amount = "";
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentAmountInputController", PaymentAmountInputController);
}());