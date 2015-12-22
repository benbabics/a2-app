/* Service provider for the PhoneGap Toast plugin (see https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin) */
(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function ToastService($ionicLoading, $cordovaToast, CommonService) {
        var toast,
            _ = CommonService._;

        if (CommonService.platformHasCordova()) {
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
                showShortTop   : _.partial(show, _, "short"),
                showShortCenter: _.partial(show, _, "short"),
                showShortBottom: _.partial(show, _, "short"),
                showLongTop    : _.partial(show, _, "long"),
                showLongCenter : _.partial(show, _, "long"),
                showLongBottom : _.partial(show, _, "long")
            };
        }

        function show(message, duration) {
            $ionicLoading.show({
                template: "<span class=\"toast-message\">" + message + "</span>",
                duration  : mapDurationString(duration),
                noBackdrop: true
            });
        }

        function mapDurationString(duration) {
            if (duration.toLowerCase() === "short") {
                return 2000;
            } else if (duration.toLowerCase() === "long") {
                return 4000;
            }
            return 0;
        }

        return toast;
    }

    angular
        .module("app.shared.integration")
        .factory("ToastService", ToastService);
}());
