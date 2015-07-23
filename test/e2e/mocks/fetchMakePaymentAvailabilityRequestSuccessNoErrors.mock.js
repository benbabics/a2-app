"use strict";

var FetchMakePaymentAvailabilityRequestSuccessNoErrorsMock = (function () {

    function FetchMakePaymentAvailabilityRequestSuccessNoErrorsMock() {
        angular.module("FetchMakePaymentAvailabilityRequestSuccessMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchMakePaymentAvailabilityResponse = {
                    makePaymentAllowed: true,
                    shouldDisplayBankAccountSetupMessage: false,
                    shouldDisplayDirectDebitEnabledMessage: false,
                    shouldDisplayOutstandingPaymentMessage: false
                };

                $httpBackend.whenGET(/\/secure\/accounts\/[a-zA-Z0-9-]*\/payments\/makePaymentAvailability/).respond(function (method, url, data, headers) {
                    return [200, mockFetchMakePaymentAvailabilityResponse, {}];
                });
            });
    }

    return FetchMakePaymentAvailabilityRequestSuccessNoErrorsMock;

})();

module.exports = FetchMakePaymentAvailabilityRequestSuccessNoErrorsMock;