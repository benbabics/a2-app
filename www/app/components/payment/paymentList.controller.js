(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function PaymentListController(_, $scope, $controller, globals, PaymentManager, UserManager, LoadingIndicator) {
        var vm = this, infiniteListController;
            vm.config  = globals.PAYMENT_LIST.CONFIG;
            vm.options = globals.PAYMENT_LIST.SEARCH_OPTIONS;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            infiniteListController = $controller("WexInfiniteListController", {
                $scope: $scope,
                $attrs: {
                    isGreeking: false,
                    cacheKey  : "payments-list"
                }
            });

            infiniteListController.assignServiceDelegate({
                makeRequest: handleMakeRequest,
                onError:     handleOnError
            });

            vm.payments = _.extend($scope.infiniteScrollService.model, {
                completed: [],
                scheduled: []
            });
        }

        function handleMakeRequest(requestConfig) {
            var billingAccountId = UserManager.getUser().billingCompany.accountId;

            LoadingIndicator.begin();

            return PaymentManager.fetchPayments( billingAccountId, requestConfig.currentPage, requestConfig.pageSize )
              .then( filterPayments )
              .finally( LoadingIndicator.complete );
        }

        function handleOnError() {
            //
        }

        function filterPayments(payments) {
            var unsortedScheduledPayments,
                unsortedCompletedPayments;

            // Get the list of scheduled payments from payments into unsortedScheduledPayments
            unsortedScheduledPayments = _.filter(payments, function(payment) {
                return payment.isScheduled();
            });

            // Get the list of completed payments from payments into unsortedCompletedPayments
            unsortedCompletedPayments = _.filter(payments, function(payment) {
                return !payment.isScheduled();
            });

            // Sort the scheduled payments by scheduled date ascending
            vm.payments.scheduled = _.orderBy( unsortedScheduledPayments, ["scheduledDate"], ["asc"] );

            // Sort the rest of the payments by scheduled date descending
            vm.payments.completed = _.orderBy( unsortedCompletedPayments, ["scheduledDate"], ["desc"] );

            return payments;
        }
    }

    function PaymentListControllerOld(_, $scope, globals, LoadingIndicator, PaymentManager, UserManager) {

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

            //note: due to an issue with collection-repeat and ion-refresher, we hide the refresher before refreshing the list to match how the infinite list pages work
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
            vm.scheduledPayments = _.orderBy(unsortedScheduledPayments, ["scheduledDate"], ["asc"]);

            // Sort the rest of the payments by scheduled date descending
            vm.completedPayments = _.orderBy(unsortedCompletedPayments, ["scheduledDate"], ["desc"]);
        }

    }

    angular.module("app.components.payment")
        .controller("PaymentListController", PaymentListController);
})();
