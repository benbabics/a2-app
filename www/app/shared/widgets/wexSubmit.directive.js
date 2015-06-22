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

    angular.module("app.shared.widgets")
        .directive("wexSubmit", wexSubmit);
})();
