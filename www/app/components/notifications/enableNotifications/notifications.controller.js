(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function EnableNotificationsController($window, $scope, globals, AnalyticsUtil, NotificationsManager) {

        //////////////////////
        // Controller initialization
        $scope.config = globals.NOTIFICATIONS.CONFIG;
        $scope.notifications           = NotificationsManager;
        $window.__notificationsManager = NotificationsManager; // expose in browser

        $scope.rejectBanner        = handleRejectBanner;
        $scope.rejectPrompt        = handleRejectPrompt;
        $scope.enableNotifications = handleEnableNotifications;

        /**
         * Handlers
        **/
        function handleRejectBanner() {
            NotificationsManager.rejectBanner();
            trackEvent( "rejectedBanner" );
        }
        function handleRejectPrompt() {
            NotificationsManager.rejectPrompt();
            trackEvent( "rejectedPrompt" );
        }
        function handleEnableNotifications() {
            NotificationsManager.enableNotifications();
            trackEvent( "hasEnabled" );
        }

        /**
          * Analytics
        **/
        function trackEvent(action) {
            var eventData = $scope.config.ANALYTICS.events[ action ];
            _.spread( AnalyticsUtil.trackEvent )( eventData );
        }
    }

    angular.module("app.components.notifications")
        .controller("EnableNotificationsController", EnableNotificationsController);
})();
