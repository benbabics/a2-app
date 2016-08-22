(function () {
    "use strict";

    function wexMenuItem() {
        var directive = {

            restrict: "E",
            replace: true,
            transclude: true,
            scope: true,
            require: "^wexMenu",
            link: link,
            templateUrl: "app/components/menu/templates/menuItem.html",
        };

        return directive;

        function link(scope, elem, attrs, ctrl) {

            scope.icon = attrs.icon;
            scope.rootState = attrs.rootState;
            scope.noChevron = attrs.hasOwnProperty("noChevron");
            scope.menu = ctrl;
        }
    }

    angular.module("app.components.menu")
        .directive("wexMenuItem", wexMenuItem);
})();