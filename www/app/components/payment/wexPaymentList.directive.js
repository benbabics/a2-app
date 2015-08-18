(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexPaymentList() {
        var directive = {
            restrict: "E",
            templateUrl: "app/components/payment/templates/paymentList.directive.html",
            transclude: true,
            scope: {
                title: "=",
                payments: "=",
                noPaymentsMessage: "="
            }
        };

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexPaymentList", wexPaymentList);
}());