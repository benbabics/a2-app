(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentDateInputController($ionicHistory, globals, payment, moment) {

        var vm = this;
        //public members:
        vm.config = angular.extend({}, globals.PAYMENT_ADD.INPUTS.DATE.CONFIG, globals.BUTTONS.CONFIG);
        vm.date = moment(payment.scheduledDate).toDate();
        vm.minDate = moment().subtract(1, "days").toDate();
        vm.maxDate = moment().add(vm.config.maxFutureDays, "days").toDate();

        vm.done = done;

        /////////////////////
        function done() {
            payment.scheduledDate = vm.date;

            $ionicHistory.goBack();
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentDateInputController", PaymentDateInputController);
}());