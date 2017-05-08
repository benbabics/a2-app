(function () {
    "use strict";

    //TODO - Move as much logic out of here as possible

    // jshint maxparams:14
    // Services may be included here in order to force them to be instantiated at startup
    function coreRun(_, $cordovaDevice, $q, $rootScope, $state, $ionicPlatform, $window,
                     globals, AnalyticsUtil, AuthenticationManager, BrandManager, FlowUtil, Navigation, PlatformUtil) {

        //Fix for Ionic issue outlined here: https://github.com/driftyco/ionic/issues/3908
        function applyScrollTapFix() {
            var originalScroll = ionic.views.Scroll,
                rebindTap = ionic.debounce(function () {
                    var deregister = ionic.tap.register(document);
                    deregister();
                    ionic.tap.register(document);
                }, 100);

            ionic.views.Scroll = function (options) {
                rebindTap();
                return new originalScroll(options);
            };
        }

        function handleApplicationLogOut() {
            // clear any data in memory tied to the user
            AuthenticationManager.logOut();
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
            AnalyticsUtil.startTracker(globals.GENERIC_TRACKING_ID);
        }

        //app must be set to fullscreen so that ionic headers are the correct size in iOS
        //see: http://forum.ionicframework.com/t/ion-nav-bar-top-padding-in-ios7/2488/12
        $ionicPlatform.ready(function() {
            // jshint undef:false
            $window.ionic.Platform.fullScreen(true, true);
        });

        $rootScope.$on("app:logout", handleApplicationLogOut);

        //make the hardware back button go to the same state as the back button by default
        $ionicPlatform.registerBackButtonAction(function () { //args: event
            FlowUtil.goToBackState();
        }, 101);

        PlatformUtil.waitForCordovaPlatform()
            .then(requestChromeFileSystem);

        startGenericAnalyticsTracker();

        applyScrollTapFix();
    }

    angular.module("app.components.core", [])
        .run(coreRun);
})();
