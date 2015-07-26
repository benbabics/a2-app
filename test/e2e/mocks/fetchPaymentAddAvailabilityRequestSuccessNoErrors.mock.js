"use strict";

var FetchPaymentAddAvailabilityRequestSuccessNoErrorsMock = (function () {

    function FetchPaymentAddAvailabilityRequestSuccessNoErrorsMock() {
        angular.module("FetchPaymentAddAvailabilityRequestSuccessMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockFetchPaymentAddAvailabilityResponse = {
                    makePaymentAllowed: true,
                    shouldDisplayBankAccountSetupMessage: false,
                    shouldDisplayDirectDebitEnabledMessage: false,
                    shouldDisplayOutstandingPaymentMessage: false
                };

                $httpBackend.whenGET(/\/secure\/accounts\/[a-zA-Z0-9-]*\/payments\/makePaymentAvailability/).respond(function (method, url, data, headers) {
                    return [200, mockFetchPaymentAddAvailabilityResponse, {}];
                });
            });
    }

    return FetchPaymentAddAvailabilityRequestSuccessNoErrorsMock;

})();

module.exports = FetchPaymentAddAvailabilityRequestSuccessNoErrorsMock;