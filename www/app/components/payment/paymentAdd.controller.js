(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentAddController($scope, globals, payment, InvoiceManager, UserManager) {

        var vm = this;

        vm.config = globals.PAYMENT_ADD.CONFIG;

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
            vm.billingCompany = UserManager.getUser().billingCompany;
            vm.invoiceSummary = InvoiceManager.getInvoiceSummary();
            vm.payment = payment;
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentAddController", PaymentAddController);
})();