"use strict";

var RetrieveCurrentInvoiceSummaryRequestSuccessMock = (function () {

    function RetrieveCurrentInvoiceSummaryRequestSuccessMock() {
        angular.module("RetrieveCurrentInvoiceSummaryMock", ["app", "ngMockE2E"])
            .run(function ($httpBackend) {

                var mockRetrieveCurrentInvoiceSummaryResponse = {
                    accountNumber     : "5v661356",
                    availableCredit   : "350.29",
                    closingDate       : "2015-07-15",
                    currentBalance    : "9649.71",
                    currentBalanceAsOf: "2015-06-30",
                    invoiceId         : "3673672",
                    invoiceNumber     : "367367367376",
                    minimumPaymentDue : "200.00",
                    paymentDueDate    : "2015-07-31"
                };

                $httpBackend.whenGET(/\/secure\/accounts\/[a-zA-Z0-9-]*\/payments\/currentInvoiceSummary/).respond(function (method, url, data, headers) {
                    return [200, mockRetrieveCurrentInvoiceSummaryResponse, {}];
                });
            });
    }

    return RetrieveCurrentInvoiceSummaryRequestSuccessMock;

})();

module.exports = RetrieveCurrentInvoiceSummaryRequestSuccessMock;