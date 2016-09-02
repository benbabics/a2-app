(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function AlertsManager(_, $q, globals, $rootScope, Logger, LoggerUtil, AlertModel, AlertsResource) {

      var cachedAlerts;
      var cachedUnreadAlertsCount;

      // Revealed Public members
      var service = {
              fetchAlerts:       fetchAlerts,
              deleteAlert:       deleteAlert,
              clearCachedValues: clearCachedValues,
              getAlerts:         getAlerts,
              setAlerts:         setAlerts,
              getUnreadAlertsCount: getUnreadAlertsCount,
              setAlertsRead:     setAlertsRead
          };

      activate();

      return service;
      //////////////////////

      function activate() {
          // Get the initial unread count after login.
          $rootScope.$on("app:login", fetchUnreadAlertsCount);
          clearCachedValues();
      }

      function clearCachedValues() {
          cachedAlerts = [];
          cachedUnreadAlertsCount = 0;
      }

      function createAlert(resource) {
          var alertModel = new AlertModel();
          alertModel.set( resource );

          return alertModel;
      }

      // jshint maxparams:3
      function fetchAlerts(pageNumber, pageSize) {
          var params = {
              status: globals.NOTIFICATIONS_API.STATUS.READ + "," + globals.NOTIFICATIONS_API.STATUS.UNREAD,
              pageNumber: pageNumber,
              pageSize:   pageSize
          };

          return AlertsResource.getAlerts(params)
              .then(function(response) {
                  if ( response && response.data ) {
                      // map the alerts data to model objects
                      var fetchedAlerts = _.map( response.data, createAlert );

                      // reset the cache if we're fetching the first page of results
                      if ( pageNumber === 0 ) {
                          cachedAlerts = [];
                      }

                      // only cache the fetched alerts that haven't been cached yet
                      cachedAlerts = _.uniqBy( cachedAlerts.concat(fetchedAlerts), 'alertId' );

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

      function deleteAlert(alert) {
          return AlertsResource.deleteAlert( alert.alertId )
              .then(function() {
                  cachedAlerts = _.without( cachedAlerts, alert );
              })
              .catch(function(response) {
                  var error = "Deleting alert failed: " + LoggerUtil.getErrorMessage( response );
                  Logger.error( error );
                  throw new Error( error );
              });
      }

      function getAlerts() {
          return cachedAlerts;
      }

      // Caution against using this as it replaces the object versus setting properties on it or extending it
      // suggested use for testing only
      function setAlerts(alertItems) {
          cachedAlerts = alertItems;
      }

      function fetchUnreadAlertsCount() {
          return AlertsResource.getUnreadAlertsCount()
              .then(function(response) {
                  cachedUnreadAlertsCount = response.data;
              })
              .catch(function(response) {
                  var error = "Fetching unread alerts count failed: " + LoggerUtil.getErrorMessage(response);
                  Logger.error(error);
                  throw new Error(error);
              });
      }

      function getUnreadAlertsCount() {
          return cachedUnreadAlertsCount;
      }

      function setAlertsRead(alertIds) {
          return AlertsResource.setAlertsRead(alertIds)
              .then(function() {
                  fetchUnreadAlertsCount();
              })
              .catch(function(response) {
                  var error = "Setting alerts as read failed: " + LoggerUtil.getErrorMessage(response);
                  Logger.error(error);
                  throw new Error(error);
              });
      }
    }

    angular
        .module("app.components.alerts")
        .factory("AlertsManager", AlertsManager);
})();
