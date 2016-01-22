(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:11

    /* @ngInject */
    function PaymentMaintenanceSummaryController($scope, $ionicHistory, globals, maintenanceDetails, moment, payment,
                                                 CommonService, InvoiceManager, Logger, PaymentManager, UserManager) {

        var vm = this,
            paymentMaintenanceSummary = globals.PAYMENT_MAINTENANCE_SUMMARY;

        vm.config = maintenanceDetails.getConfig(paymentMaintenanceSummary);

        vm.processPayment = processPayment;
        vm.payment = {};
        vm.warnings = [];

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function addPayment() {
            CommonService.loadingBegin();

            return PaymentManager.addPayment(UserManager.getUser().billingCompany.accountId, vm.payment)
                .then(function (paymentResponse) {
                    vm.payment.set(paymentResponse);

                    goToConfirmationPage();
                })
                .catch(function (paymentError) {
                    //TODO - What do we do here?
                    Logger.error("Failed to add payment: " + paymentError);
                })
                .finally(function () {
                    CommonService.loadingComplete();
                });

        }

        function goToConfirmationPage() {
            // do not allow backing up to the summary page
            $ionicHistory.nextViewOptions({disableBack: true});

            // transition to the confirmation page
            maintenanceDetails.go("payment.maintenance.confirmation");
        }

        function processPayment() {
            var maintenanceStates = maintenanceDetails.getStates();

            // call the function that corresponds to the current state
            switch (maintenanceDetails.state) {
                case maintenanceStates.ADD:
                    return addPayment();
                case maintenanceStates.UPDATE:
                    return updatePayment();
                default:
                    var error = "Unrecognized payment maintenance state: " + maintenanceDetails.state;

                    Logger.error(error);
                    throw new Error(error);
            }
        }

        function updatePayment() {
            CommonService.loadingBegin();

            return PaymentManager.updatePayment(UserManager.getUser().billingCompany.accountId, vm.payment)
                .then(function (paymentResponse) {
                    vm.payment.set(paymentResponse);

                    goToConfirmationPage();
                })
                .catch(function (paymentError) {
                    //TODO - What do we do here?
                    Logger.error("Failed to update payment: " + paymentError);
                })
                .finally(function () {
                    CommonService.loadingComplete();
                });

        }

        function beforeEnter() {
            var invoiceSummary = InvoiceManager.getInvoiceSummary();

            vm.payment = payment;

            if (parseFloat(vm.payment.amount) < parseFloat(invoiceSummary.minimumPaymentDue)) {
                vm.warnings.push(paymentMaintenanceSummary.WARNINGS.PAYMENT_AMOUNT_LESS_THAN_MINIMUM);
            }
            if (moment(vm.payment.scheduledDate).isAfter(invoiceSummary.paymentDueDate)) {
                vm.warnings.push(paymentMaintenanceSummary.WARNINGS.PAYMENT_DATE_PAST_DUE_DATE);
            }
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceSummaryController", PaymentMaintenanceSummaryController);
})();
