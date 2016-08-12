(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function AlertsManager(_, $q, Logger, LoggerUtil, AlertModel, AlertsResource) {

      var __alerts;

      // Revealed Public members
      var service = {
              fetchAlerts: fetchAlerts,
          };

      activate();

      return service;
      //////////////////////

      function activate() {
          clearCachedValues();
      }

      function clearCachedValues() {
          __alerts = [];
      }

      function createAlert(resource) {
          var alertModel = new AlertModel();
          alertModel.set( resource );

          return alertModel;
      }

      // jshint maxparams:5
      function fetchAlerts(accountId, pageNumber, pageSize) {
          var params = {
              pageNumber: pageNumber,
              pageSize:   pageSize
          };

          return AlertsResource.getAlerts(accountId, params)
              .then(function(response) {
                  if ( response && response.data ) {
                      // map the alerts data to model objects
                      var fetchedAlerts = _.map( response.data, createAlert );

                      // reset the cache if we're fetching the first page of results
                      if ( pageNumber === 0 ) {
                          __alerts = [];
                      }

                      // only cache the fetched alerts that haven't been cached yet
                      __alerts = _.uniqBy( __alerts.concat(fetchedAlerts), 'alertId' );

                      return fetchedAlerts;
                  }

                  // no data in the response
                  else {
                      var error = "No data in Response from getting the Alerts";
                      Logger.error( error );
                      throw new Error( error );
                  }
              })

              // getting alerts failed
              .catch(function(response) {
                  // this only gets fired if the error is not caught by any HTTP Response Error Interceptors
                  var error = "Getting Alerts failed: " + LoggerUtil.getErrorMessage( response );
                  Logger.error( error );
                  throw new Error( error );
              });
      }

    }

    angular
        .module("app.components.alerts")
        .factory("AlertsManager", AlertsManager);
})();
