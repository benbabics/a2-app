(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:4

    // NOTE: This service will only track analytics data on platforms with Cordova.

    /* @ngInject */
    function AnalyticsUtil($cordovaGoogleAnalytics, CommonService) {
        // Private members

        // Revealed Public members
        var service = {
            "setUserId"         : setUserId,
            "startTrackerWithId": startTrackerWithId,
            "trackEvent"        : trackEvent,
            "trackView"         : trackView
        };

        return service;
        //////////////////////

        function setUserId(userId) {
            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.setUserId(userId);
            });
        }

        function startTrackerWithId(trackingId) {
            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.startTrackerWithId(trackingId);
            });
        }

        function trackEvent(category, action, label, value) {
            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
            });
        }

        function trackView(name) {
            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(name);
            });
        }
    }

    angular
        .module("app.shared.util")
        .factory("AnalyticsUtil", AnalyticsUtil);

})();