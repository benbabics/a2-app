(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:11

    /* @ngInject */
    function LoginManager($q, $ionicSideMenuDelegate, $rootScope, globals,
                          AnalyticsUtil, BrandManager, LoadingIndicator, Logger, LoggerUtil, Popup, UserManager) {
        // Private members
        var ASSET_SUBTYPES = globals.BRAND.ASSET_SUBTYPES;

        // Revealed Public members
        var service = {
            "logIn" : logIn,
            "logOut": logOut
        };

        return service;
        //////////////////////

        function logIn() {
            return doLoginInitialization().then(() => $rootScope.$emit("app:login"));
        }

        function logOut() {
            return doLogoutCleanup().then(() => $rootScope.$emit("app:logout"));
        }

        function doLoginInitialization() {
            LoadingIndicator.begin();

            return UserManager.fetchCurrentUserDetails()
                .then(function (userDetails) {
                    return BrandManager.updateBrandCache(userDetails.brand)
                        .catch(function (error) {
                            Logger.error(LoggerUtil.getErrorMessage(error));

                            //eat the error
                        });
                })
                .then(startGenericTracker)
                .then(setTrackerUserId)
                .catch(function (error) {
                    throw new Error("Failed to complete login initialization: " + LoggerUtil.getErrorMessage(error));
                })
                .finally(LoadingIndicator.complete);
        }

        function doLogoutCleanup() {
            //close any opened popups
            Popup.closeAllPopups();

            //close the side menu
            $ionicSideMenuDelegate.toggleRight(false);

            return $q.resolve();
        }

        function setTrackerUserId() {
            var user = UserManager.getUser();

            //track all events with the user's ID
            AnalyticsUtil.setUserId(user.id);
        }

        /**
         * MOBACCTMGT-998 Track generic as smarthub universal tracking id (no longer by brand)
         * keeping this method for a future story when GA Universal Tracking is implemented
         * it seems that the brand will be custom dimensions this can hook into
         */
        function startBrandedTracker() {
            var trackingId = BrandManager.getUserBrandAssetBySubtype(ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);

            //use the user's branded tracker
            if (trackingId) {
                AnalyticsUtil.startTracker(trackingId.assetValue);
            }
        }

        function startGenericTracker() {
            var trackingId = BrandManager.getGenericAnalyticsTrackingId();

            if (trackingId) {
                AnalyticsUtil.startTracker(trackingId);
            }
        }
    }

    angular
        .module("app.components.user.auth")
        .factory("LoginManager", LoginManager);
})();
