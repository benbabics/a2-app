(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function LoginManager($q, $rootScope, globals,
                          AnalyticsUtil, AuthenticationManager, BrandManager, CommonService, Logger, UserManager) {
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
            $rootScope.$emit("app:login");

            return doLoginInitialization();
        }

        function logOut() {
            $rootScope.$emit("app:logout");

            return doLogoutCleanup();
        }

        function doLoginInitialization() {
            CommonService.loadingBegin();

            return UserManager.fetchCurrentUserDetails()
                .then(function (userDetails) {
                    return BrandManager.updateBrandCache(userDetails.brand)
                        .catch(function (error) {
                            Logger.error(CommonService.getErrorMessage(error));

                            //eat the error
                        });
                })
                .then(startBrandedTracker)
                .catch(function (error) {
                    throw new Error("Failed to complete login initialization: " + CommonService.getErrorMessage(error));
                })
                .finally(CommonService.loadingComplete);
        }

        function doLogoutCleanup() {
            startGenericTracker();

            return $q.resolve();
        }

        function startBrandedTracker() {
            var user = UserManager.getUser(),
                trackingId;

            if (AuthenticationManager.userLoggedIn()) {
                //use the user's branded tracker
                trackingId = BrandManager.getUserBrandAssetBySubtype(ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);

                if (trackingId) {
                    AnalyticsUtil.startTracker(trackingId.assetValue);
                }

                //track all events with the user's ID
                AnalyticsUtil.setUserId(user.id);
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
