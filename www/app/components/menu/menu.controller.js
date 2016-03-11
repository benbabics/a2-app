(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function MenuController($location, $q, $state, $ionicSideMenuDelegate, globals, LoginManager) {

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

        function closeMenu() {
            $ionicSideMenuDelegate.toggleRight(false);
        }

        function goToHome() {
            return $state.go("landing");
        }

        function goToMakePayment() {
            $location.url("/payment/add/verify");

            return $q.resolve();
        }

        function goToPaymentActivity() {
            return $state.go("payment.list.view");
        }

        function goToTransactionActivity() {
            return $state.go("transaction.list");
        }

        function goToCards() {
            return $state.go("card.list");
        }

        function goToContactUs() {
            return $state.go("contactUs");
        }

        function goToTermsOfUse() {
            return $state.go("termsOfUse");
        }

        function goToPrivacyPolicy() {
            return $state.go("privacyPolicy");
        }

        function goToLogOut() {
            return LoginManager.logOut()
                .finally(function () {
                    return $state.go(globals.LOGIN_STATE);
                });
        }
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();
