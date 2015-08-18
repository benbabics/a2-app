(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentManager($rootScope, moment, CommonService, Logger, PaymentAddAvailabilityModel, PaymentModel, PaymentsResource) {
        // Private members
        var paymentAddAvailability = {};

        // Revealed Public members
        var service = {
            addPayment                 : addPayment,
            fetchPayment               : fetchPayment,
            fetchPaymentAddAvailability: fetchPaymentAddAvailability,
            fetchPayments              : fetchPayments,
            getPaymentAddAvailability  : getPaymentAddAvailability,
            setPaymentAddAvailability  : setPaymentAddAvailability
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            $rootScope.$on("userLoggedOut", clearCachedValues);

            clearCachedValues();
        }

        function addPayment(accountId, payment) {
            var requestBody = {
                amount: payment.amount,
                bankAccountId: payment.bankAccount.id,
                scheduledDate: moment(payment.scheduledDate).toISOString()
            };

            return PaymentsResource.addPayment(accountId, requestBody)
                .then(function (addPaymentResponse) {
                    if (addPaymentResponse && addPaymentResponse.data) {
                        return createPayment(addPaymentResponse.data);
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from Adding a Payment");
                        throw new Error("No data in Response from Adding a Payment");
                    }
                })
                // payment add failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Adding a Payment failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });

        }

        function clearCachedValues() {
            paymentAddAvailability = new PaymentAddAvailabilityModel();
        }

        function createPayment(paymentResource) {
            var paymentModel = new PaymentModel();
            paymentModel.set(paymentResource);

            return paymentModel;
        }

        function getPaymentAddAvailability() {
            return paymentAddAvailability;
        }

        function fetchPayment(accountId, paymentId) {
            return PaymentsResource.getPayment(accountId, paymentId)
                .then(function (paymentResponse) {
                    if (paymentResponse && paymentResponse.data) {
                        return createPayment(paymentResponse.data);
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting a Payment");
                        throw new Error("No data in Response from getting a Payment");
                    }
                })
                // getting payment failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting a Payment failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function fetchPaymentAddAvailability(accountId) {
            return PaymentsResource.getPaymentAddAvailability(accountId)
                .then(function (paymentAddAvailabilityResponse) {
                    if (paymentAddAvailabilityResponse && paymentAddAvailabilityResponse.data) {
                        getPaymentAddAvailability().set(paymentAddAvailabilityResponse.data);
                        return getPaymentAddAvailability();
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the Payment Add Availability");
                        throw new Error("No data in Response from getting the Payment Add Availability");
                    }
                })
                // getting payment add availability failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Payment Add Availability failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function fetchPayments(accountId, pageNumber, pageSize) {
            var params = {
                pageNumber: pageNumber,
                pageSize  : pageSize
            };

            return PaymentsResource.getPayments(accountId, params)
                .then(function (paymentsResponse) {
                    if (paymentsResponse && paymentsResponse.data) {
                        var paymentModelCollection = {};

                        _.forEach(paymentsResponse.data, function (payment) {
                            paymentModelCollection[payment.id] = createPayment(payment);
                        });

                        return paymentModelCollection;
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the Payments");
                        throw new Error("No data in Response from getting the Payments");
                    }
                })
                // get payments failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting Payments failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setPaymentAddAvailability(paymentAddAvailabilityInfo) {
            paymentAddAvailability = paymentAddAvailabilityInfo;
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentManager", PaymentManager);
})();