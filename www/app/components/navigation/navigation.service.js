(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:7

    /* @ngInject */
    function Navigation(_, $ionicHistory, $location, $q, $state, globals, LoginManager) {
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
            isUnsecuredState       : isUnsecuredState
        };

        return service;
        //////////////////////

        function goToCards(params) {
            //Note: for some reason the controller won't get reinitialized unless we call $ionicHistory.clearCache
            return $ionicHistory.clearCache()
                .then(function () {
                    return $state.go("card.list", params, {
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

        function goToLogOut(params) {
            return LoginManager.logOut()
                .finally(function () {
                    return $state.go(globals.LOGIN_STATE, params);
                });
        }

        function goToMakePayment() {
            $location.url("/payment/add/verify");

            return $q.resolve();
        }

        function goToPaymentActivity(params) {
            //Note: for some reason the controller won't get reinitialized unless we call $ionicHistory.clearCache
            return $ionicHistory.clearCache()
                .then(function () {
                    return $state.go("payment.list.view", params, {
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

        function goToTransactionActivity(params) {
            //Note: for some reason the controller won't get reinitialized unless we call $ionicHistory.clearCache
            return $ionicHistory.clearCache()
                .then(function () {
                    return $state.go("transaction.list", params, {
                        reload : true,
                        inherit: false,
                        notify : true
                    });
                });
        }

        function isUnsecuredState(stateName) {
            // Login state by nature is unsecure
            return globals.LOGIN_STATE === stateName || _.includes(globals.UNSECURE_STATES, stateName);
        }
    }

    angular
        .module("app.components.navigation")
        .factory("Navigation", Navigation);
})();
