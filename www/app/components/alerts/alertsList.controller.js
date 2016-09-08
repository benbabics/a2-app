(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function AlertsListController(_, $scope, $stateParams, $controller, $ionicListDelegate, globals, AnalyticsUtil, AlertsManager, UserManager) {

        var vm = this, infiniteListController;
        vm.config = globals.ALERTS_LIST.CONFIG;
        vm.handleLoadSubsequentData = handleLoadSubsequentData;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            infiniteListController = $controller("WexInfiniteListController", {
                $scope: vm,
                $attrs: {
                    isGreeking: true,
                    cacheKey  : "alerts-inbox"
                }
            });

            infiniteListController.assignServiceDelegate({
                makeRequest: handleMakeRequest,
                removeItem : handleRemoveItem,
                onError    : handleOnError
            });

            vm.alertPrefixMap = globals.ALERTS_LIST.REASON_PREFIX;
            vm.alerts = vm.infiniteScrollService.model;

            // if we're dealing with cached results, check for updates
            if (vm.alerts.collection.length > 0) {
                vm.resetSearchResults({skipGreeking: true});
            }
        }

        function handleMakeRequest(requestConfig) {
            // if ( requestConfig.currentPage > 0 ) handleLoadSubsequentData();

            return AlertsManager.fetchAlerts(
                requestConfig.currentPage, requestConfig.pageSize
            )
                .then(setAlertsRead)
                .then(sortAlertsByDate);
        }

        function handleOnError() {
            //
        }

        function handleLoadSubsequentData() {
            trackEvent("scroll");
        }

        function setAlertsRead(alerts) {
            var alertIds = _.map(alerts, function (alert) {
                return alert.id;
            });
            AlertsManager.setAlertsRead(alertIds);
            return alerts;
        }

        function sortAlertsByDate(alerts) {
            return _.sortBy(alerts, function (alert) {
                return alert.data.authorizationDate;
            }).reverse();
        }

        function handleRemoveItem(alert) {
            return AlertsManager.deleteAlert(alert).then(function () {
                $ionicListDelegate.closeOptionButtons();
            });
        }

        /**
         * Analytics
         **/
        function trackEvent(action) {
            var eventData = vm.config.ANALYTICS.events[action];
            _.spread(AnalyticsUtil.trackEvent)(eventData);
        }

    }

    angular.module("app.components.alerts")
        .controller("AlertsListController", AlertsListController);
})();
