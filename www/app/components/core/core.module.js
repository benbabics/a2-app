(function () {
    "use strict";

    function coreRun($rootScope, $state, globals, AuthenticationManager, CommonService, PaymentManager, UserManager) {
        var bypass = false;

        function isLoginPage(stateName) {
            return "user.auth.login" === stateName;
        }

        function isPaymentAddPage(stateName) {
            return "payment.add" === stateName;
        }

        function fetchMakePaymentAvailability() {
            var billingAccountId;

            CommonService.loadingBegin();

            billingAccountId = UserManager.getUser().billingCompany.accountId;

            // Return the make payment availability
            return PaymentManager.fetchMakePaymentAvailability(billingAccountId)
                .finally(function() {
                    CommonService.loadingComplete();
                });

        }

        function displayPopup(message) {
            CommonService.displayAlert({
                cssClass: "wex-warning-popup",
                content: message,
                buttonCssClass: "button-submit"
            });
        }

        function validateRoutePreconditions(event, toState, toParams, fromState, fromParams) {

            var stateName = toState.name;

            if (!isLoginPage(stateName)) {
                // when navigating to any page that isn't the login page, validate that the user is logged in
                if (!AuthenticationManager.userLoggedIn()) {
                    // user is not logged in and is not trying to access the login page so redirect to the login page
                    event.preventDefault();
                    $state.go("user.auth.login");
                }
                else if (isPaymentAddPage(stateName)) {
                    // Sorry for the hack. We'll try to address if possible
                    // Not a fan of this solution but this is the best of the bunch I found online.
                    // Tried using $urlRouterProvider.when(), but that seems to still change the state even when
                    // the handler reports that the state change was handled and it only seemed to work with href
                    // rather than ui-sref.

                    // Basically we need to verify the account is setup correctly to make a payment online which
                    // requires a REST call. We are preventing the route from continuing, making the REST call, then
                    // either showing a popup if there's an issue or going to the payment add page if all is good.
                    // The bypass variable is just a flag to to indicate that the data has been fetched recently and
                    // to allow the state change to proceed

                    if (bypass) {
                        // set to false so that the next time we go to this page we have to re-fetch the data
                        bypass = false;
                        return;
                    }

                    // do not allow proceeding to the payment add page until after the REST call has completed
                    // and the setup has been verified
                    event.preventDefault();

                    fetchMakePaymentAvailability()
                        .then(function (makePaymentAvailability) {
                            if (makePaymentAvailability.shouldDisplayBankAccountSetupMessage) {
                                displayPopup(globals.MAKE_PAYMENT.WARNINGS.BANK_ACCOUNTS_NOT_SETUP);
                            }
                            else if (makePaymentAvailability.shouldDisplayDirectDebitEnabledMessage) {
                                displayPopup(globals.MAKE_PAYMENT.WARNINGS.DIRECT_DEBIT_SETUP);
                            }
                            else {
                                // set to true so that the following state.go can skip the fetch
                                bypass = true;

                                // No problems we're worried about here so go to the payment add page
                                $state.go(toState, toParams);
                            }
                        });
                }
            }
        }

        function pauseApplication() {
            // log out the user
            AuthenticationManager.logOut();
        }

        function resumeApplication() {
            $state.go("user.auth.login");
        }

        $rootScope.$on("$stateChangeStart", validateRoutePreconditions);
        $rootScope.$on("cordovaPause", pauseApplication);
        $rootScope.$on("cordovaResume", resumeApplication);
    }

    angular.module("app.components.core", [])
        .run(coreRun);
})();
