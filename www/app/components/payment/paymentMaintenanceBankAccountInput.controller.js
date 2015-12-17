(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function PaymentMaintenanceBankAccountInputController($cordovaGoogleAnalytics, $ionicHistory, $scope,
                                                          bankAccounts, globals, maintenance, payment, CommonService, Logger) {

        var vm = this,
            paymentMaintenanceBankAccountInput = globals.PAYMENT_MAINTENANCE_FORM.INPUTS.BANK_ACCOUNT;

        //public members:
        vm.config = angular.extend({}, paymentMaintenanceBankAccountInput.CONFIG, globals.BUTTONS.CONFIG, getConfig());

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

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

        function getConfig() {
            if (_.has(paymentMaintenanceBankAccountInput, maintenance.state)) {
                return paymentMaintenanceBankAccountInput[maintenance.state].CONFIG;
            }
            else {
                var error = "Unrecognized payment maintenance state: " + maintenance.state;

                Logger.error(error);
                throw new Error(error);
            }
        }

        function selectBank(selectedBankAccount) {
            payment.bankAccount = selectedBankAccount;

            $ionicHistory.goBack();
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceBankAccountInputController", PaymentMaintenanceBankAccountInputController);
}());
