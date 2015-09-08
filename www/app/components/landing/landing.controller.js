(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LandingController($scope, $ionicHistory, currentInvoiceSummary,
                               globals, scheduledPaymentsCount, UserManager) {

        var vm = this;
        vm.config = globals.LANDING.CONFIG;
        vm.invoiceSummary = {};
        vm.billingCompany = {};
        vm.scheduledPaymentsCount = 0;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            //restart the app history when going back to the landing page
            $ionicHistory.clearHistory();

            vm.billingCompany = UserManager.getUser().billingCompany;

            // the invoiceSummary object should be bound now to the object returned by fetchCurrentInvoiceSummary
            vm.invoiceSummary = currentInvoiceSummary;

            // the scheduledPaymentsCount object should be bound now to the object returned by fetchScheduledPaymentsCount
            vm.scheduledPaymentsCount = scheduledPaymentsCount;

            vm.chart = {
                options: globals.LANDING.CHART.options,
                labels: [vm.config.availableCredit, vm.config.billedAmount, vm.config.unbilledAmount],
                colors: [
                    vm.invoiceSummary.availableCredit > 0 ? globals.LANDING.CHART.colors.availableCreditPositive : globals.LANDING.CHART.colors.availableCreditNegative,
                    globals.LANDING.CHART.colors.billedAmount,
                    globals.LANDING.CHART.colors.unbilledAmount
                ],
                data  : [vm.invoiceSummary.availableCredit, vm.invoiceSummary.billedAmount, vm.invoiceSummary.unbilledAmount]
            };
        }
    }

    angular.module("app.components.landing")
        .controller("LandingController", LandingController);
})();