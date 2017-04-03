(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function cardListItem() {
        var directive = {
            restrict:    "E",
            templateUrl: "app/components/card/templates/cardListItem.directive.html",
            transclude:  true,
            scope: {
                card: "="
            }
        };

        return directive;
    }

    angular.module( "app.shared.widgets" )
        .directive( "cardListItem", cardListItem );
}());
