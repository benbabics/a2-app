(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function ContactUsController(globals, $ionicPlatform, $cordovaAppVersion) {

        var vm = this;
        vm.config = globals.CONTACT_US.CONFIG;
        vm.sendEmailLink = "";

        $ionicPlatform.ready(function () {
            $cordovaAppVersion.getVersionNumber().then(function (version) {
                vm.sendEmailLink = vm.config.sendEmailLink + version;
            });
        });

        //////////////////////

    }

    angular.module("app.components.contactUs")
        .controller("ContactUsController", ContactUsController);
})();
