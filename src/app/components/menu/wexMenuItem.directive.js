(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    function wexMenuItem() {
        var directive = {

            restrict: "E",
            replace: true,
            transclude: true,
            scope: true,
            require: "^wexMenu",
            link: link,
            templateUrl: "app/components/menu/templates/menuItem.html"
        };

        return directive;

        function link(scope, elem, attrs, ctrl) {

            scope.icon = attrs.icon;
            scope.rootState = attrs.rootState;
            attrs.$observe("noChevron", function(value) {
                scope.noChevron = (value.toUpperCase() === "TRUE");
            });
            scope.menu = ctrl;
        }
    }

    angular.module("app.components.menu")
        .directive("wexMenuItem", wexMenuItem);
})();
