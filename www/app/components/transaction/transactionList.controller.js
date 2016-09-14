(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function TransactionListController(_, $stateParams, $localStorage, $ionicScrollDelegate, globals, AnalyticsUtil) {

        var vm = this;

        vm.backStateOverride = null;
        vm.config = globals.TRANSACTION_LIST.CONFIG;

        vm.filterViews = $localStorage.$default({transactionsFilterValue: "date"});

        vm.handleFilterSelection = handleFilterSelection;
        vm.handleLoadSubsequentData = handleLoadSubsequentData;

        activate();

        // report initial filter selected value to analytics
        trackEvent(vm.filterViews.transactionsFilterValue);

        //////////////////////
        // Controller initialization
        function activate() {
            if (_.has($stateParams, "cardId") && !_.isEmpty($stateParams.cardId) && _.isString($stateParams.cardId)) {
                vm.cardIdFilter = $stateParams.cardId;
            }
            else {
                vm.backStateOverride = "landing";
            }
        }

        function handleFilterSelection($event) {
            var selectedValue = $event.target.value;
            $ionicScrollDelegate.scrollTop();
            trackEvent(selectedValue);
        }

        function handleLoadSubsequentData() {
            trackEvent("scroll");
        }

        /**
         * Analytics
         **/
        function trackEvent(action) {
            var eventData = vm.config.ANALYTICS.events[action];
            _.spread(AnalyticsUtil.trackEvent)(eventData);
        }

    }

    angular.module("app.components.transaction")
        .controller("TransactionListController", TransactionListController);
})();
