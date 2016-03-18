(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function Navigation($ionicHistory, $location, $q, $state, globals, ElementUtil, LoginManager) {
        var service = {
            exitApp                : exitApp,
            goToBackState          : goToBackState,
            goToCards              : goToCards,
            goToContactUs          : goToContactUs,
            goToHome               : goToHome,
            goToLogOut             : goToLogOut,
            goToMakePayment        : goToMakePayment,
            goToPaymentActivity    : goToPaymentActivity,
            goToPrivacyPolicy      : goToPrivacyPolicy,
            goToTermsOfUse         : goToTermsOfUse,
            goToTransactionActivity: goToTransactionActivity
        };

        return service;
        //////////////////////

        function exitApp() {
            //close the app (this does not work on iOS since it does not allow apps to close themselves)
            if (navigator.app) {
                navigator.app.exitApp();
            }

            //app couldn't be closed (i.e. on iOS or a browser, so just go back to the login page)
            $state.go(globals.LOGIN_STATE);
        }

        /**
         * Goes to the back state specified by a given back button.
         *
         * @param {jqLite} [backButton] The back button to use (default: the active back button)
         * @return {Boolean} True if the call is successful
         * @throws {Error} Throws error if the back button couldn't be found
         */
        function goToBackState(backButton) {
            var backButtonScope;

            backButton = backButton || ElementUtil.findActiveBackButton();

            //if there is a back button, call its goBack function
            if (backButton) {
                backButtonScope = backButton.isolateScope();
                if (backButtonScope) {
                    backButtonScope.goBack();
                    return true;
                }
            }

            return false;
        }

        function goToCards() {
            //Note: for some reason the controller won't get reinitialized unless we call $ionicHistory.clearCache
            return $ionicHistory.clearCache()
                .then(function () {
                    return $state.go("card.list", null, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });
        }

        function goToContactUs() {
            return $state.go("contactUs");
        }

        function goToHome() {
            return $state.go("landing");
        }

        function goToLogOut() {
            return LoginManager.logOut()
                .finally(function () {
                    return $state.go(globals.LOGIN_STATE);
                });
        }

        function goToMakePayment() {
            $location.url("/payment/add/verify");

            return $q.resolve();
        }

        function goToPaymentActivity() {
            //Note: for some reason the controller won't get reinitialized unless we call $ionicHistory.clearCache
            return $ionicHistory.clearCache()
                .then(function () {
                    return $state.go("payment.list.view", null, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });
        }

        function goToPrivacyPolicy() {
            return $state.go("privacyPolicy");
        }

        function goToTermsOfUse() {
            return $state.go("termsOfUse");
        }

        function goToTransactionActivity() {
            //Note: for some reason the controller won't get reinitialized unless we call $ionicHistory.clearCache
            return $ionicHistory.clearCache()
                .then(function () {
                    return $state.go("transaction.list", null, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });
        }
    }

    angular
        .module("app.components.navigation")
        .factory("Navigation", Navigation);
})();
