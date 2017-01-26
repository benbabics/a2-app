(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function TermsOfUseController(globals, $cordovaAppVersion, $ionicPlatform) {

        var vm = this;
        vm.config = globals.TERMS_OF_USE.CONFIG;
        vm.closing = "";

        $ionicPlatform.ready(function () {
            $cordovaAppVersion.getVersionNumber().then(function (version) {
                vm.closing = vm.config.closing.replace("$VERSION_NUMBER$", version);
            });
        });

        //////////////////////

    }

    angular.module("app.components.terms")
        .controller("TermsOfUseController", TermsOfUseController);
})();
