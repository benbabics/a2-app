(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexMaxLength() {
        var directive = {
            restrict: "A",
            require: "ngModel",
            link: link
        };

        return directive;
        //////////////////////

        function link (scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function (inputValue) {

                var maxLength = Number(attrs.wexMaxLength);

                var transformedInput = inputValue;

                if (transformedInput.length > maxLength) {
                    transformedInput = transformedInput.substring(0, maxLength);
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }

                return transformedInput;
            });
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexMaxLength", wexMaxLength);
})();