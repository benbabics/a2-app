(function () {
    "use strict";

    /* @ngInject */
    function wexCardNumber(_, globals) {

        return function (item) {
            var accountNumber = "";

            if (!_.isEmpty(item)) {
                // Add the mask and the last 5 characters of the card number
                accountNumber = globals.GENERAL.cardNumberMask + item.slice(-5);
            }

            return accountNumber;
        };
    }

    angular
        .module("app.shared.widgets")
        .filter("wexCardNumber", wexCardNumber);
})();
