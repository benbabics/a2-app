(function () {
    "use strict";

    function wexInteger() {
        var INTEGER_REGEXP = /^[0-9]*$/,
            directive = {
                restrict: "A",
                require: "ngModel",
                link: link
            };


        return directive;

        function link (scope, elem, attrs, ctrl) {

            //add the tel input type to the element because angular 1.2 doesn't handle type=number correctly
            if(!attrs.hasOwnProperty("type")) {
                elem.attr("type", "tel");
            }

            function checkForInteger (value) {
                var result = INTEGER_REGEXP.test(value || "");

                ctrl.$setValidity("wexInteger", result);

                return result ? value : undefined;
            }

            ctrl.$parsers.unshift(checkForInteger);
            ctrl.$formatters.unshift(checkForInteger);
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexInteger", wexInteger);
})();