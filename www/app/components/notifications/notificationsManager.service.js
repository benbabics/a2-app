(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function NotificationsManager($q, $rootScope, $localStorage, Logger, PlatformUtil, UrbanAirship, AlertsResource, LoggerUtil) {

        var deferred, storage, service;

        // is service ready?
        deferred = $q.defer();

        // localStorage (duh)
        storage = $localStorage.$default({
            notificationsFlags: {
                hasEnabled       : false,
                hasRejectedBanner: false,
                hasRejectedPrompt: false
            }
        });

        // Revealed Public members
        service = {
            onReady                     : deferred.promise,
            flags                       : storage.notificationsFlags,
            enableNotifications         : enableNotifications,
            rejectBanner                : rejectBanner,
            rejectPrompt                : rejectPrompt,
            registerUserForNotifications: registerUserForNotifications
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            PlatformUtil.waitForCordovaPlatform(function () {
                checkPlatformEnableNotifications();
                deferred.resolve();
            }, function () {
                deferred.resolve();
            });

            $rootScope.$on("app:login", registerUserForNotifications);
        }

        function checkPlatformEnableNotifications() {
            var isIOS = PlatformUtil.getPlatform() === "iOS",
                isEnabled = storage.notificationsFlags.hasEnabled;

            Logger.log("checkPlatformEnableNotifications", PlatformUtil.getPlatform());

            if (isIOS) {
                storage.notificationsFlags.hasEnabled = isEnabled; // use last stored value
            }
            else {
                storage.notificationsFlags.hasEnabled = true;
            }
        }

        function enableNotifications() {
            storage.notificationsFlags.hasEnabled = true;

            UrbanAirship.ready().then(function (airship) {
                airship.setUserNotificationsEnabled(true);
                Logger.log("UrbanAirship.setUserNotificationsEnabled", true);
            });

            Logger.log("notificationsFlags.hasEnabled", true);
        }

        function rejectBanner() {
            storage.notificationsFlags.hasRejectedBanner = true;
            Logger.log("notificationsFlags.hasRejectedBanner", true);
        }

        function rejectPrompt() {
            storage.notificationsFlags.hasRejectedPrompt = true;
            Logger.log("notificationsFlags.hasRejectedPrompt", true);
        }

        function registerUserForNotifications() {
            return UrbanAirship.ready()
                .then(getChannelID)
                .then(AlertsResource.registerUserForNotifications)
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors
                    var error = "Registering username for push notifications failed: " + LoggerUtil.getErrorMessage(failureResponse);
                    Logger.error(error);
                    // eat the error
                });
        }

        function getChannelID(airship) {
            var deferred = $q.defer();
            airship.getChannelID(deferred.resolve, deferred.reject);
            return deferred.promise;
        }
    }

    angular
        .module("app.components.notifications")
        .factory("NotificationsManager", NotificationsManager)
        // jshint unused:false
        .run(function (NotificationsManager) {
        });
})();
