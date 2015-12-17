(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:11

    /* @ngInject */
    function PaymentMaintenanceFormController($cordovaGoogleAnalytics, $scope,
                                              globals, hasMultipleBanks, maintenance, moment, payment,
                                              CommonService, InvoiceManager, Logger, UserManager) {

        var _ = CommonService._,
            vm = this,
            paymentMaintenanceForm = globals.PAYMENT_MAINTENANCE_FORM;

        vm.config = angular.extend({}, paymentMaintenanceForm.CONFIG, getConfig());

        vm.backStateOverride = null;
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

            //override back to go to the landing page if we're in ADD mode
            if (maintenance.state === maintenance.states.ADD) {
                vm.backStateOverride = "landing";
            }
        }

        function beforeEnter() {
            vm.billingCompany = UserManager.getUser().billingCompany;
            vm.hasMultipleBanks = hasMultipleBanks;
            vm.invoiceSummary = InvoiceManager.getInvoiceSummary();
            vm.payment = payment;
            vm.minDate = moment().subtract(1, "days").toDate();
            vm.maxDate = moment().add(paymentMaintenanceForm.INPUTS.DATE.CONFIG.maxFutureDays, "days").toDate();

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

        function getConfig() {
            if (_.has(paymentMaintenanceForm, maintenance.state)) {
                return paymentMaintenanceForm[maintenance.state].CONFIG;
            }
            else {
                var error = "Unrecognized payment maintenance state: " + maintenance.state;

                Logger.error(error);
                throw new Error(error);
            }
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceFormController", PaymentMaintenanceFormController);
})();
