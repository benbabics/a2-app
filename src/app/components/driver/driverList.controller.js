(function() {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function DriverListController(_, $rootScope, $scope, globals, $controller, $cordovaKeyboard, $ionicScrollDelegate, PlatformUtil, UserManager, DriverManager, Logger) {
        var vm = this;

        vm.config        = globals.DRIVER_LIST.CONFIG;
        vm.searchOptions = globals.DRIVER_LIST.SEARCH_OPTIONS;
        vm.searchFilter           = "";
        vm.searchOptions.ORDER_BY = "status";

        vm.driversComparator = driversComparator;
        vm.handleSwiping     = handleSwiping;

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

            // force redraw colleciton headers on searchFilter change
            $scope.$watch( () => vm.searchFilter, listRefreshComplete );

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
            listRefreshComplete();
        }

        function filterDrivers(drivers) {
            var unsortedActiveDrivers, unsortedTerminatedDrivers,
                sortingCriteria = [ driver => ( driver.lastName || "" ).toLowerCase() ];

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
                let firstName = ( _.get( driver, "firstName" ) || "" ).toLowerCase(),
                    lastName  = ( _.get( driver, "lastName"  ) || "" ).toLowerCase(),
                    promptId  = ( _.get( driver, "promptId"  ) || "" ).toLowerCase(),
                    combined  = lastName + firstName + lastName;

                // not case-sensitive; strip away unnecessary chars
                term = term.toLowerCase().replace( /\,|-|\s/g, "" );
                combined = combined.replace( /\,|-|\s/g, "" );
                promptId = promptId.replace( /\,|-/g, "" );

                return combined.indexOf( term )  > -1 || promptId.indexOf( term ) > -1;
            }
        }

        function listRefreshComplete() {
            $scope.$broadcast( "scroll.refreshComplete" );
            $ionicScrollDelegate.resize();
        }

        function handleSwiping() {
            let isKeyboardVisible = PlatformUtil.platformHasCordova() && $cordovaKeyboard.isVisible();
            if ( isKeyboardVisible ) {
                $cordovaKeyboard.close();

                // force blur on input, if active
                document.activeElement && document.activeElement.blur();
            }
        }
    }

    angular.module( "app.components.driver" )
        .controller( "DriverListController", DriverListController );
})();