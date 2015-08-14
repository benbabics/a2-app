(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentListController($scope, globals) {

        var vm = this;

        vm.config = globals.PAYMENT_LIST.CONFIG;

        vm.completedPayments = {};
        vm.scheduledPayments = {};

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            //TODO - something
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentListController", PaymentListController);
})();