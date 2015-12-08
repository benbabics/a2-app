(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexFieldError() {
        var directive = {
            restrict: "A",
            transclude: true,
            templateUrl: "app/shared/widgets/templates/fieldError.directive.html"
        };

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexFieldError", wexFieldError);
}());
