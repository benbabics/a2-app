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
            setDrivers       : setDrivers
        };

        activate();

        return service;
        //////////////////////

        //Private methods:
        function activate() {
            clearCachedValues();
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

        //Public methods:
        function clearCachedValues() {
            drivers = [];
        }

        function fetchDriver(promptId) {
            return $q.when(_.find(drivers, {promptId: promptId}));
        }

        function fetchDrivers(accountId, params) {
            var searchParams = mapSearchParams(params),
                error;

            if (_.isNil(searchParams.pageSize)) {
                error = "Failed to fetch drivers: pageSize is a required field.";
                Logger.error(error);
                throw new Error(error);
            }

            if (_.isNil(searchParams.pageNumber)) {
                error = "Failed to fetch drivers: pageNumber is a required field.";
                Logger.error(error);
                throw new Error(error);
            }

            return DriversResource.getDrivers(accountId, searchParams)
                .then(function (driversResponse) {
                    if (!_.isNil(_.get(driversResponse, "data"))) {
                        //map the driver data to model objects
                        var fetchedDrivers = _.map(driversResponse.data, createDriver);

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
