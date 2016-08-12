(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function alertItem() {
        return {
            restrict:    "E",
            replace:     true,
            templateUrl: "app/components/alerts/templates/alertItem.directive.html"
        };
    }

    angular.module("app.components.alerts")
        .directive("alertItem", alertItem);
}());
