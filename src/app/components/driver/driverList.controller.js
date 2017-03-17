(function() {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function DriverListController(_, $scope, globals, $controller, UserManager, DriverManager, Logger) {
        var vm = this,
            _activeSearchFilter = "";

        vm.config        = globals.DRIVER_LIST.CONFIG;
        vm.searchOptions = globals.DRIVER_LIST.SEARCH_OPTIONS;
        vm.searchFilter           = "";
        vm.searchOptions.ORDER_BY = "status";

        vm.applySearchFilter     = applySearchFilter;
        vm.getActiveSearchFilter = getActiveSearchFilter;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            var infiniteListController = $controller("WexInfiniteListController", {
                $scope,
                $attrs: {
                    isGreeking: true,
                    cacheKey:   "drivers-list"
                }
            });

            infiniteListController.assignServiceDelegate({
                makeRequest:      handleMakeRequest,
                onError:          handleOnError,
                onRequestItems:   handleOnRequestItems,
                onRenderComplete: handleOnRenderComplete,
                onResetItems:     handleOnResetItems
            });

            vm.drivers = $scope.infiniteScrollService.model;
            handleOnResetItems(); // initially add collections
        }

        function handleOnResetItems() {
            vm.drivers.active     = [];
            vm.drivers.terminated = [];
        }

        function handleMakeRequest(requestConfig) {
            var billingAccountId = UserManager.getUser().billingCompany.accountId,
                searchParams = {
                    pageSize:   vm.searchOptions.PAGE_SIZE,
                    pageNumber: 0
                };

            return DriverManager.fetchDrivers( billingAccountId, searchParams );
        }

        function handleOnRequestItems() {
            if ( !isGreeking() ) {
                // grab items that are currently greeking
                var drivers = _.filter( vm.drivers.collection, driver => driver.isGreekLoading );

                // since we're rendering vm.drivers.active & vm.drivers.terminated
                // instead of vm.drivers.collection
                // we will feed in greeking results into active and terminated collections
                // onRenderComplete is delegated the responsibility to sort and
                // reassign the appropriate items to which collections
                Array.prototype.push.apply( vm.drivers.active, drivers.splice(-1) );
                Array.prototype.push.apply( vm.drivers.terminated, drivers.splice(-12) );
            }
        }

        function handleOnError(errorResponse) {
            Logger.error( `Failed to fetch next page of drivers: ${errorResponse}` );
        }

        function handleOnRenderComplete() {
            // ensure we do not receive any greeking items
            var drivers = _.filter( vm.drivers.collection, driver => !driver.isGreekLoading );

            // now reassign schedule and completed collections their appropriate items
            filterDrivers( drivers );
        }

        function filterDrivers(drivers) {
            var unsortedActiveDrivers, unsortedTerminatedDrivers,
                sortingCriteria = [ "status", "lastName" ];

            // filter drivers into collections
            unsortedActiveDrivers     = _.filter( drivers, driver => driver.isActive() );
            unsortedTerminatedDrivers = _.filter( drivers, driver => driver.isTerminated() );

            // sort the driver collections
            vm.drivers.active     = _.orderBy( unsortedActiveDrivers, sortingCriteria, [ "asc" ] );
            vm.drivers.terminated = _.orderBy( unsortedTerminatedDrivers, sortingCriteria, [ "asc" ] );

            return drivers;
        }

        function applySearchFilter() {
            if ( vm.searchFilter !== _activeSearchFilter ) {
                _activeSearchFilter = vm.searchFilter;
                $scope.resetSearchResults();
            }
        }

        function getActiveSearchFilter() {
            return _activeSearchFilter;
        }

        function isGreeking() {
            let driverActive     = _.find( vm.drivers.active, driver => driver.isGreekLoading ) || [],
                driverTerminated = _.find( vm.drivers.terminated, driver => driver.isGreekLoading ) || [];

            return ( driverActive.length && driverTerminated.length ) > 0;
        }
    }

    angular.module( "app.components.driver" )
        .controller( "DriverListController", DriverListController );
})();