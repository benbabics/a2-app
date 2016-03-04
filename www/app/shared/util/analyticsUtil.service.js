(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    // NOTE: This service will only track analytics data on platforms with Cordova.

    /* @ngInject */
    function AnalyticsUtil($window, CommonService, Logger) {
        // Private members
        var DISPATCH_INTERVAL = 30, //in seconds (Note: Too large of an interval seems to break real-time analytics completely)
            _ = CommonService._,
            activeTrackerId,
            readyPromise;

        // Revealed Public members
        var service = {
            "getActiveTrackerId": getActiveTrackerId,
            "hasActiveTracker"  : hasActiveTracker,
            "setUserId"         : setUserId,
            "startTracker"      : startTracker,
            "trackEvent"        : trackEvent,
            "trackView"         : trackView
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            readyPromise = CommonService.waitForCordovaPlatform(function () {
                if ($window.navigator.analytics) {
                    return $window.navigator.analytics;
                }
                else {
                    throw "AnalyticsUtil is not available on this platform.";
                }
            });

            whenReady(configure);
        }

        function configure(analytics) {
            analytics.setLogLevel(analytics.LogLevel.VERBOSE);

            analytics.setDispatchInterval(DISPATCH_INTERVAL, _.noop, handleTrackingError);
        }

        function getActiveTrackerId() {
            return activeTrackerId;
        }

        function handleTrackingError(error) {
            throw new Error("Failed to do analytics tracking: " + CommonService.getErrorMessage(error));
        }

        function hasActiveTracker() {
            return !!activeTrackerId;
        }

        function setUserId(userId) {
            whenReady(function (analytics) {
                analytics.set("&uid", userId, _.noop, handleTrackingError);
            });
        }

        function startTracker(trackerId) {
            whenReady(function (analytics) {
                if (activeTrackerId !== trackerId) {
                    analytics.setTrackingId(trackerId, _.noop, handleTrackingError);

                    activeTrackerId = trackerId;
                }
                else {
                    Logger.info("The active analytics tracker is already set to " + trackerId);
                }
            });
        }

        function trackEvent(category, action, label, value) {
            whenReady(function (analytics) {
                analytics.sendEvent(category, action, label, value, _.noop, handleTrackingError);
            });
        }

        function trackView(name) {
            whenReady(function (analytics) {
                analytics.sendAppView(name, _.noop, handleTrackingError);
            });
        }

        function whenReady(callback) {
            readyPromise.then(callback);
        }
    }

    angular
        .module("app.shared.util")
        .factory("AnalyticsUtil", AnalyticsUtil);

})();