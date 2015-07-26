(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentManager($q, CommonService, Logger, PaymentAddAvailabilityModel, PaymentsResource) {
        // Private members
        var paymentAddAvailability = {};

        // Revealed Public members
        var service = {
            fetchPaymentAddAvailability: fetchPaymentAddAvailability,
            getPaymentAddAvailability  : getPaymentAddAvailability,
            setPaymentAddAvailability  : setPaymentAddAvailability
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            paymentAddAvailability = new PaymentAddAvailabilityModel();
        }

        function getPaymentAddAvailability() {
            return paymentAddAvailability;
        }

        function fetchPaymentAddAvailability(billingAccountId) {
            return $q.when(PaymentsResource.one(billingAccountId).paymentAddAvailability())
                .then(function (paymentAddAvailabilityResponse) {
                    if (paymentAddAvailabilityResponse && paymentAddAvailabilityResponse.data) {
                        setPaymentAddAvailability(paymentAddAvailabilityResponse.data);
                        return getPaymentAddAvailability();
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the Payment Add Availability");
                        throw new Error("No data in Response from getting the Payment Add Availability");
                    }
                })
                // get token failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Payment Add Availability failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });

        }

        function setPaymentAddAvailability(paymentAddAvailabilityInfo) {
            paymentAddAvailability = paymentAddAvailabilityInfo;
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentManager", PaymentManager);
})();