(function () {
    "use strict";

    // This directive assumes the existence of a MenuController vm
    function wexMenuItem() {
        var directive = {

            restrict: "E",
            replace: true,
            transclude: true,
            scope: true,
            link: link,
            templateUrl: "app/components/menu/templates/menuItem.html",
        };

        return directive;

        function link(scope, elem, attrs) {

            scope.icon = attrs.icon;
            scope.rootState = attrs.rootState;
            scope.noChevron = attrs.noChevron;
        }
    }

    angular.module("app.components.menu")
        .directive("wexMenuItem", wexMenuItem);
})();