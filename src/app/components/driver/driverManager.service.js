(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function DriverManager(_, $q, DriverModel, DriversResource, Logger, LoggerUtil) {
        // Private members
        var drivers;

        // Revealed Public members
        var service = {
            clearCachedValues: clearCachedValues,
            fetchDriver      : fetchDriver,
            fetchDrivers     : fetchDrivers,
            getDrivers       : getDrivers,
            setDrivers       : setDrivers,
            updateStatus     : updateStatus
        };

        activate();

        return service;
        //////////////////////

        //Private methods:
        function activate() {
            clearCachedValues();
        }

        function createDrivers(drivers=[]) {
            // map driver to model
            var collection = _.map( drivers, createDriver );

            // extend with metadata
            return _.extend( drivers, collection );
        }

        function createDriver(driverResource) {
            var driverModel = new DriverModel();
            driverModel.set(driverResource);

            return driverModel;
        }

        function mapSearchParams(params) {
            return _.pick(params, [
                "promptId",
                "firstName",
                "lastName",
                "email",
                "status",
                "departmentId",
                "pageSize",
                "pageNumber"
            ]);
        }

        function validateCoupledSearchParams(params={}, ...keys) {
            let isNil  = key => _.isNil( params[ key ] );
            let values = _( keys ).map( isNil ).compact().value();

            return values.length === 0 || values.length === keys.length;
        }

        //Public methods:
        function clearCachedValues() {
            drivers = [];
        }

        function fetchDriver(promptId) {
            return $q.when(_.find(drivers, { promptId }));
        }

        function fetchDrivers(accountId, params) {
            var searchParams = mapSearchParams(params),
                error;

            // search params are only required as a couple; repsonse contains paginated results
            // without search params, response contains entire collection of results
            let requiredSearchParams = [ 'pageSize', 'pageNumber' ];
            if ( !validateCoupledSearchParams(params, ...requiredSearchParams) ) {
                error = `Failed to fetch drivers: intent of pagination requires presence of coupled fields ${requiredSearchParams.join(' & ')}.`;
                Logger.error( error );
                throw new Error( error );
            }

            return DriversResource.getDrivers(accountId, searchParams)
                .then(function (driversResponse) {
                    if (!_.isNil(_.get(driversResponse, "data"))) {
                        // map driver data to model objects (with metadata)
                        var fetchedDrivers = createDrivers( driversResponse.data );

                        //reset the cache if we're fetching the first page of results
                        if (searchParams.pageNumber === 0) {
                            drivers = [];
                        }

                        //only cache the fetched drivers that haven't been cached yet
                        drivers = _.uniqBy(drivers.concat(fetchedDrivers), "promptId");

                        return fetchedDrivers;
                    }
                    // no data in the response
                    else {
                        return $q.reject("No data in response from getting the Drivers");
                    }
                })
                // get drivers failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Drivers failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getDrivers() {
            return drivers;
        }

        function updateStatus(accountId, driverId, newStatus, promptId) {
            return DriversResource.postStatusChange( accountId, driverId, newStatus, promptId )
                .then(response => {
                    if ( response && response.data ) {
                        var cachedDriver = _.find( drivers, { promptId } );

                        if ( cachedDriver ) {
                            // update the existing driver object in the cache
                            cachedDriver.set( response.data );
                        }
                        else {
                            // the driver should be in the cache, so log a warning
                            Logger.warn( "Updated driver was not found in the cache (this should not happen)" );

                            // map the data to a driver model to be returned
                            cachedDriver = createDriver( response.data );
                        }

                        return cachedDriver;
                    }

                    // no data in the response
                    else {
                        var error = "No data in Response from updating the Driver Status";
                        Logger.error( error );
                        throw new Error( error );
                    }
                })
                .catch(failureResponse => {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors
                    var error = "Updating Card Status failed: " + LoggerUtil.getErrorMessage( failureResponse );
                    Logger.error( error );
                    throw new Error( error );
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setDrivers(driversInfo) {
            drivers = driversInfo;
        }
    }

    angular
        .module("app.components.driver")
        .factory("DriverManager", DriverManager);
})();
