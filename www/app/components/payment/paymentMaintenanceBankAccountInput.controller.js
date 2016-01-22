(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function PaymentMaintenanceBankAccountInputController($ionicHistory, $scope,
                                                          bankAccounts, globals, maintenanceDetails, payment) {

        var vm = this,
            paymentMaintenanceBankAccountInput = globals.PAYMENT_MAINTENANCE_FORM.INPUTS.BANK_ACCOUNT;

        //public members:
        vm.config = angular.extend({}, globals.BUTTONS.CONFIG, maintenanceDetails.getConfig(paymentMaintenanceBankAccountInput));

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
