(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentManager($q, CommonService, globals, Logger, MakePaymentAvailabilityModel, PaymentsResource) {
        // Private members
        var makePaymentAvailability = {};

        // Revealed Public members
        var service = {
            fetchMakePaymentAvailability: fetchMakePaymentAvailability,
            getMakePaymentAvailability  : getMakePaymentAvailability,
            setMakePaymentAvailability  : setMakePaymentAvailability
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            makePaymentAvailability = new MakePaymentAvailabilityModel();
        }

        function getMakePaymentAvailability() {
            return makePaymentAvailability;
        }

        function fetchMakePaymentAvailability(billingAccountId) {
            return $q.when(PaymentsResource.one(billingAccountId).makePaymentAvailability())
                .then(function (makePaymentAvailabilityResponse) {
                    if (makePaymentAvailabilityResponse && makePaymentAvailabilityResponse.data) {
                        setMakePaymentAvailability(makePaymentAvailabilityResponse.data);
                        return getMakePaymentAvailability();
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the Make Payment Availability");
                        throw new Error("No data in Response from getting the Make Payment Availability");
                    }
                })
                // get token failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Make Payment Availability failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });

        }

        function setMakePaymentAvailability(makePaymentAvailabilityInfo) {
            makePaymentAvailability = makePaymentAvailabilityInfo;
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentManager", PaymentManager);
})();