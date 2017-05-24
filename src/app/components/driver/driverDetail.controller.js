(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function DriverDetailController(_, $rootScope, $scope, $ionicHistory, $state, $q, $ionicActionSheet, driver, UserManager, DriverManager, globals) {
        var vm = this;

        vm.config = globals.DRIVER_DETAILS.CONFIG;
        vm.driver = driver;

        vm.isChangeStatusLoading            = false;
        vm.displayStatusChangeBannerSuccess = false;
        vm.displayStatusChangeBannerFailure = false;

        vm.goToTransactionActivity = goToTransactionActivity;
        vm.handleClickChangeStatus = handleClickChangeStatus;
        vm.updateDriverStatus      = updateDriverStatus;

        function goToTransactionActivity() {
            //Clear the cache to work around issue where transaction page shows up before transition
            return $ionicHistory.clearCache([ "transaction" ])
                .then(() => {
                    $state.go("transaction.filterBy", {
                        filterBy:    "driver",
                        filterValue: vm.driver.promptId
                    });

                    trackEvent( "navigateTransactions" );
                });
        }

        function handleClickChangeStatus() {
            let actions = vm.config.statuses;
            displayChangeStatusActions( actions ).then(label => {
                let action = _.find( actions, { label } );
                vm.updateDriverStatus( action.id );
                trackEvent( action.trackingId );
            });

            trackView( "statusOptionsOpen" );
        }

        function updateDriverStatus(newStatus) {
            if ( !newStatus || newStatus === vm.driver.status ) { return; }

            // make request to update driver status; if failure, revert
            vm.isChangeStatusLoading = true;

            let accountId = UserManager.getUser().billingCompany.accountId;
            DriverManager.updateStatus( accountId, vm.driver.driverId, newStatus, vm.driver.promptId )
                .then(() => {
                    vm.isChangeStatusLoading            = false;
                    vm.displayStatusChangeBannerSuccess = true;
                    $rootScope.$broadcast( "driver:statusChange" );
                    trackView( "statusOptionsSuccess" );
                });
        }

        /**
         * Private Methods
         */
        function displayChangeStatusActions(actions) {
            if ( !actions && _.isEmpty(actions) ) { return; }

            let deferred = $q.defer();

            $ionicActionSheet.show({
                buttons:    _.map( actions, action => { return { text: action.label } } ),
                titleText:  vm.config.actionStatusTitle,
                cancelText: vm.config.actionStatusCancel,
                cancel() { deferred.reject(); },
                buttonClicked(i, action) {
                    deferred.resolve( action.text );
                    return true;
                }
            });

            return deferred.promise;
        }

        /**
         * Analytics
         **/
        function trackEvent(action) {
            var eventData = vm.config.ANALYTICS.events[ action ];
            _.spread( AnalyticsUtil.trackEvent )( eventData );
        }

        function trackView(viewId) {
            var viewName = vm.config.ANALYTICS.views[ viewId ];
            AnalyticsUtil.trackView( viewName );
        }
    }

    angular.module( "app.components.driver" )
        .controller( "DriverDetailController", DriverDetailController );
})();
