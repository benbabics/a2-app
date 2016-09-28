(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexUiGreeking() {
        var directive = {
            restrict:   "E",
            replace:    true,
            transclude: true,
            scope: {
                itemHeight: "@"
            },
            templateUrl: "app/shared/widgets/templates/wexUiGreeking.directive.html",
            link: linkFn
        };

        return directive;

        function linkFn(scope) {
            scope.itemHeight = scope.itemHeight || "15px";
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexUiGreeking", wexUiGreeking);
}());
