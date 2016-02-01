(function () {
    "use strict";

    var PaymentMaintenanceDetailsModel = function ($state, appGlobals, CommonService, Logger) {
        var _ = CommonService._;

        function PaymentMaintenanceDetailsModel() {
            this.state = "";
        }

        PaymentMaintenanceDetailsModel.prototype.set = function (paymentMaintenanceDetailsResource) {
            angular.extend(this, paymentMaintenanceDetailsResource);
        };

        PaymentMaintenanceDetailsModel.prototype.getConfig = function(constants) {
            if (this.state && _.has(constants, "CONFIG")) {
                var state = this.state.toUpperCase();

                if (_.has(constants, state)) {
                    return angular.extend({}, constants.CONFIG, constants[state].CONFIG);
                }
                else {
                    return constants.CONFIG;
                }
            }
            else {
                var error = "Failed to get maintenance config (state: " + this.state + ")";

                Logger.error(error);
                throw new Error(error);
            }
        };

        PaymentMaintenanceDetailsModel.prototype.getStates = function() {
            return appGlobals.PAYMENT_MAINTENANCE.STATES;
        };

        PaymentMaintenanceDetailsModel.prototype.go = function(stateName, params) {
            $state.go(stateName, angular.extend({maintenanceState: this.state}, params || {}));
        };

        return PaymentMaintenanceDetailsModel;
    };

    angular
        .module("app.components.payment")
        .factory("PaymentMaintenanceDetailsModel", PaymentMaintenanceDetailsModel);
})();
