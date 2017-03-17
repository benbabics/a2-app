(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function driverListItem() {
        var directive = {
            restrict:    "E",
            templateUrl: "app/components/driver/templates/driverListItem.directive.html",
            transclude:  true,
            scope: {
                driver: "="
            }
        };

        return directive;
    }

    angular.module( "app.shared.widgets" )
        .directive( "driverListItem", driverListItem );
}());
