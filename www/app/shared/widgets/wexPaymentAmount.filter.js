(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Filter above the scroll

    /* Filter that takes a currency amount and divides it by 100 to allow for entering cents. */

    /* @ngInject */
    function wexPaymentAmount() {

        function filter(amount) {
            return amount / 100;
        }

        return filter;
    }

    angular
        .module("app.shared.widgets")
        .filter("wexPaymentAmount", wexPaymentAmount);
}());