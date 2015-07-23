"use strict";

var FetchMakePaymentAvailabilityRequestSuccessBanksNotSetupMock = (function () {

    function FetchMakePaymentAvailabilityRequestSuccessBanksNotSetupMock() {
        angular.module("FetchMakePaymentAvailabilityRequestSuccessMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchMakePaymentAvailabilityResponse = {
                    makePaymentAllowed: false,
                    shouldDisplayBankAccountSetupMessage: true,
                    shouldDisplayDirectDebitEnabledMessage: false,
                    shouldDisplayOutstandingPaymentMessage: false
                };

                $httpBackend.whenGET(/\/secure\/accounts\/[a-zA-Z0-9-]*\/payments\/makePaymentAvailability/).respond(function (method, url, data, headers) {
                    return [200, mockFetchMakePaymentAvailabilityResponse, {}];
                });
            });
    }

    return FetchMakePaymentAvailabilityRequestSuccessBanksNotSetupMock;

})();

module.exports = FetchMakePaymentAvailabilityRequestSuccessBanksNotSetupMock;