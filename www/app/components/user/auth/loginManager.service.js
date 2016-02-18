(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function LoginManager($q, $rootScope, AnalyticsUtil, BrandUtil, CommonService, UserManager) {
        // Private members
        var initializationCompletedDeferred;

        // Revealed Public members
        var service = {
            "logIn"                : logIn,
            "logOut"               : logOut,
            "waitForCompletedLogin": waitForCompletedLogin
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("app:login", doLoginInitialization);
            $rootScope.$on("app:logout", clearCachedValues);

            clearCachedValues();
        }

        function logIn() {
            $rootScope.$emit("app:login");

            return waitForCompletedLogin();
        }

        function logOut() {
            $rootScope.$emit("app:logout");

            return $q.resolve();
        }

        function waitForCompletedLogin() {
            return initializationCompletedDeferred.promise;
        }

        function clearCachedValues() {
            initializationCompletedDeferred = $q.defer();
        }

        function doLoginInitialization() {
            UserManager.fetchCurrentUserDetails()
                .then(function (userDetails) {
                    // track all events with the user's ID
                    AnalyticsUtil.setUserId(userDetails.id);

                    return updateBrandCache(userDetails);
                })
                .then(initializationCompletedDeferred.resolve)
                .catch(function (error) {
                    throw new Error("Failed to complete login initialization: " + CommonService.getErrorMessage(error));
                });
        }

        function updateBrandCache(userDetails) {
            var brandName = userDetails.brand;

            return userDetails.fetchBrandAssets()
                .then(function (brandAssets) {
                    return BrandUtil.updateBrandCache(brandName, brandAssets);
                });
        }
    }

    angular
        .module("app.components.user.auth")
        .factory("LoginManager", LoginManager);
})();
