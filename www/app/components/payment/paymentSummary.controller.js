(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentSummaryController($ionicHistory, $scope, globals, payment) {

        var vm = this;

        vm.config = globals.PAYMENT_SUMMARY.CONFIG;

        vm.goBack = goBack;
        vm.payment = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            vm.payment = payment;
        }

        function goBack() {
            $ionicHistory.goBack();
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentSummaryController", PaymentSummaryController);
})();