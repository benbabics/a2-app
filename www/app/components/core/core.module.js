(function () {
    "use strict";

    //TODO - Move as much logic out of here as possible

    // jshint maxparams:14
    function coreRun(_, $cordovaDevice, $q, $rootScope, $state, $ionicPlatform, $window,
                     globals, AnalyticsUtil, AuthenticationManager, BrandManager, Navigation, PlatformUtil, Popup) {

        function isExitState(stateName) {
            return "app.exit" === stateName;
        }

        function isLoginPage(stateName) {
            return globals.LOGIN_STATE === stateName;
        }

        function validateRoutePreconditions(event, toState) { // args: event, toState, toParams, fromState, fromParams

            var stateName = toState.name;

            if (!isLoginPage(stateName) && !isExitState(stateName)) {
                // when navigating to any page that isn't the login page, validate that the user is logged in
                if (!AuthenticationManager.userLoggedIn()) {
                    // user is not logged in and is not trying to access the login page so redirect to the login page
                    event.preventDefault();
                    $state.go(globals.LOGIN_STATE);
                }
            }
        }

        function handleApplicationLogOut() {
            // clear any data in memory tied to the user
            AuthenticationManager.logOut();
        }

        function handleApplicationPause() {
            // log out the user
            handleApplicationLogOut();
        }

        function handleApplicationResume() {
            // Close any opened popups
            Popup.closeAllPopups();

            // Go to the login page
            $state.go(globals.LOGIN_STATE);
        }

        function loadBundledBrands() {
            _.forOwn(globals.BRANDS, function (brandResource, brandId) {

                BrandManager.loadBundledBrand(brandId, brandResource);
            });
        }

        function requestChromeFileSystem() {
            var MAX_FILE_SYSTEM_SIZE_CHROME = 5242880, //bytes
                requestFileSystem = $window.webkitRequestFileSystem,
                deferred = $q.defer();

            //we need to request a persistent FS while running in Chrome in order for cordova-plugin-file to work
            if (requestFileSystem && $cordovaDevice.getPlatform() === "browser") {
                requestFileSystem($window.PERSISTENT, MAX_FILE_SYSTEM_SIZE_CHROME, deferred.resolve, deferred.reject);
            }
            else {
                deferred.resolve();
            }

            return deferred.promise;
        }

        function startGenericAnalyticsTracker() {
            var genericTrackingId = BrandManager.getGenericAnalyticsTrackingId();

            if (genericTrackingId) {
                AnalyticsUtil.startTracker(genericTrackingId);
            }
        }

        //app must be set to fullscreen so that ionic headers are the correct size in iOS
        //see: http://forum.ionicframework.com/t/ion-nav-bar-top-padding-in-ios7/2488/12
        $ionicPlatform.ready(function() {
            // jshint undef:false
            $window.ionic.Platform.fullScreen(true, true);
        });

        $rootScope.$on("$stateChangeStart", validateRoutePreconditions);
        $rootScope.$on("app:cordovaPause", handleApplicationPause);
        $rootScope.$on("app:cordovaResume", handleApplicationResume);
        $rootScope.$on("app:logout", handleApplicationLogOut);

        //make the hardware back button go to the same state as the back button by default
        $ionicPlatform.registerBackButtonAction(function () { //args: event
            Navigation.goToBackState();
        }, 101);

        PlatformUtil.waitForCordovaPlatform()
            .then(requestChromeFileSystem)
            .then(loadBundledBrands);

        startGenericAnalyticsTracker();
    }

    angular.module("app.components.core", [])
        .run(coreRun);
})();
