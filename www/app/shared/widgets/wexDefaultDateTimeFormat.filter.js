(function () {
    "use strict";

    /* @ngInject */
    function wexDefaultDateTimeFormat($filter, globals) {

        function filter(date) {
            return $filter("amDateFormat")(date, globals.GENERAL.defaultDateTimeFormat);
        }

        return filter;
    }

    angular
        .module("app.shared.widgets")
        .filter("wexDefaultDateTimeFormat", wexDefaultDateTimeFormat);
})();