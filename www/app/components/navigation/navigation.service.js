(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function Navigation($ionicHistory, $location, $q, $state, globals, LoginManager) {
        var service = {
            goToCards              : goToCards,
            goToContactUs          : goToContactUs,
            goToHome               : goToHome,
            goToLogOut             : goToLogOut,
            goToMakePayment        : goToMakePayment,
            goToPaymentActivity    : goToPaymentActivity,
            goToPrivacyPolicy      : goToPrivacyPolicy,
            goToTermsOfUse         : goToTermsOfUse,
            goToTransactionActivity: goToTransactionActivity,
            isSecuredState         : isSecuredState
        };

        return service;
        //////////////////////

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

        function isSecuredState(stateName) {
            //TODO - Make this a list somewhere

            return globals.LOGIN_STATE !== stateName &&
                "version.status" !== stateName &&
                "app.exit" !== stateName;
        }
    }

    angular
        .module("app.components.navigation")
        .factory("Navigation", Navigation);
})();
