(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function MakePaymentController($scope, globals, InvoiceManager, UserManager) {

        var vm = this;
        vm.config = globals.MAKE_PAYMENT.CONFIG;
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
        .controller("MakePaymentController", MakePaymentController);
})();