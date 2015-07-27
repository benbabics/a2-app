(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentAddController($scope, activeBanks, globals, CommonService, InvoiceManager, PaymentAddModel, UserManager) {

        var _ = CommonService._,
            vm = this;

        vm.config = globals.PAYMENT_ADD.CONFIG;

        vm.activeBanks = {};
        vm.billingCompany = {};
        vm.invoiceSummary = {};
        vm.payment = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.payment = new PaymentAddModel();

            vm.billingCompany = UserManager.getUser().billingCompany;
            vm.invoiceSummary = InvoiceManager.getInvoiceSummary();

            // the activeBanks object should be bound now to the object returned by fetchActiveBanks
            vm.activeBanks = activeBanks;

            setDefaultPaymentOptions();
        }

        //TODO - This should go away (or change) once the page becomes an actual form that users can update
        function getDefaultBankName() {
            var defaultBank = _.find(vm.activeBanks, "defaultBank", true);

            if (_.isObject(defaultBank)) {
                return defaultBank.name;
            }

            return "";
        }

        function setDefaultPaymentOptions() {
            vm.payment.amount = vm.invoiceSummary.minimumPaymentDue;
            vm.payment.bankAccount = getDefaultBankName();
            vm.payment.paymentDate = new Date();
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentAddController", PaymentAddController);
})();