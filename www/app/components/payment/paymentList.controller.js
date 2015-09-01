(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PaymentListController($scope, globals, payments, CommonService) {

        var _ = CommonService._,
            vm = this;

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

            var paymentsArray,
                unsortedScheduledPayments;

            // TODO - Have PaymentManager.fetchPayments return an array?
            // Convert the payments object into an array
            paymentsArray = _.values(payments);

            // Move the scheduled payments from paymentsArray into unsortedScheduledPayments
            unsortedScheduledPayments = _.remove(paymentsArray, function (payment) {
                return payment.isScheduled();
            });

            // Sort the scheduled payments by scheduled date ascending
            vm.scheduledPayments = _.sortByOrder(unsortedScheduledPayments, ["scheduledDate"], ["asc"]);

            // Sort the rest of the payments by scheduled date descending
            vm.completedPayments = _.sortByOrder(paymentsArray, ["scheduledDate"], ["desc"]);
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentListController", PaymentListController);
})();