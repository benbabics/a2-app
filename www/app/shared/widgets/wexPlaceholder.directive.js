(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

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