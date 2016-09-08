(function () {
    "use strict";

    /* @ngInject */
    function wexTruncateString() {

        function repeat(char, n) {
            var i, chars = "";

            if ( char.repeat ) {
                return char.repeat( n );
            }

            for(i=0; i < n; i++) { chars += char; }
            return chars;
        }

        return function (val, limit, char) {
            val   = val   || "";
            limit = limit || 3;
            char  = char  || "*";

            if ( val.length > limit ) {
                return val.slice( 0, -limit ) + repeat( char, limit );
            }

            return repeat( char, val.length );
        };
    }

    angular
        .module("app.shared.widgets")
        .filter("wexTruncateString", wexTruncateString);
})();
