(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function MenuController(_, $ionicSideMenuDelegate, $state, $timeout, globals, Navigation, Fingerprint) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;
        vm.fingerprintAuthAvailable = false;

        vm.closeMenu = closeMenu;
        vm.goToHome = goToHome;
        vm.goToMakePayment = goToMakePayment;
        vm.goToPaymentActivity = goToPaymentActivity;
        vm.goToNotifications = goToNotifications;
        vm.goToTransactionActivity = goToTransactionActivity;
        vm.goToCards = goToCards;
        vm.goToDrivers = goToDrivers;
        vm.goToContactUs = goToContactUs;
        vm.goToTermsOfUse = goToTermsOfUse;
        vm.goToPrivacyPolicy = goToPrivacyPolicy;
        vm.goToSettings = goToSettings;
        vm.goToLogOut = goToLogOut;
        vm.currentStateHasRoot = currentStateHasRoot;

        $timeout( activate );

        /////////////////////
        // Controller initialization
        function activate() {
            Fingerprint.isAvailable()
                .then(function () { vm.fingerprintAuthAvailable = true; });
        }

        function closeMenu() {
            $ionicSideMenuDelegate.toggleRight(false);
        }

        function goToCards() {
            return Navigation.goToCards();
        }

        function goToDrivers() {
            return Navigation.goToDrivers();
        }

        function goToContactUs() {
            return Navigation.goToContactUs().then( closeMenu );
        }

        function goToHome() {
            return Navigation.goToHome().then( closeMenu );
        }

        function goToLogOut() {
            return Navigation.goToLogOut();
        }

        function goToMakePayment() {
            return Navigation.goToMakePayment();
        }

        function goToPaymentActivity() {
            return Navigation.goToPaymentActivity();
        }

        function goToSettings() {
            return Navigation.goToSettings().then( closeMenu );
        }

        function goToNotifications() {
            return Navigation.goToNotifications();
        }

        function goToPrivacyPolicy() {
            return Navigation.goToPrivacyPolicy().then( closeMenu );
        }

        function goToTermsOfUse() {
            return Navigation.goToTermsOfUse().then( closeMenu );
        }

        function goToTransactionActivity() {
            return Navigation.goToTransactionActivity();
        }

        function currentStateHasRoot(rootState) {
            return _.startsWith($state.current.name, rootState);
        }
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();
