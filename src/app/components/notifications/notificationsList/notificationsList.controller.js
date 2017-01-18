(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function NotificationsListController(_, $scope, $stateParams, $controller, $ionicListDelegate, globals, AnalyticsUtil, NotificationItemsManager, UserManager) {

        var vm = this, infiniteListController;
        vm.config = globals.NOTIFICATIONS_LIST.CONFIG;
        vm.handleLoadSubsequentData = handleLoadSubsequentData;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            infiniteListController = $controller("WexInfiniteListController", {
                $scope: $scope,
                $attrs: {
                    isGreeking: true,
                    cacheKey  : "notifications-inbox"
                }
            });

            infiniteListController.assignServiceDelegate({
                makeRequest: handleMakeRequest,
                removeItem : handleRemoveItem,
                onError    : handleOnError
            });

            vm.notificationPrefixMap = globals.NOTIFICATIONS_LIST.REASON_PREFIX;
            vm.notifications = $scope.infiniteScrollService.model;

            // if we're dealing with cached results, check for updates
            if (vm.notifications.collection.length > 0) {
                $scope.resetSearchResults({ skipGreeking: true });
            }
        }

        function handleMakeRequest(requestConfig) {
            // if ( requestConfig.currentPage > 0 ) handleLoadSubsequentData();

            return NotificationItemsManager.fetchNotifications(
                requestConfig.currentPage, requestConfig.pageSize
            )
                .then(setNotificationsRead)
                .then(sortNotificationsByDate);
        }

        function handleOnError() {
            //
        }

        function handleLoadSubsequentData() {
            trackEvent("scroll");
        }

        function setNotificationsRead(notifications) {
            var notificationIds = _.map(notifications, function (notification) {
                return notification.id;
            });
            if (notifications.length > 0) {
                NotificationItemsManager.setNotificationsRead(notificationIds);
            }
            return notifications;
        }

        function sortNotificationsByDate(notifications) {
            return _.sortBy(notifications, function (notification) {
                return notification.data.authorizationDate;
            }).reverse();
        }

        function handleRemoveItem(notification) {
            return NotificationItemsManager.deleteNotification(notification)
                .then(() => $ionicListDelegate.closeOptionButtons());
        }

        /**
         * Analytics
         **/
        function trackEvent(action) {
            var eventData = vm.config.ANALYTICS.events[action];
            _.spread(AnalyticsUtil.trackEvent)(eventData);
        }

    }

    angular.module("app.components.notifications")
        .controller("NotificationsListController", NotificationsListController);
})();
