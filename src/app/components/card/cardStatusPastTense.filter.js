(function () {
    "use strict";

    /* @ngInject */
    function CardStatusPastTense(globals) {
        const CARD_STATUS = globals.CARD.STATUS;

        function changeTense(status) {
            switch( status.toLowerCase() ) {
                case CARD_STATUS.ACTIVE: return "ACTIVATED";

                case CARD_STATUS.SUSPENDED:
                case CARD_STATUS.TERMINATED: return status;

                default: return "";
            }
        }

        return status => changeTense( status );
    }

    angular
        .module( "app.components.card" )
        .filter( "cardStatusPastTense", CardStatusPastTense );
})();
