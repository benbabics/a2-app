(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentAddController($scope, globals, moment, payment, BankManager, InvoiceManager, UserManager) {

        var vm = this;

        vm.config = globals.PAYMENT_ADD.CONFIG;

        vm.hasMultipleBanks = false;
        vm.billingCompany = {};
        vm.invoiceSummary = {};
        vm.payment = {};
        vm.minDate = {};
        vm.maxDate = {};

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
            vm.maxDate = moment().add(globals.PAYMENT_ADD.INPUTS.DATE.CONFIG.maxFutureDays, "days").toDate();
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentAddController", PaymentAddController);
})();