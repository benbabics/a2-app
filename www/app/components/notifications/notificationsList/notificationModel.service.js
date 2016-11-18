(function () {
    "use strict";

    var NotificationModel = function (globals) {

        // Constants
        var CONFIG = globals.NOTIFICATIONS;

        function NotificationModel() {
            this.id = "";
            this.data = {};
            this.status = "";
            this.type = "";
        }

        NotificationModel.prototype.set = function (notificationResource) {
            this.id = notificationResource.id;
            this.data = JSON.parse(notificationResource.data);
            this.status = notificationResource.status;
            this.type = notificationResource.type;
        };

        return NotificationModel;
    };

    angular
        .module("app.components.notifications")
        .factory("NotificationModel", NotificationModel);
})();
