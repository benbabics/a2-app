(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function wexPaymentListItem() {
        var directive = {
            restrict: "E",
            templateUrl: "app/components/payment/templates/paymentListItem.directive.html",
            transclude: true,
            scope: {
                payment: "="
            }
        };

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexPaymentListItem", wexPaymentListItem);
}());
