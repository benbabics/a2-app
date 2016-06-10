(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function onlineEnrollmentFlow($rootScope, $http, $cordovaInAppBrowser, LoadingIndicator, Popup, AnalyticsUtil, globals) {

      var GLOBALS = globals.ONLINE_ENROLLMENT.CONFIG,
          ENROLLMENT_URL      = globals.ONLINE_ENROLLMENT_API.BASE_URL + "/",
          ENROLLMENT_PING_URL = ENROLLMENT_URL + "ping";

      return {
          restrict:    "E",
          templateUrl: "app/components/user/auth/templates/onlineEnrollmentFlow.directive.html",
          replace:     true,
          transclude:  true,
          scope:       {},
          link:        link
      };

      function link(scope, element, attrs) {
        assigncordovaInAppBrowserListeners();
        scope.handleOpenEnrollmentWindow = handleOpenEnrollmentWindow;
      }

      function assigncordovaInAppBrowserListeners() {
        $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, evt) {
          // inject scripts
        });

        $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, evt) {
          closeOnlineEnrollmentAppWithErrorAlert();
        });
      }

      /**
        * Online Enrollment In-App Browser
      **/
      function handleOpenEnrollmentWindow() {
        requestServicePingConfirmation()
          .then(function() {
            loadOnlineEnrollmentApp();
            trackEvent( GLOBALS.ANALYTICS.events.EnrollmentAvailable );
          })
          .catch(function() {
            displayServiceUnavailableAlert();
            trackEvent( GLOBALS.ANALYTICS.events.EnrollmentNotAvailable );
          });
      }

      function requestServicePingConfirmation() {
        LoadingIndicator.begin();

        return $http.get( ENROLLMENT_PING_URL )
          .finally(function() { LoadingIndicator.complete(); });
      }

      function loadOnlineEnrollmentApp() {
        $cordovaInAppBrowser.open( ENROLLMENT_URL, '_blank' )
          .catch( closeOnlineEnrollmentAppWithErrorAlert );
      }

      /**
        * Error Messages
      **/
      function displayServiceUnavailableAlert() {
        var msg = GLOBALS.MESSAGES.ERRORS.serviceUnavailable;
        Popup.displayAlert({ subTitle: msg });
      }

      function closeOnlineEnrollmentAppWithErrorAlert(msg) {
        msg = msg || GLOBALS.MESSAGES.ERRORS.applicationError;
        $cordovaInAppBrowser.close();
        Popup.displayAlert({ subTitle: msg });
      }

      /**
        * Analytics
      **/
      function trackEvent(eventData) {
        _.spread( AnalyticsUtil.trackEvent )( eventData );
      }
    }

    angular.module("app.shared.widgets")
      .directive("onlineEnrollmentFlow", onlineEnrollmentFlow);
}());
