(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function NotificationsResource($q, globals, NotificationsRestangular) {
        // Private members
        var notificationsResource;

        // Revealed Public members
        var service = {
            getNotifications:   getNotifications,
            deleteNotification: deleteNotification,
            getUnreadNotificationsCount: getUnreadNotificationsCount,
            setNotificationsRead: setNotificationsRead,
            registerUserForNotifications : registerUserForNotifications
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            notificationsResource = NotificationsRestangular.service("");
        }

        function getNotifications(params) {
            return $q.when(notificationsResource.one().get(params));
        }

        function deleteNotification(notificationId) {
            return $q.when(notificationsResource.one(notificationId).remove());
        }

        function getUnreadNotificationsCount() {
            return $q.when(notificationsResource.one(globals.NOTIFICATIONS_API.UNREAD).get());
        }

        function setNotificationsRead(notificationIds) {
            return $q.when(notificationsResource.one(notificationIds.join()).put());
        }

        function registerUserForNotifications(channelId) {
            return $q.when(notificationsResource.one().doPOST(null, globals.NOTIFICATIONS_API.REGISTER, {channelId: channelId}));
        }
    }

    angular
        .module("app.components.notifications")
        .factory("NotificationsResource", NotificationsResource);
})();
