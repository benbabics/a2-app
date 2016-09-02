(function () {
    "use strict";

    var AlertModel = function (globals) {

        // Constants
        var CONFIG = globals.ALERT;

        function AlertModel() {
            this.alertId = "";
        }

        AlertModel.prototype.set = function (alertResource) {
            angular.extend(this, alertResource);
        };

        return AlertModel;
    };

    angular
        .module("app.components.alerts")
        .factory("AlertModel", AlertModel);
})();
