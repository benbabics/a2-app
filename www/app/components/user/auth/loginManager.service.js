(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function LoginManager($q, $rootScope, AnalyticsUtil, BrandManager, CommonService, Logger, UserManager) {
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
            clearCachedValues();

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
            CommonService.loadingBegin();

            UserManager.fetchCurrentUserDetails()
                .then(function (userDetails) {
                    // track all events with the user's ID
                    AnalyticsUtil.setUserId(userDetails.id);

                    return BrandManager.updateBrandCache(userDetails.brand)
                        .catch(function (error) {
                            Logger.error(CommonService.getErrorMessage(error));

                            //eat the error
                        });
                })
                .then(initializationCompletedDeferred.resolve)
                .catch(function (error) {
                    initializationCompletedDeferred.reject(error);

                    throw new Error("Failed to complete login initialization: " + CommonService.getErrorMessage(error));
                })
                .finally(CommonService.loadingComplete);
        }
    }

    angular
        .module("app.components.user.auth")
        .factory("LoginManager", LoginManager);
})();
