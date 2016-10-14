(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:12

    /* @ngInject */
    function LandingController($scope, $interval, $ionicHistory, $ionicPlatform,
                               currentInvoiceSummary, brandLogo, globals, scheduledPaymentsCount,
                               FlowUtil, Navigation, Toast, UserManager) {

        var BACK_TO_EXIT_ACTION_PRIORITY = 102,
            removeBackButtonAction,
            exitTimerPromise,
            vm = this;

        vm.config = globals.LANDING.CONFIG;
        vm.chartColors = globals.LANDING.CHART.colors;
        vm.invoiceSummary = {};
        vm.billingCompany = {};
        vm.branding = {};
        vm.greeting = "";
        vm.goToCards = goToCards;
        vm.goToMakePayment = goToMakePayment;
        vm.goToTransactionActivity = goToTransactionActivity;
        vm.scheduledPaymentsCount = 0;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            startToastMessageBackAction();

            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
            $scope.$on("$destroy", function () {
                //clear the back button actions
                setBackButtonAction(null);
            });
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

            vm.branding.logo = brandLogo;

            vm.greeting = "Hello, " + vm.user.firstName;
        }

        function getChartConfiguration() {

            if (!vm.invoiceSummary.isAnyCreditAvailable()) {
                return {
                    options: globals.LANDING.CHART.options,
                    labels : [vm.config.availableCredit],
                    colors : [vm.chartColors.availableCreditNegative],
                    data   : [globals.LANDING.CHART.constants.negativeCreditData]
                };
            }

            if (vm.invoiceSummary.isAllCreditAvailable()) {
                return {
                    options: globals.LANDING.CHART.options,
                    labels : [vm.config.availableCredit],
                    colors : [vm.chartColors.availableCreditPositive],
                    data   : [vm.invoiceSummary.availableCredit]
                };
            }

            return {
                options: globals.LANDING.CHART.options,
                labels : [vm.config.availableCredit, vm.config.billedAmount, vm.config.unbilledAmount],
                colors : [vm.chartColors.availableCreditPositive, vm.chartColors.billedAmount, vm.chartColors.unbilledAmount],
                data   : [vm.invoiceSummary.availableCredit, vm.invoiceSummary.billedAmount, vm.invoiceSummary.unbilledAmount]
            };

        }

        function goToCards() {
            return Navigation.goToCards();
        }

        function goToMakePayment() {
            return Navigation.goToMakePayment();
        }

        function goToTransactionActivity() {
            return Navigation.goToTransactionActivity();
        }

        function setBackButtonAction(callback) {
            if (removeBackButtonAction) {
                removeBackButtonAction();
                removeBackButtonAction = null;
            }

            if (exitTimerPromise) {
                $interval.cancel(exitTimerPromise);
                exitTimerPromise = null;
            }

            if (callback) {
                removeBackButtonAction = $ionicPlatform.registerBackButtonAction(callback, BACK_TO_EXIT_ACTION_PRIORITY);
            }
        }

        function startExitBackAction() {
            setBackButtonAction(function () { //args: event
                FlowUtil.exitApp();
            });

            exitTimerPromise = $interval(startToastMessageBackAction, globals.LANDING.BACK_TO_EXIT.duration, 1);
        }

        function startToastMessageBackAction() {
            setBackButtonAction(function () { //args: event
                Toast.show(
                    globals.LANDING.BACK_TO_EXIT.message,
                    globals.LANDING.BACK_TO_EXIT.duration,
                    globals.LANDING.BACK_TO_EXIT.position
                );

                startExitBackAction();
            });
        }

    }

    angular.module("app.components.landing")
        .controller("LandingController", LandingController);
})();
