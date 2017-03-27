(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function DriverDetailController(_, $scope, $ionicHistory, $state, $stateParams, $q, $ionicActionSheet, $timeout, globals) {
        var vm = this;

        vm.config = globals.DRIVER_DETAILS.CONFIG;
        vm.driver = $stateParams.driver;

        vm.isChangeStatusLoading            = false;
        vm.displayStatusChangeBannerSuccess = false;
        vm.displayStatusChangeBannerFailure = false;

        vm.goToTransactionActivity = goToTransactionActivity;
        vm.handleClickChangeStatus = handleClickChangeStatus;
        vm.updateDriverStatus      = updateDriverStatus;

        function goToTransactionActivity() {
            return; //Todo- remove; temporary for current story

            //Clear the cache to work around issue where transaction page shows up before transition
            return $ionicHistory.clearCache(["transaction"])
                .then(function () {
                    $state.go("transaction.filterBy", {
                        filterBy:    "driver",
                        filterValue: vm.driver.driverId
                    });
                });
        }

        function handleClickChangeStatus() {
            let actions = _.filter( vm.config.statuses, item => item.id !== vm.driver.status );
            displayChangeStatusActions( actions ).then(label => {
                let action = _.find( actions, { label } );
                vm.updateDriverStatus( action.id );
            });
        }

        function updateDriverStatus(statusId) {
            if ( !statusId ) { return; }

            // make request to update driver status; if failure, revert
            //Todo- remove; temporarily simulate successful response
            vm.isChangeStatusLoading = true;
            $timeout(() => {
                vm.isChangeStatusLoading = false;
                vm.driver.status         = statusId;
                vm.displayStatusChangeBannerSuccess = true;
            }, 1000);
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
    }

    angular.module( "app.components.driver" )
        .controller( "DriverDetailController", DriverDetailController );
})();
