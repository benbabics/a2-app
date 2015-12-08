(function () {
    "use strict";

    /* @ngInject */
    function wexDefaultDateFormat($filter, globals) {

        function filter(date) {
            return $filter("amDateFormat")(date, globals.GENERAL.defaultDateFormat);
        }

        return filter;
    }

    angular
        .module("app.shared.widgets")
        .filter("wexDefaultDateFormat", wexDefaultDateFormat);
})();
