(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentMaintenanceFormController($scope, globals, maintenance, moment, payment,
                                              BankManager, InvoiceManager, Logger, UserManager) {

        var vm = this,
            paymentMaintenanceForm = globals.PAYMENT_MAINTENANCE_FORM;

        vm.config = angular.extend({}, paymentMaintenanceForm.CONFIG, getConfig());

        vm.billingCompany = {};
        vm.hasMultipleBanks = false;
        vm.invoiceSummary = {};
        vm.maintenance = maintenance;
        vm.maxDate = {};
        vm.minDate = {};
        vm.payment = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.hasMultipleBanks = _.size(BankManager.getActiveBanks()) > 1;
            vm.billingCompany = UserManager.getUser().billingCompany;
            vm.invoiceSummary = InvoiceManager.getInvoiceSummary();
            vm.payment = payment;
            vm.minDate = moment().subtract(1, "days").toDate();
            vm.maxDate = moment().add(paymentMaintenanceForm.INPUTS.DATE.CONFIG.maxFutureDays, "days").toDate();
        }

        function getConfig() {
            switch(maintenance.state) {
                case maintenance.states.ADD:
                    return paymentMaintenanceForm.ADD.CONFIG;
                case maintenance.states.UPDATE:
                    return paymentMaintenanceForm.UPDATE.CONFIG;
                default:
                    var error = "Unrecognized payment maintenance state: " + maintenance.state;

                    Logger.error(error);
                    throw new Error(error);
            }
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceFormController", PaymentMaintenanceFormController);
})();