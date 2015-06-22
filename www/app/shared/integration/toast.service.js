/* Service provider for the PhoneGap Toast plugin (see https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin) */
(function () {
    "use strict";

    /* @ngInject */
    function ToastService($window, $ionicLoading, CommonService) {
        var toast,
            _ = CommonService._;

        if ($window.plugins) {
            //if Cordova is available to use, use the Cordova toast plugin
            toast = $window.plugins.toast;
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
                template: '<span class="toast-message">' + message + '</span>',
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
        .module("app.integration")
        .factory("ToastService", ToastService);
}());