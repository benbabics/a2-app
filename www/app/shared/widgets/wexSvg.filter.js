(function () {
    "use strict";

    /* @ngInject */
    function wexSvg(_, $filter) {
        var doctypeRegex = /<!DOCTYPE([^>]*\[[^\]]*]|[^>]*)>/g;

        function filter(svgSrc) {
            //TODO - Figure out a cleaner way to not render the DOCTYPE of an SVG
            //Strip the DOCTYPE
            return $filter("wexTrustedHtml")(_.replace(svgSrc, doctypeRegex, ""));
        }

        return filter;
    }

    angular
        .module("app.shared.widgets")
        .filter("wexSvg", wexSvg);
})();
