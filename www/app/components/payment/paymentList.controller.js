(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function PaymentListController(_, $scope, globals, LoadingIndicator, PaymentManager, UserManager) {

        var vm = this;

        vm.config = globals.PAYMENT_LIST.CONFIG;

        vm.completedPayments = {};
        vm.scheduledPayments = {};

        vm.fetchPayments = fetchPayments;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            fetchPayments();
        }

        function fetchPayments() {
            var billingAccountId = UserManager.getUser().billingCompany.accountId,
                options = globals.PAYMENT_LIST.SEARCH_OPTIONS;

            $scope.$broadcast("scroll.refreshComplete");
            LoadingIndicator.begin();

            return PaymentManager.fetchPayments(billingAccountId, options.PAGE_NUMBER, options.PAGE_SIZE)
                .then(filterPayments)
                .finally(LoadingIndicator.complete);
        }

        function filterPayments(payments) {
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
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentListController", PaymentListController);
})();
