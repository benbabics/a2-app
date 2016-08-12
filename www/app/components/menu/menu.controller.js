(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function MenuController(_, $ionicSideMenuDelegate, $state, globals, Navigation) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;

        vm.closeMenu = closeMenu;
        vm.goToHome = goToHome;
        vm.goToMakePayment = goToMakePayment;
        vm.goToPaymentActivity = goToPaymentActivity;
        vm.goToTransactionActivity = goToTransactionActivity;
        vm.goToCards = goToCards;
        vm.goToContactUs = goToContactUs;
        vm.goToTermsOfUse = goToTermsOfUse;
        vm.goToPrivacyPolicy = goToPrivacyPolicy;
        vm.goToLogOut = goToLogOut;
        vm.currentStateHasRoot = currentStateHasRoot;

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
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();
