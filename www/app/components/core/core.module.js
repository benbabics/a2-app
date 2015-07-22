(function () {
    "use strict";

    function coreRun($rootScope, $state, globals, AuthenticationManager, CommonService, PaymentManager, UserManager) {
        var hasFetchedMakePaymentAvailability = false;

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
                    // Try with $urlRouterProvider.when like MCA has in cards.route

                    // Basically we need to verify the account is setup correctly to make a payment online which
                    // requires a REST call. We are preventing the route from continuing, making the REST call, then
                    // either showing a popup if there's an issue or going to the payment add page if all is good.
                    // The hasFetchedMakePaymentAvailability variable is just a flag to avoid an infinite loop
                    if (!hasFetchedMakePaymentAvailability) {
                        // do not allow proceeding to the payment add page until after the REST call has completed
                        // and the setup has been verified
                        event.preventDefault();

                        fetchMakePaymentAvailability()
                            .then(function (makePaymentAvailability) {
                                // set to true so that the state.go can skip the fetch
                                hasFetchedMakePaymentAvailability = true;

                                // No problems we're worried about here so go to the payment add page
                                $state.go(stateName);
                            });
                    }
                    else {
                        // set to false so that the next time we go to this page we have to re-fetch the data
                        hasFetchedMakePaymentAvailability = false;
                    }
                }
            }
        }

        $rootScope.$on("$stateChangeStart", validateRoutePreconditions);
    }

    angular.module("app.components.core", [])
        .run(coreRun);
})();
