/* Service provider for the PhoneGap Toast plugin (see https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin) */
(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function Toast(_, $ionicLoading, $cordovaToast, PlatformUtil) {
        var toast;

        if (PlatformUtil.platformHasCordova()) {
            //if Cordova is available to use, use the Cordova toast plugin
            toast = $cordovaToast;
        }
        else {
            //cordova isn't available on this platform (probably because we're testing on a desktop browser), so create a basic
            //fallback wrapper using $ionicLoading.
            toast = {
                showWithOptions: function (options) {
                    show(options.message, options.duration);
                },
                show           : show,
                showShortTop   : (message) => show(message, "short"),
                showShortCenter: (message) => show(message, "short"),
                showShortBottom: (message) => show(message, "short"),
                showLongTop    : (message) => show(message, "long"),
                showLongCenter : (message) => show(message, "long"),
                showLongBottom : (message) => show(message, "long")
            };
        }

        function show(message, duration) {
            $ionicLoading.show({
                template: "<span class=\"toast-message\">" + message + "</span>",
                duration  : mapDuration(duration),
                noBackdrop: true
            });
        }

        function mapDuration(duration) {
            if (_.isNumber(duration)) {
                return duration;
            }
            else if (_.isString(duration)) {
                duration = duration.toLowerCase();

                switch (duration) {
                    case "short":
                        return 2000;
                    case "long":
                        return 4000;
                }
            }

            return 0;
        }

        return toast;
    }

    angular
        .module("app.shared.integration")
        .factory("Toast", Toast);
}());
