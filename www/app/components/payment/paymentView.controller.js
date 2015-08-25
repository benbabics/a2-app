(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentViewController($scope, $state, globals, payment, scheduledPaymentsCount, Payment) {

        var vm = this;

        vm.config = globals.PAYMENT_VIEW.CONFIG;

        vm.payment = {};
        vm.scheduledPaymentsCount = 0;

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

        function editPayment() {
            Payment.setPayment(vm.payment);
            $state.go("payment.update");
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentViewController", PaymentViewController);
})();