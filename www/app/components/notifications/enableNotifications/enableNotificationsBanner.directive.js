(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the LinkFn above the directive config

    /* @ngInject */
    function enableNotificationsBanner() {
        return {
            restrict:    "E",
            replace:     true,
            link:        linkFn,
            controller:  "EnableNotificationsController",
            templateUrl: "app/components/notifications/enableNotifications/templates/enableNotificationsBanner.directive.html"
        };

        function linkFn(scope) {
          var flags = scope.notifications.flags;
          scope.isOpen = true;

          // determine to display when notifications are ready
          scope.notifications.onReady.then(function() {
            scope.shouldDisplay = !flags.hasEnabled && !flags.hasRejectedBanner;
          });

          scope.hideBanner = function() {
              scope.isOpen = false;
          };
        }
    }

    angular.module("app.components.notifications")
        .directive("enableNotificationsBanner", enableNotificationsBanner);
}());
