(function () {
    "use strict";


    function wexSubmit() {
        var directive = {
            restrict: "E",
            templateUrl: "app/shared/widgets/submit.directive.html",
            transclude: true
        };

        return directive;
    }

    angular.module("app.widgets")
        .directive("wexSubmit", wexSubmit);
})();
