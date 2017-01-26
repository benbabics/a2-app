(function () {
    "use strict";

    /* @ngInject */
    function wexTrustedHtml($sce) {

        function filter(html) {
            return $sce.trustAsHtml(html);
        }

        return filter;
    }

    angular
        .module("app.shared.widgets")
        .filter("wexTrustedHtml", wexTrustedHtml);
})();
