/* Service provider for urbanairship-cordova */
(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UrbanAirship(_, $q, Logger, PlatformUtil) {

        init();

        return {ready: ready};
        ////////////////////
        //Public functions:
        function ready() {
            return PlatformUtil.waitForCordovaPlatform()
                .then(function () {
                    if (!_.isNil(_.get(window, "UAirship"))) {
                        return window.UAirship;
                    }
                    else {
                        var error = "UrbanAirship is not available on this platform.";
                        Logger.info(error);
                        return $q.reject(error);
                    }
                });
        }

        ////////////////////
        //Private functions:
        function init() {
            ready().then(function (airship) {
                //configure UrbanAirship
                airship.setAutobadgeEnabled(true);

                //automatically enable notifications on Android, but wait on iOS because we want to prompt the user to accept later
                if (_.toLower(PlatformUtil.getPlatform()) === "android") {
                    airship.setUserNotificationsEnabled(true);
                }
            });
        }
    }

    angular
        .module("app.shared.integration")
        .factory("UrbanAirship", UrbanAirship)
        // jshint unused:false
        .run(function (UrbanAirship) {
            // explicitly instantiate this service
        });
}());
