"use strict";

var FetchMakePaymentAvailabilityRequestSuccessDirectDebitSetupMock = (function () {

    function FetchMakePaymentAvailabilityRequestSuccessDirectDebitSetupMock() {
        angular.module("FetchMakePaymentAvailabilityRequestSuccessMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchMakePaymentAvailabilityResponse = {
                    makePaymentAllowed: false,
                    shouldDisplayBankAccountSetupMessage: false,
                    shouldDisplayDirectDebitEnabledMessage: true,
                    shouldDisplayOutstandingPaymentMessage: false
                };

                $httpBackend.whenGET(/\/secure\/accounts\/[a-zA-Z0-9-]*\/payments\/makePaymentAvailability/).respond(function (method, url, data, headers) {
                    return [200, mockFetchMakePaymentAvailabilityResponse, {}];
                });
            });
    }

    return FetchMakePaymentAvailabilityRequestSuccessDirectDebitSetupMock;

})();

module.exports = FetchMakePaymentAvailabilityRequestSuccessDirectDebitSetupMock;