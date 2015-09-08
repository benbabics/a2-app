(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentManager($q, globals, $rootScope, moment, CommonService, Logger,
                            PaymentAddAvailabilityModel, PaymentModel, PaymentsResource) {
        // Private members
        var paymentAddAvailability = {},
            payments;

        // Revealed Public members
        var _ = CommonService._,
            service = {
            addPayment                 : addPayment,
            fetchPayment               : fetchPayment,
            fetchPaymentAddAvailability: fetchPaymentAddAvailability,
            fetchPayments              : fetchPayments,
            fetchScheduledPaymentsCount: fetchScheduledPaymentsCount,
            getPaymentAddAvailability  : getPaymentAddAvailability,
            getPayments                : getPayments,
            removePayment              : removePayment,
            setPaymentAddAvailability  : setPaymentAddAvailability,
            setPayments                : setPayments,
            updatePayment              : updatePayment
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
            payments = [];
        }

        function createPayment(paymentResource) {
            var paymentModel = new PaymentModel();
            paymentModel.set(paymentResource);

            return paymentModel;
        }

        function fetchPayment(paymentId) {
            return $q.when(_.find(payments, "id", paymentId));
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
                        // map the payment data to model objects
                        payments = _.map(paymentsResponse.data, createPayment);

                        return payments;
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from getting the Payments";
                        Logger.error(error);
                        throw new Error(error);
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

        function fetchScheduledPaymentsCount(accountId) {
            var searchOptions = globals.PAYMENT_LIST.SEARCH_OPTIONS;

            return fetchPayments(accountId, searchOptions.PAGE_NUMBER, searchOptions.PAGE_SIZE)
                .then(function(payments) {
                    if(payments) {
                        return _.reduce(payments, function(scheduledPaymentsCount, payment) {
                            if(payment.isScheduled()) {
                                ++scheduledPaymentsCount;
                            }

                            return scheduledPaymentsCount;
                        }, 0);
                    }
                    // no payments in response
                    else {
                        Logger.error("No payments returned from fetching Payments");
                        throw new Error("No payments returned from fetching Payments");
                    }
                })
                // get payments failed
                .catch(function(failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Getting scheduled payments count failed: " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });
        }


        function getPaymentAddAvailability() {
            return paymentAddAvailability;
        }

        function getPayments() {
            return payments;
        }

        function removePayment(accountId, paymentId) {
            return PaymentsResource.deletePayment(accountId, paymentId)
                .then(function () {
                    //remove the payment from the collection
                    _.remove(payments, function (payment) {
                        return payment.id === paymentId;
                    });
                })
                // deleting payment failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Removing a Payment failed: " + CommonService.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setPaymentAddAvailability(paymentAddAvailabilityInfo) {
            paymentAddAvailability = paymentAddAvailabilityInfo;
        }

        // Caution against using this as it replaces the object versus setting properties on it or extending it
        // suggested use for testing only
        function setPayments(paymentsInfo) {
            payments = paymentsInfo;
        }

        function updatePayment(accountId, payment) {
            var requestBody = {
                amount       : payment.amount,
                bankAccountId: payment.bankAccount.id,
                scheduledDate: moment(payment.scheduledDate).toISOString()
            };

            return PaymentsResource.postPayment(accountId, payment.id, requestBody)
                .then(function (postPaymentResponse) {
                    if (postPaymentResponse && postPaymentResponse.data) {
                        return createPayment(postPaymentResponse.data);
                    }
                    // no data in the response
                    else {
                        var error = "No data in Response from Updating a Payment";
                        Logger.error(error);
                        throw new Error(error);
                    }
                })
                // payment update failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    var error = "Updating a Payment failed: " + CommonService.getErrorMessage(failureResponse);
                    Logger.error(error);
                    throw new Error(error);
                });
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentManager", PaymentManager);
})();