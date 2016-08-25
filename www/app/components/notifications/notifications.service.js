(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function NotificationsManager($q, $localStorage, Logger, PlatformUtil, UrbanAirship) {

      var deferred, storage, service;

      // is service ready?
      deferred = $q.defer();

      // localStorage (duh)
      storage = $localStorage.$default({
        notificationsFlags: {
          hasEnabled:        false,
          hasRejectedBanner: false,
          hasRejectedPrompt: false
        }
      });

      // Revealed Public members
      service = {
        onReady:             deferred.promise,
        flags:               storage.notificationsFlags,
        enableNotifications: enableNotifications,
        rejectBanner:        rejectBanner,
        rejectPrompt:        rejectPrompt
      };

      activate();

      return service;
      //////////////////////

      function activate() {
          PlatformUtil.waitForCordovaPlatform(function() {
              checkPlatformEnableNotifications();
              deferred.resolve();
          }, function() { deferred.resolve(); });
      }

      function checkPlatformEnableNotifications() {
          var isIOS     = PlatformUtil.getPlatform() === "iOS",
              isEnabled = storage.notificationsFlags.hasEnabled;

          Logger.log( "checkPlatformEnableNotifications", PlatformUtil.getPlatform() );

          if ( isIOS ) {
              storage.notificationsFlags.hasEnabled = isEnabled; // use last stored value
          }
          else {
            storage.notificationsFlags.hasEnabled = true;
          }
      }

      function enableNotifications() {
          storage.notificationsFlags.hasEnabled = true;

          UrbanAirship.ready().then(function(airship) {
              airship.setUserNotificationsEnabled( true );
              Logger.log( "UrbanAirship.setUserNotificationsEnabled", true );
          });

          Logger.log( "notificationsFlags.hasEnabled", true );
      }
      function rejectBanner() {
          storage.notificationsFlags.hasRejectedBanner = true;
          Logger.log( "notificationsFlags.hasRejectedBanner", true );
      }
      function rejectPrompt() {
          storage.notificationsFlags.hasRejectedPrompt = true;
          Logger.log( "notificationsFlags.hasRejectedPrompt", true );
      }
    }

    angular
        .module("app.components.notifications")
        .factory("NotificationsManager", NotificationsManager)
        // jshint unused:false
        .run(function(NotificationsManager) {});
})();
