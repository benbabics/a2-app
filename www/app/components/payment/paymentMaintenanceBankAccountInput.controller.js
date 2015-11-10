(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    // jshint maxparams:5
    function PaymentMaintenanceBankAccountInputController($ionicHistory, $scope, bankAccounts, globals, payment) {

        var vm = this,
            paymentMaintenanceBankAccountInput = globals.PAYMENT_MAINTENANCE_FORM.INPUTS.BANK_ACCOUNT;

        //public members:
        vm.config = angular.extend({}, paymentMaintenanceBankAccountInput.CONFIG, globals.BUTTONS.CONFIG);

        vm.selectBank = selectBank;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.bankAccounts = bankAccounts;
        }

        function selectBank(selectedBankAccount) {
            payment.bankAccount = selectedBankAccount;

            $ionicHistory.goBack();
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceBankAccountInputController", PaymentMaintenanceBankAccountInputController);
}());
