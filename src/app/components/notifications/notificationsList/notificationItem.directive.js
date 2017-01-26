(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function notificationItem() {
        return {
            restrict:    "E",
            replace:     true,
            templateUrl: "app/components/notifications/notificationsList/templates/notificationItem.directive.html"
        };
    }

    angular.module("app.components.notifications")
        .directive("notificationItem", notificationItem);
}());
