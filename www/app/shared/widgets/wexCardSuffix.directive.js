(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    function wexCardSuffix() {
        var CARD_SUFFIX_PATTERN = /^[0-9\-]*$/,
            directive = {
                restrict: "A",
                require: "ngModel",
                link: link
            };

        return directive;

        function link (scope, elem, attrs, ctrl) {
            //add the tel input type to the element because angular 1.2 doesn't handle type=number correctly
            if (!attrs.hasOwnProperty("type")) {
                elem.attr("type", "tel");
            }

            function checkForHyphen (value) {
                var result = CARD_SUFFIX_PATTERN.test(value || "");

                //add a hyphen as the 5th character
                if (result && value && value.length === 4) {
                    //don't insert a hypen if the suffix number already contains a hyphen
                    if (value.indexOf("-") < 0) {
                        value = value + "-";
                        elem.val(value);
                    }
                }

                ctrl.$setValidity("wexCardSuffix", result);

                return result ? value : undefined;
            }

            ctrl.$parsers.unshift(checkForHyphen);
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexCardSuffix", wexCardSuffix);
})();
