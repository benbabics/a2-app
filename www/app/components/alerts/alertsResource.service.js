(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function AlertsResource($q, globals, NotificationsRestangular) {
        // Private members
        var notificationsResource;

        // Revealed Public members
        var service = {
            getAlerts:   getAlerts,
            deleteAlert: deleteAlert,
            getUnreadAlertsCount: getUnreadAlertsCount,
            setAlertsRead: setAlertsRead,
            registerUserForNotifications : registerUserForNotifications
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            notificationsResource = NotificationsRestangular.service("");
        }

        function getAlerts(params) {
            return $q.when(notificationsResource.one().get(params));
        }

        function deleteAlert(alertId) {
            return $q.when(notificationsResource.one(alertId).remove());
        }

        function getUnreadAlertsCount() {
            return $q.when(notificationsResource.one(globals.NOTIFICATIONS_API.UNREAD).get());
        }

        function setAlertsRead(alertIds) {
            return $q.when(notificationsResource.one(alertIds.join()).put());
        }

        function registerUserForNotifications(channelId) {
            return $q.when(notificationsResource.one().doPOST(null, globals.NOTIFICATIONS_API.REGISTER, {channelId: channelId}));
        }
    }

    angular
        .module("app.components.alerts")
        .factory("AlertsResource", AlertsResource);
})();
