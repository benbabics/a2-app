(function () {
    "use strict";

    /* @ngInject */
    function wexPhoneFormatting() {

        function formatPhoneNumber(s) {
            s = ( ""+s ).replace( /\D/g, "" ).substring( 0,10 );
            let m = s.match( /^(\d{3})(\d{3})(\d{4})$/ );
            return (!m) ? null : `${m[1]}-${m[2]}-${m[3]}`;
        }

        return val => formatPhoneNumber( val );
    }

    angular
        .module( "app.shared.widgets" )
        .filter( "wexPhoneFormatting", wexPhoneFormatting );
})();
