(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function PaymentMaintenanceUtil(_, $state, globals, AnalyticsUtil, Logger, Navigation, Popup) {
        // Revealed Public members
        var service = {
            getConfig       : getConfig,
            getActiveState  : getActiveState,
            getStates       : getStates,
            go              : go,
            isAddState      : isAddState,
            isUpdateState   : isUpdateState,
            showPaymentError: showPaymentError
        };

        return service;
        //////////////////////

        function showPaymentError(errorMessage, analyticsEvent) {
            if (analyticsEvent) {
                _.spread(AnalyticsUtil.trackEvent)(analyticsEvent);
            }

            return Navigation.goToPaymentActivity()
                .finally(function () {
                    return Popup.displayAlert({
                        content       : errorMessage,
                        buttonCssClass: "button-primary"
                    });
                });
        }

        function getConfig(constants, maintenanceState) {
            maintenanceState = (maintenanceState || getActiveState()).toUpperCase();

            if (_.has(constants, "CONFIG")) {
                if (_.has(constants, maintenanceState)) {
                    return angular.extend({}, constants.CONFIG, constants[maintenanceState].CONFIG);
                }
                else {
                    return constants.CONFIG;
                }
            }
            else {
                var error = "Failed to get maintenance config (state: " + maintenanceState + ")";

                Logger.error(error);
                throw new Error(error);
            }
        }

        function getActiveState() {
            if (_.hasIn($state.current, "data.maintenanceState")) {
                return $state.current.data.maintenanceState;
            }

            var error = "Failed to get maintenance state from the current view state.";
            Logger.error(error);
            throw new Error(error);
        }

        function getStates() {
            return globals.PAYMENT_MAINTENANCE.STATES;
        }

        function go(viewStateName, params, maintenanceState) {
            maintenanceState = maintenanceState || getActiveState();

            $state.go(viewStateName, angular.extend({maintenanceState: maintenanceState}, params || {}));
        }

        function isAddState(maintenanceState) {
            return (maintenanceState || getActiveState()) === getStates().ADD;
        }

        function isUpdateState(maintenanceState) {
            return (maintenanceState || getActiveState()) === getStates().UPDATE;
        }
    }

    angular
        .module("app.components.payment")
        .factory("PaymentMaintenanceUtil", PaymentMaintenanceUtil);
})();
