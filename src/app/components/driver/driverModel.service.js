(function () {
    "use strict";

    var DriverModel = function (_, moment, globals) {

        // Constants
        const DRIVER_STATUS = globals.CARD.STATUS;

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
