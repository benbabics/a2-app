(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function NotificationItemsManager(_, globals, $rootScope, Logger, LoggerUtil, NotificationModel, NotificationsResource) {

        var cachedNotifications;
        var cachedUnreadNotificationsCount;

        // Revealed Public members
        var service = {
            fetchNotifications:            fetchNotifications,
            deleteNotification:            deleteNotification,
            clearCachedValues:             clearCachedValues,
            getNotifications:              getNotifications,
            setNotifications:              setNotifications,
            getUnreadNotificationsCount:   getUnreadNotificationsCount,
            setUnreadNotificationsCount:   setUnreadNotificationsCount,
            setNotificationsRead:          setNotificationsRead,
            fetchUnreadNotificationsCount: fetchUnreadNotificationsCount
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            // Get the initial unread count after login.
            $rootScope.$on("app:login", fetchUnreadNotificationsCount);
            clearCachedValues();
        }

        function clearCachedValues() {
            cachedNotifications = [];
            cachedUnreadNotificationsCount = 0;
        }

        function createNotification(resource) {
            var notificationModel = new NotificationModel();
            notificationModel.set(resource);

            return notificationModel;
        }

        // jshint maxparams:3
        function fetchNotifications(pageNumber, pageSize) {
            var params = {
                status    : globals.NOTIFICATIONS_API.STATUS.READ + "," + globals.NOTIFICATIONS_API.STATUS.UNREAD,
                pageNumber: pageNumber,
                pageSize  : pageSize
            };

            return NotificationsResource.getNotifications(params)
                .then(function (response) {
                    if (response && response.data) {

                        var fetchedNotifications = [];

                        // There will always be an element even if no results are returned,
                        // so check for if there's any JSON data.
                        if (response.data[0].data !== undefined) {
                            // map the notifications data to model objects
                            fetchedNotifications = _.map(response.data, createNotification);
                        }

                        // reset the cache if we're fetching the first page of results
                        if (pageNumber === 0) {
                            cachedNotifications = [];
                        }

                        // only cache the fetched notifications that haven't been cached yet
                        cachedNotifications = _.uniqBy(cachedNotifications.concat(fetchedNotifications), "id");

                        return fetchedNotifications;
                    }

                    // no data in the response
                    else {
                        var error = "No data in Response from getting the Notifications";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })

                // getting notifications failed
                .catch(function (response) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors
                    var error = "Getting Notifications failed: " + LoggerUtil.getErrorMessage(response);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function deleteNotification(notification) {
            return NotificationsResource.deleteNotification(notification.id)
                .then(function () {
                    cachedNotifications = _.without(cachedNotifications, notification);
                })
                .catch(function (response) {
                    var error = "Deleting notification failed: " + LoggerUtil.getErrorMessage(response);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getNotifications() {
            return cachedNotifications;
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setNotifications(notificationItems) {
            cachedNotifications = notificationItems;
        }

        function fetchUnreadNotificationsCount() {
            return NotificationsResource.getUnreadNotificationsCount()
                .then(function (response) {
                    cachedUnreadNotificationsCount = response.data;
                })
                .catch(function (response) {
                    var error = "Fetching unread notifications count failed: " + LoggerUtil.getErrorMessage(response);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getUnreadNotificationsCount() {
            return cachedUnreadNotificationsCount;
        }

        // For testing only.
        function setUnreadNotificationsCount(newCount) {
            cachedUnreadNotificationsCount = newCount;
        }

        function setNotificationsRead(notificationIds) {
            return NotificationsResource.setNotificationsRead(notificationIds)
                .then(function () {
                    service.fetchUnreadNotificationsCount();
                })
                .catch(function (response) {
                    var error = "Setting notifications as read failed: " + LoggerUtil.getErrorMessage(response);
                    Logger.error(error);
                    throw new Error(error);
                });
        }
    }

    angular
        .module("app.components.notifications")
        .factory("NotificationItemsManager", NotificationItemsManager);
})();
