(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function AlertsListController(_, $scope, $stateParams, $controller, $ionicListDelegate, globals, AnalyticsUtil, AlertsManager, UserManager) {

        var vm = this, infiniteListController;
        vm.config  = globals.ALERTS_LIST.CONFIG;
        vm.handleLoadSubsequentData = handleLoadSubsequentData;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
          infiniteListController = $controller('WexInfiniteListController', {
              $scope: vm,
              $attrs: {
                isGreeking: true,
                cacheKey:   'alerts-inbox'
              }
          });

          infiniteListController.assignServiceDelegate({
              makeRequest: handleMakeRequest,
              removeItem:  handleRemoveItem,
              onError:     handleOnError
          });

          vm.alerts = vm.infiniteScrollService.model;

          // if we're dealing with cached results, check for updates
          if ( vm.alerts.collection.length > 0 ) {
              vm.resetSearchResults({ skipGreeking: true });
          }
        }

        function handleMakeRequest(requestConfig) {
            var billingAccountId = UserManager.getUser().billingCompany.accountId;

            // if ( requestConfig.currentPage > 0 ) handleLoadSubsequentData();

            return AlertsManager.fetchAlerts(
                billingAccountId, requestConfig.currentPage, requestConfig.pageSize
            )
            .then( sortAlertsByDate );
        }

        function handleOnError() {
            //
        }

        function handleLoadSubsequentData() {
            trackEvent( 'scroll' );
        }

        function sortAlertsByDate(alerts) {
            return _.sortBy(alerts, function(obj) {
                return obj.postDate;
            }).reverse();
        }

        function handleRemoveItem(alert) {
            return AlertsManager.deleteAlert( alert ).then(function() {
                $ionicListDelegate.closeOptionButtons();
            });
        }

        /**
          * Analytics
        **/
        function trackEvent(action) {
            var eventData = vm.config.ANALYTICS.events[ action ];
            _.spread( AnalyticsUtil.trackEvent )( eventData );
        }

    }

    angular.module("app.components.alerts")
        .controller("AlertsListController", AlertsListController);
})();
