(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentMaintenanceConfirmationController($scope, globals, maintenance, PaymentMaintenance) {

        var vm = this,
            paymentMaintenanceConfirmation = globals.PAYMENT_MAINTENANCE_CONFIRMATION;

        vm.config = angular.extend({}, paymentMaintenanceConfirmation.CONFIG, getConfig());

        vm.payment = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.payment = PaymentMaintenance.getPayment();

            // Clear the payment from the service so that any new add/edit flows cannot use the existing payment
            PaymentMaintenance.clearPayment();
        }

        function getConfig() {
            switch(maintenance.state) {
                case maintenance.states.ADD:
                    return paymentMaintenanceConfirmation.ADD.CONFIG;
                case maintenance.states.UPDATE:
                    return paymentMaintenanceConfirmation.UPDATE.CONFIG;
                default:
                    var error = "Unrecognized payment maintenance state: " + maintenance.state;

                    Logger.error(error);
                    throw new Error(error);
            }
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceConfirmationController", PaymentMaintenanceConfirmationController);
})();