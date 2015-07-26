"use strict";

var FetchPaymentAddAvailabilityRequestSuccessBanksNotSetupMock = (function () {

    function FetchPaymentAddAvailabilityRequestSuccessBanksNotSetupMock() {
        angular.module("FetchPaymentAddAvailabilityRequestSuccessMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchPaymentAddAvailabilityResponse = {
                    makePaymentAllowed: false,
                    shouldDisplayBankAccountSetupMessage: true,
                    shouldDisplayDirectDebitEnabledMessage: false,
                    shouldDisplayOutstandingPaymentMessage: false
                };

                $httpBackend.whenGET(/\/secure\/accounts\/[a-zA-Z0-9-]*\/payments\/makePaymentAvailability/).respond(function (method, url, data, headers) {
                    return [200, mockFetchPaymentAddAvailabilityResponse, {}];
                });
            });
    }

    return FetchPaymentAddAvailabilityRequestSuccessBanksNotSetupMock;

})();

module.exports = FetchPaymentAddAvailabilityRequestSuccessBanksNotSetupMock;