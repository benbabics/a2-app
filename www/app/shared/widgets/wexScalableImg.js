(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    // Creates an image that will automatically scale based on the size of the element
    /* @ngInject */
    function wexScalableImg() {
        var directive = {
            restrict: "E",
            replace: true,
            templateUrl: "app/shared/widgets/scalableImg.directive.html",
            scope: {
                src: "@"
            }
        };

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexScalableImg", wexScalableImg);
}());