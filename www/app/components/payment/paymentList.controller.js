(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function PaymentListController(_, $scope, $controller, globals, PaymentManager, UserManager) {
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
                    isGreeking: true,
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

            return PaymentManager.fetchPayments( billingAccountId, requestConfig.currentPage, requestConfig.pageSize )
                .then( filterPayments );
        }

        function handleOnError(errorResponse) {
            // TODO - What do we do here?
            Logger.error( "Failed to fetch next page of payments: " + errorResponse );
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

    angular.module("app.components.payment")
        .controller("PaymentListController", PaymentListController);
})();
