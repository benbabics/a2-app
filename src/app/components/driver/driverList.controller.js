(function() {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function DriverListController(_, $rootScope, $scope, globals, $controller, UserManager, DriverManager, Logger) {
        var vm = this;

        vm.config        = globals.DRIVER_LIST.CONFIG;
        vm.searchOptions = globals.DRIVER_LIST.SEARCH_OPTIONS;
        vm.searchFilter           = "";
        vm.searchOptions.ORDER_BY = "status";

        vm.driversComparator = driversComparator;

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
                onRenderComplete: handleRenderingItems,
                onResetItems:     handleOnResetItems
            });

            vm.drivers = $scope.infiniteScrollService.model;
            handleOnResetItems(); // initially add collections

            // avoid adding an additional watcher on deeply nested attrs
            let statusChangeListener = $rootScope.$on( "driver:statusChange", handleRenderingItems );

            // remove event listener
            $scope.$on( "$destroy", statusChangeListener );
        }

        function handleOnResetItems() {
            vm.drivers.active     = [];
            vm.drivers.terminated = [];
        }

        function handleMakeRequest(requestConfig) {
            var billingAccountId = UserManager.getUser().billingCompany.accountId;
            return DriverManager.fetchDrivers( billingAccountId );
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

        function handleRenderingItems() {
            filterDrivers( DriverManager.getDrivers() );
            $scope.$broadcast( "scroll.refreshComplete" ); // redraw colleciton headers
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

        function isGreeking() {
            let driverActive     = _.find( vm.drivers.active, driver => driver.isGreekLoading ) || [],
                driverTerminated = _.find( vm.drivers.terminated, driver => driver.isGreekLoading ) || [];

            return ( driverActive.length && driverTerminated.length ) > 0;
        }

        function driversComparator(driver, term) {
            // term doesn't yet exist, display each item in the collection
            if ( !term ) { return true; }

            // use driver data to compare against the term
            if ( _.isObject(driver) ) {
                let firstName = _.get( driver, "firstName", "" ).toLowerCase(),
                    lastName  = _.get( driver, "lastName", "" ).toLowerCase(),
                    promptId  = _.get( driver, "promptId", "" ).toLowerCase();

                // not case-sensitive; strip away unnecessary chars
                term = term.toLowerCase().replace( /\-|\s/g, "" );
                promptId = promptId.replace( /\-/g, "" );

                return firstName.indexOf( term ) >= 0 ||
                       lastName.indexOf( term )  >= 0 ||
                       promptId.indexOf( term )  >= 0;
            }
        }
    }

    angular.module( "app.components.driver" )
        .controller( "DriverListController", DriverListController );
})();