(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentSummaryController($ionicHistory, $scope, $state, globals, moment,
                                      CommonService, InvoiceManager, Payment, PaymentManager, UserManager) {

        var vm = this;

        vm.config = globals.PAYMENT_SUMMARY.CONFIG;

        vm.addPayment = addPayment;
        vm.goBack = goBack;
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
                .then(function(paymentResponse) {
                    Payment.getPayment().set(paymentResponse);

                    // transition to the confirmation page
                    $state.go("payment.confirmation");
                })
                .catch(function (paymentError) {
                    //TODO - What do we do here?
                })
                .finally(function () {
                    CommonService.loadingComplete();
                });

        }

        function beforeEnter() {
            var invoiceSummary = InvoiceManager.getInvoiceSummary();

            vm.payment = Payment.getPayment();

            if (parseFloat(vm.payment.amount) < parseFloat(invoiceSummary.minimumPaymentDue)) {
                vm.warnings.push(globals.PAYMENT_SUMMARY.WARNINGS.PAYMENT_AMOUNT_LESS_THAN_MINIMUM);
            }
            if (moment(vm.payment.scheduledDate).isAfter(invoiceSummary.paymentDueDate)) {
                vm.warnings.push(globals.PAYMENT_SUMMARY.WARNINGS.PAYMENT_DATE_PAST_DUE_DATE);
            }
        }

        function goBack() {
            $ionicHistory.goBack();
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentSummaryController", PaymentSummaryController);
})();