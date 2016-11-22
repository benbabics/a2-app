(function () {
    "use strict";

    /* @ngInject */
    function wexDefaultDateFormat($filter, moment, globals) {

        function filter(date, ignoreOffset) {
            if ( !!ignoreOffset ) {
                return moment.parseZone( date ).format( globals.GENERAL.defaultDateFormat );
            }

            return $filter("amDateFormat")(date, globals.GENERAL.defaultDateFormat);
        }

        return filter;
    }

    angular
        .module("app.shared.widgets")
        .filter("wexDefaultDateFormat", wexDefaultDateFormat);
})();
