(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentAddController($scope, globals, InvoiceManager, UserManager) {

        var vm = this;
        vm.config = globals.PAYMENT_ADD.CONFIG;
        vm.invoiceSummary = {};
        vm.billingCompany = {};

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
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentAddController", PaymentAddController);
})();