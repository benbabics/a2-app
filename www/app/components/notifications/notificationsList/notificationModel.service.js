(function () {
    "use strict";

    var NotificationModel = function (globals) {

        // Constants
        var CONFIG = globals.NOTIFICATIONS;

        function NotificationModel() {
            this.id = "";
        }

        NotificationModel.prototype.set = function (notificationResource) {
            angular.extend(this, notificationResource);
        };

        return NotificationModel;
    };

    angular
        .module("app.components.notifications")
        .factory("NotificationModel", NotificationModel);
})();
