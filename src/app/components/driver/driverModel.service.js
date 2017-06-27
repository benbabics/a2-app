(function () {
    "use strict";

    var DriverModel = function (_, moment, globals) {

        // Constants
        const DRIVER_STATUS = globals.CARD.STATUS,
              DRIVER_STATUS_DISPLAY_MAPPINGS = globals.DRIVER.DISPLAY_MAPPINGS.STATUS;

        function DriverModel() {
            angular.extend(this, _.zipObject([
                "driverId",
                "promptId",
                "firstName",
                "middleName",
                "lastName",
                "status",
                "statusDate",
                "sourceSystem"
            ]));
        }

        DriverModel.prototype.set = function (driverResource) {
            angular.extend(this, driverResource);

            if (!_.isNil(driverResource.statusDate)) {
                this.statusDate = moment(driverResource.statusDate).toDate();
            }
        };

        DriverModel.prototype.getStatusDisplayName = function () {
            var status = this.status ? this.status.toUpperCase() : null;

            if (status && _.has(DRIVER_STATUS_DISPLAY_MAPPINGS, status)) {
                return DRIVER_STATUS_DISPLAY_MAPPINGS[status];
            }
            else {
                return DRIVER_STATUS_DISPLAY_MAPPINGS.UNKNOWN;
            }
        };

        DriverModel.prototype.isActive = function () {
            return this.status && this.status.toLowerCase() === DRIVER_STATUS.ACTIVE;
        };

        DriverModel.prototype.isTerminated = function () {
            return this.status && this.status.toLowerCase() === DRIVER_STATUS.TERMINATED;
        };

        return DriverModel;
    };

    angular
        .module("app.components.driver")
        .factory("DriverModel", DriverModel);
})();
