(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:8

    /* @ngInject */
    function MenuController(_, $ionicSideMenuDelegate, $state, $timeout, globals, Navigation, AlertsManager, Fingerprint) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;
        vm.fingerprintAuthAvailable = false;

        vm.closeMenu = closeMenu;
        vm.goToHome = goToHome;
        vm.goToMakePayment = goToMakePayment;
        vm.goToPaymentActivity = goToPaymentActivity;
        vm.goToAlerts = goToAlerts;
        vm.goToTransactionActivity = goToTransactionActivity;
        vm.goToCards = goToCards;
        vm.goToContactUs = goToContactUs;
        vm.goToTermsOfUse = goToTermsOfUse;
        vm.goToPrivacyPolicy = goToPrivacyPolicy;
        vm.goToSettings = goToSettings;
        vm.goToLogOut = goToLogOut;
        vm.currentStateHasRoot = currentStateHasRoot;
        vm.getUnreadAlertsCount = getUnreadAlertsCount;

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

        function goToContactUs() {
            return Navigation.goToContactUs();
        }

        function goToHome() {
            return Navigation.goToHome();
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
            return Navigation.goToSettings();
        }

        function goToAlerts() {
            return Navigation.goToAlerts();
        }

        function goToPrivacyPolicy() {
            return Navigation.goToPrivacyPolicy();
        }

        function goToTermsOfUse() {
            return Navigation.goToTermsOfUse();
        }

        function goToTransactionActivity() {
            return Navigation.goToTransactionActivity();
        }

        function currentStateHasRoot(rootState) {
            return _.startsWith($state.current.name, rootState);
        }

        function getUnreadAlertsCount() {
            return AlertsManager.getUnreadAlertsCount();
        }
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();
