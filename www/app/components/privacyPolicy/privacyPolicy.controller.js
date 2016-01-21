(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PrivacyPolicyController($cordovaInAppBrowser) {

        var vm = this;
        vm.openUrl = openUrl;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
        }

        function openUrl(url) {
            // TODO? - Maybe add an event listener for the app to handle external URLs getting loaded outside the app instead of needing a function in each place it's needed
            // See http://weblog.west-wind.com/posts/2015/Jul/02/External-Links-in-Cordova-for-iOS
            $cordovaInAppBrowser.open(url, "_system");
        }

    }

    angular.module("app.components.privacyPolicy")
        .controller("PrivacyPolicyController", PrivacyPolicyController);
})();
