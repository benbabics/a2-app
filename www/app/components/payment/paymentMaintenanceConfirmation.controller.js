(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function PaymentMaintenanceConfirmationController($cordovaGoogleAnalytics, $scope,
                                                      globals, maintenance, payment, CommonService, Logger) {

        var _ = CommonService._,
            vm = this,
            paymentMaintenanceConfirmation = globals.PAYMENT_MAINTENANCE_CONFIRMATION;

        vm.config = angular.extend({}, paymentMaintenanceConfirmation.CONFIG, getConfig());

        vm.payment = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.payment = payment;

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

        function getConfig() {
            if (_.has(paymentMaintenanceConfirmation, maintenance.state)) {
                return paymentMaintenanceConfirmation[maintenance.state].CONFIG;
            }
            else {
                var error = "Unrecognized payment maintenance state: " + maintenance.state;

                Logger.error(error);
                throw new Error(error);
            }
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentMaintenanceConfirmationController", PaymentMaintenanceConfirmationController);
})();
