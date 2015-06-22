(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexFieldError() {
        var directive = {
            restrict: "A",
            transclude: true,
            templateUrl: "app/shared/widgets/fieldError.directive.html"
        };

        return directive;
    }

    angular.module("app.widgets")
        .directive("wexFieldError", wexFieldError);
}());