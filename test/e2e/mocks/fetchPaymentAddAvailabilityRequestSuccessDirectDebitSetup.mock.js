"use strict";

var FetchPaymentAddAvailabilityRequestSuccessDirectDebitSetupMock = (function () {

    function FetchPaymentAddAvailabilityRequestSuccessDirectDebitSetupMock() {
        angular.module("FetchPaymentAddAvailabilityRequestSuccessMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchPaymentAddAvailabilityResponse = {
                    makePaymentAllowed: false,
                    shouldDisplayBankAccountSetupMessage: false,
                    shouldDisplayDirectDebitEnabledMessage: true,
                    shouldDisplayOutstandingPaymentMessage: false
                };

                $httpBackend.whenGET(/\/secure\/accounts\/[a-zA-Z0-9-]*\/payments\/makePaymentAvailability/).respond(function (method, url, data, headers) {
                    return [200, mockFetchPaymentAddAvailabilityResponse, {}];
                });
            });
    }

    return FetchPaymentAddAvailabilityRequestSuccessDirectDebitSetupMock;

})();

module.exports = FetchPaymentAddAvailabilityRequestSuccessDirectDebitSetupMock;