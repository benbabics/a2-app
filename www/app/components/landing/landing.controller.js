(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function LandingController($scope, $ionicHistory, currentInvoiceSummary, $cordovaGoogleAnalytics,
                               globals, scheduledPaymentsCount, CommonService, UserManager) {

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

            vm.user = UserManager.getUser();

            // the invoiceSummary object should be bound now to the object returned by fetchCurrentInvoiceSummary
            vm.invoiceSummary = currentInvoiceSummary;

            // the scheduledPaymentsCount object should be bound now to the object returned by fetchScheduledPaymentsCount
            vm.scheduledPaymentsCount = scheduledPaymentsCount;

            vm.chart = getChartConfiguration();

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

        function getChartConfiguration() {

            if (!vm.invoiceSummary.isAnyCreditAvailable()) {
                return {
                    options: globals.LANDING.CHART.options,
                    labels : [vm.config.availableCredit],
                    colors : [globals.LANDING.CHART.colors.availableCreditNegative],
                    data   : [globals.LANDING.CHART.constants.negativeCreditData]
                };
            }

            if (vm.invoiceSummary.isAllCreditAvailable()) {
                return {
                    options: globals.LANDING.CHART.options,
                    labels : [vm.config.availableCredit],
                    colors : [globals.LANDING.CHART.colors.availableCreditPositive],
                    data   : [vm.invoiceSummary.availableCredit]
                };
            }

            return {
                options: globals.LANDING.CHART.options,
                labels : [vm.config.availableCredit, vm.config.billedAmount, vm.config.unbilledAmount],
                colors : [globals.LANDING.CHART.colors.availableCreditPositive, globals.LANDING.CHART.colors.billedAmount, globals.LANDING.CHART.colors.unbilledAmount],
                data   : [vm.invoiceSummary.availableCredit, vm.invoiceSummary.billedAmount, vm.invoiceSummary.unbilledAmount]
            };

        }

    }

    angular.module("app.components.landing")
        .controller("LandingController", LandingController);
})();
