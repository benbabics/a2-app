(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentDateInputController($scope, $ionicHistory, globals, moment) {

        var vm = this;
        //public members:
        vm.config = angular.extend({}, globals.PAYMENT_ADD.INPUTS.DATE.CONFIG, globals.BUTTONS.CONFIG);
        vm.date = moment().toDate();
        vm.minDate = moment().subtract(1, "days").toDate();
        vm.maxDate = moment().add(vm.config.maxFutureDays, "days").toDate();

        vm.done = done;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            //TODO set the date to the existing payment date
        }

        function done() {
            //TODO update the payment date

            $ionicHistory.goBack();
        }
    }

    angular.module("app.components.payment")
        .controller("PaymentDateInputController", PaymentDateInputController);
}());