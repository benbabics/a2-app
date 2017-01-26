(function () {
    "use strict";

    var DriverModel = function (_, moment) {

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

        return DriverModel;
    };

    angular
        .module("app.components.driver")
        .factory("DriverModel", DriverModel);
})();
