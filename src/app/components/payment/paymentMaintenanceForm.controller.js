(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function PaymentMaintenanceFormController($scope, globals, hasMultipleBanks, ionicDatePicker, moment, payment,
                                              InvoiceManager, PaymentMaintenanceUtil, UserManager) {

        var vm = this,
            maxDate,
            minDate,
            paymentMaintenanceForm = globals.PAYMENT_MAINTENANCE_FORM;

        vm.config = PaymentMaintenanceUtil.getConfig(paymentMaintenanceForm);

        vm.backStateOverride = null;
        vm.billingCompany = {};
        vm.hasMultipleBanks = false;
        vm.invoiceSummary = {};
        vm.payment = {};

        vm.goToPage = goToPage;
        vm.openDatePicker = openDatePicker;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);

            //override back to go to the landing page if we're in ADD mode
            if (PaymentMaintenanceUtil.isAddState()) {
                vm.backStateOverride = "landing";
            }
        }

        function beforeEnter() {
            vm.billingCompany = UserManager.getUser().billingCompany;
            vm.hasMultipleBanks = hasMultipleBanks;
            vm.invoiceSummary = InvoiceManager.getInvoiceSummary();
            vm.payment = payment;

            minDate = moment().toDate();
            maxDate = moment().add(paymentMaintenanceForm.INPUTS.DATE.CONFIG.maxFutureDays, "days").toDate();
        }

        function goToPage(stateName, params) {
            PaymentMaintenanceUtil.go(stateName, params);
        }

        function onSelectDate(val) {
            vm.payment.scheduledDate = moment(val).toDate();
        }

        function openDatePicker() {
            var options = {
                callback: onSelectDate,
                from    : minDate,
                to      : maxDate
            };

            if (vm.payment.scheduledDate) {
                options.inputDate = vm.payment.scheduledDate;
            }

            ionicDatePicker.openDatePicker(options);
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceFormController", PaymentMaintenanceFormController);
})();
