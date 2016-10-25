(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:12

    /* @ngInject */
    function LandingController(_, $scope, $interval, $ionicHistory, $ionicPlatform,
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

            vm.chartDisplay = getChartDisplayConfiguration();
            vm.chart        = getChartConfiguration();

            vm.branding.logo = brandLogo;

            vm.greeting = "Hello, " + vm.user.firstName;
        }

        function getChartDisplayConfiguration() {
            var datasets = { collection: [] },
                dataIds  = [ "pendingAmount", "availableCredit", "billedAmount", "unbilledAmount" ];

            _.each(dataIds, function(id) {
                if ( vm.invoiceSummary[ id ] > 0 ) {
                    datasets.collection.push({
                        id:    id,
                        label: vm.config[ id ],
                        color: vm.chartColors[ id ],
                        data:  vm.invoiceSummary[ id ]
                    });
                }
            });

            datasets.right = angular.copy( datasets.collection );
            datasets.left  = datasets.right.splice(0, Math.ceil( datasets.right.length / 2 ));

            return datasets;
        }

        function getChartConfiguration() {
            var availableCreditData = _.find( vm.chartDisplay.collection, { id: "availableCredit" });

            if ( !vm.invoiceSummary.isAnyCreditAvailable() ) {
                return {
                    options: globals.LANDING.CHART.options,
                    labels : [ availableCreditData.label ],
                    colors : [ vm.chartColors.availableCreditNegative ],
                    data   : [ globals.LANDING.CHART.constants.negativeCreditData ]
                };
            }

            if ( vm.invoiceSummary.isAllCreditAvailable() ) {
                return {
                    options: globals.LANDING.CHART.options,
                    labels : [ availableCreditData.label ],
                    colors : [ availableCreditData.color ],
                    data   : [ availableCreditData.data ]
                };
            }

            return {
                options: globals.LANDING.CHART.options,
                labels:  _.map( vm.chartDisplay.collection, "label" ),
                colors:  _.map( vm.chartDisplay.collection, "color" ),
                data:    _.map( vm.chartDisplay.collection, "data" )
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
