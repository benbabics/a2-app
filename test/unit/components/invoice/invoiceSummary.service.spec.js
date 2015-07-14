(function () {
    "use strict";

    describe("An Invoice Summary Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.invoice");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var account,
                mockInvoiceSummaryResource = {
                    newField1         : "some value",
                    newField2         : "some other value",
                    newField3         : "yet another value",
                    accountNumber     : "account number value",
                    availableCredit   : "available credit value",
                    closingDate       : "closing date value",
                    currentBalance    : "current balance value",
                    currentBalanceAsOf: "current balance as of value",
                    invoiceId         : "invoice id value",
                    invoiceNumber     : "invoice number value",
                    minimumPaymentDue : "minimum payment due value",
                    paymentDueDate    : "payment due date value"
                },
                invoiceSummaryModelKeys,
                invoiceSummaryResourceKeys;

            beforeEach(inject(function (InvoiceSummaryModel) {
                account = new InvoiceSummaryModel();

                // set all values to "default" to more easily detect any changes
                for (var property in account) {
                    if (_.has(account, property)) {
                        account[property] = "default";
                    }
                }

                invoiceSummaryModelKeys = _.keys(account);
                invoiceSummaryResourceKeys = _.keys(mockInvoiceSummaryResource);
            }));

            it("should set the InvoiceSummaryModel object with the fields from the passed in invoiceSummaryResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(invoiceSummaryModelKeys, invoiceSummaryResourceKeys);

                account.set(mockInvoiceSummaryResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(account[key]).toEqual(mockInvoiceSummaryResource[key]);
                }
            });

            it("should NOT change the InvoiceSummaryModel object fields that the invoiceSummaryResource object does not have", function () {
                var key,
                    keysDifference = _.difference(invoiceSummaryModelKeys, invoiceSummaryResourceKeys);

                account.set(mockInvoiceSummaryResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(account[key]).toEqual("default");
                }
            });

            it("should extend the InvoiceSummaryModel object with the fields from the passed in invoiceSummaryResource object that the InvoiceSummaryModel does not have", function () {
                var key,
                    keysDifference = _.difference(invoiceSummaryResourceKeys, invoiceSummaryModelKeys);

                account.set(mockInvoiceSummaryResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(account, key)).toBeTruthy();
                    expect(account[key]).toEqual(mockInvoiceSummaryResource[key]);
                }
            });

        });

    });

})();