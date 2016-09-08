(function () {
    "use strict";

    /* @ngInject */
    function wexTruncateString() {

        return function (val, limit, char) {
            val   = val   || "";
            limit = limit || 3;
            char  = char  || "*";

            if ( val.length > limit ) {
                return val.slice( 0, -limit ) + char.repeat( limit );
            }

            return char.repeat( val.length );
        };
    }

    angular
        .module("app.shared.widgets")
        .filter("wexTruncateString", wexTruncateString);
})();
