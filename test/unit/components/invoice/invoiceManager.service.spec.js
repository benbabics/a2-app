(function () {
    "use strict";

    var $q,
        $rootScope,
        CURRENT_INVOICE_SUMMARY_URL,
        billingAccountId = "141v51235",
        getCurrentInvoiceSummaryDeferred,
        resolveHandler,
        rejectHandler,
        AccountModel,
        InvoiceManager,
        InvoicesResource,
        InvoicesResourceOne,
        remoteInvoiceSummary = {};

    describe("An Invoice Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.account");
            module("app.components.invoice");

            // mock dependencies
            InvoicesResource = jasmine.createSpyObj("InvoicesResource", ["one"]);

            module(function ($provide) {
                $provide.value("InvoicesResource", InvoicesResource);
            });

            remoteInvoiceSummary = jasmine.createSpyObj("InvoiceSummaryModel", ["InvoiceSummaryModel", "set"]);

            inject(function (_$q_, _$rootScope_, _AccountModel_, globals, _InvoiceManager_, InvoiceSummaryModel) {
                remoteInvoiceSummary = new InvoiceSummaryModel();

                $q = _$q_;
                $rootScope = _$rootScope_;
                AccountModel = _AccountModel_;
                InvoiceManager = _InvoiceManager_;
                InvoiceManager.setInvoiceSummary(remoteInvoiceSummary);

                CURRENT_INVOICE_SUMMARY_URL = billingAccountId + "/" + globals.ACCOUNT_MAINTENANCE_API.INVOICES.CURRENT_INVOICE_SUMMARY;
            });

            // set up spies
            InvoicesResourceOne = jasmine.createSpyObj("InvoicesResourceOne", ["doGET"]);
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            InvoicesResource.one.and.returnValue(InvoicesResourceOne);
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a retrieveCurrentInvoiceSummary function that", function () {

            var mockResponse = {
                    data: {
                        accountNumber     : "account number value",
                        availableCredit   : "available credit value",
                        closingDate       : "closing date value",
                        currentBalance    : "current balance value",
                        currentBalanceAsOf: "current balance as of value",
                        invoiceId         : "invoice id value",
                        invoiceNumber     : "invoice number value",
                        minimumPaymentDue : "minimum payment due value",
                        paymentDueDate    : "payment due date value"
                    }
                };


            beforeEach(function () {
                getCurrentInvoiceSummaryDeferred = $q.defer();

                InvoicesResourceOne.doGET.and.returnValue(getCurrentInvoiceSummaryDeferred.promise);

                InvoiceManager.setInvoiceSummary(null);

                InvoiceManager.retrieveCurrentInvoiceSummary(billingAccountId)
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting a details of the current invoice summary", function () {

                it("should call InvoicesResource.one", function () {
                    expect(InvoicesResource.one).toHaveBeenCalledWith();
                });

                it("should call InvoicesResourceOne.doGET with the correct URL", function () {
                    expect(InvoicesResourceOne.doGET).toHaveBeenCalledWith(CURRENT_INVOICE_SUMMARY_URL);
                });

            });

            describe("when the current invoice summary is retrieved successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getCurrentInvoiceSummaryDeferred.resolve(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should set the invoice summary", function () {
                        expect(InvoiceManager.getInvoiceSummary()).toEqual(mockResponse.data);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockResponse.data);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getCurrentInvoiceSummaryDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT update the invoice summary", function () {
                        expect(InvoiceManager.getInvoiceSummary()).toBeNull();
                    });

                });
            });

            describe("when retrieving the current invoice summary fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getCurrentInvoiceSummaryDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should NOT update the invoice summary", function () {
                    expect(InvoiceManager.getInvoiceSummary()).toBeNull();
                });

            });

        });

        describe("has a getInvoiceSummary function that", function () {

            var newInvoiceSummary = {
                accountNumber     : "account number value",
                availableCredit   : "available credit value",
                closingDate       : "closing date value",
                currentBalance    : "current balance value",
                currentBalanceAsOf: "current balance as of value",
                invoiceId         : "invoice id value",
                invoiceNumber     : "invoice number value",
                minimumPaymentDue : "minimum payment due value",
                paymentDueDate    : "payment due date value"
            };

            it("should return the invoice summary passed to setInvoiceSummary", function () {
                var result;

                InvoiceManager.setInvoiceSummary(newInvoiceSummary);
                result = InvoiceManager.getInvoiceSummary();

                expect(result).toEqual(newInvoiceSummary);
            }) ;

            // TODO: figure out how to test this without using setInvoiceSummary
        });

        describe("has a setInvoiceSummary function that", function () {

            var newInvoiceSummary = {
                accountNumber     : "account number value",
                availableCredit   : "available credit value",
                closingDate       : "closing date value",
                currentBalance    : "current balance value",
                currentBalanceAsOf: "current balance as of value",
                invoiceId         : "invoice id value",
                invoiceNumber     : "invoice number value",
                minimumPaymentDue : "minimum payment due value",
                paymentDueDate    : "payment due date value"
            };

            it("should update the invoice summary returned by getInvoiceSummary", function () {
                var result;

                InvoiceManager.setInvoiceSummary(newInvoiceSummary);
                result = InvoiceManager.getInvoiceSummary();

                expect(result).toEqual(newInvoiceSummary);
            }) ;

            // TODO: figure out how to test this without using getInvoiceSummary
        });

    });

})();