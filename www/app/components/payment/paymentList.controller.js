(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function PaymentListController($cordovaGoogleAnalytics, $scope, globals, payments, CommonService) {

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

            var unsortedScheduledPayments,
                unsortedCompletedPayments;

            // Get the list of scheduled payments from payments into unsortedScheduledPayments
            unsortedScheduledPayments = _.filter(payments, function (payment) {
                return payment.isScheduled();
            });

            // Get the list of completed payments from payments into unsortedCompletedPayments
            unsortedCompletedPayments = _.filter(payments, function (payment) {
                return !payment.isScheduled();
            });

            // Sort the scheduled payments by scheduled date ascending
            vm.scheduledPayments = _.sortByOrder(unsortedScheduledPayments, ["scheduledDate"], ["asc"]);

            // Sort the rest of the payments by scheduled date descending
            vm.completedPayments = _.sortByOrder(unsortedCompletedPayments, ["scheduledDate"], ["desc"]);

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentListController", PaymentListController);
})();
