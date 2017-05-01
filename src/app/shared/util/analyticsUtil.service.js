(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:6

    // NOTE: This service will only track analytics data on platforms with Cordova.

    /* @ngInject */
    function AnalyticsUtil(_, $q, $window, Logger, LoggerUtil, PlatformUtil) {
        // Private members
        var DISPATCH_INTERVAL = 30, //in seconds (Note: Too large of an interval seems to break real-time analytics completely)
            USER_ID_DIMENSION_ID = 1,
            activeTrackerId;

        // Revealed Public members
        var service = {
            "getActiveTrackerId": getActiveTrackerId,
            "hasActiveTracker"  : hasActiveTracker,
            "setCustomDimension": setCustomDimension,
            "setUserId"         : setUserId,
            "startTracker"      : startTracker,
            "trackEvent"        : trackEvent,
            "trackView"         : trackView
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            whenReady(function (analytics) {
                if (Logger.isEnabled()) {
                    analytics.setLogLevel(analytics.LogLevel.VERBOSE);
                }

                analytics.setDispatchInterval(DISPATCH_INTERVAL, _.noop, handleTrackingError);
            }).catch(function () {
                throw "AnalyticsUtil is not available on this platform.";
            });
        }

        function getActiveTrackerId() {
            return activeTrackerId;
        }

        function handleTrackingError(error) {
            throw new Error("Failed to do analytics tracking: " + LoggerUtil.getErrorMessage(error));
        }

        function hasActiveTracker() {
            return !!activeTrackerId;
        }

        function setCustomDimension(id, value) {
            whenReady((analytics) => {
                analytics.customDimension(id, value, _.noop, handleTrackingError);
            });
        }

        function setUserId(userId) {
            whenReady(function (analytics) {
                analytics.set("&uid", userId, _.noop, handleTrackingError);

                setCustomDimension(USER_ID_DIMENSION_ID, userId);
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
            return PlatformUtil.waitForCordovaPlatform(function () {
                if ($window.navigator.analytics) {
                    return $window.navigator.analytics;
                }
                else {
                    return $q.reject();
                }
            }).then(callback);
        }
    }

    angular
        .module("app.shared.util")
        .factory("AnalyticsUtil", AnalyticsUtil);

})();