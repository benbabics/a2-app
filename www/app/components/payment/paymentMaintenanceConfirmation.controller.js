(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function PaymentMaintenanceConfirmationController($scope, globals, payment, Navigation, PaymentMaintenanceUtil) {

        var vm = this;

        vm.config = PaymentMaintenanceUtil.getConfig(globals.PAYMENT_MAINTENANCE_CONFIRMATION);

        vm.payment = {};

        vm.goToPaymentActivity = Navigation.goToPaymentActivity;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.payment = payment;
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceConfirmationController", PaymentMaintenanceConfirmationController);
})();
