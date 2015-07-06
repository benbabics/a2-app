(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Used for showing/hiding placeholder text when an input field is selected/deselected.
     This differs from the standard Ionic behavior of only hiding placeholders when text has been typed into a field.
     */

    /* @ngInject */
    function wexPlaceholder(CommonService) {
        var directive = {
                restrict: "A",
                link: link,
                scope: {
                    wexPlaceholder: "@"
                }
            },
            _ = CommonService._;


        return directive;

        function hidePlaceholder(scope, elem) {
            elem[0].placeholder = "";
        }

        function showPlaceholder(scope, elem) {
            elem[0].placeholder = scope.wexPlaceholder;
        }

        function link(scope, elem) {
            //show the placeholder initially
            showPlaceholder(scope, elem);

            elem.on("focus", _.partial(hidePlaceholder, scope, elem));
            elem.on("blur", _.partial(showPlaceholder, scope, elem));
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexPlaceholder", wexPlaceholder);
}());