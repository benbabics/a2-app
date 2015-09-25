(function () {
    "use strict";

    describe("An Invoice Summary Model Service", function () {

        var _,
            account;

        beforeEach(function () {
            module("app.shared");
            module("app.components.invoice");

            inject(function (CommonService, InvoiceSummaryModel) {
                _ = CommonService._;

                account = new InvoiceSummaryModel();
            });
        });

        describe("has a set function that", function () {

            var mockInvoiceSummaryResource = {
                    newField1         : "some value",
                    newField2         : "some other value",
                    newField3         : "yet another value",
                    accountNumber     : "account number value",
                    availableCredit   : "available credit value",
                    billingDate       : "available credit value",
                    billedAmount      : "available credit value",
                    closingDate       : "closing date value",
                    creditLimit     : "credit limit value",
                    currentBalance    : "current balance value",
                    currentBalanceAsOf: "current balance as of value",
                    invoiceId         : "invoice id value",
                    invoiceNumber     : "invoice number value",
                    minimumPaymentDue : "minimum payment due value",
                    paymentDueDate    : "payment due date value",
                    statementBalance: "statement balance value",
                    unbilledAmount  : "unbilled amount value"
                },
                invoiceSummaryModelKeys,
                invoiceSummaryResourceKeys;

            beforeEach(inject(function () {
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

        describe("has an isAllCreditAvailable function that", function () {

            describe("when the available credit is greater than the credit limit", function () {

                beforeEach(function () {
                    account.creditLimit = TestUtils.getRandomNumber(10.0, 9999.0);
                    account.availableCredit = TestUtils.getRandomNumber(account.creditLimit, 9999.99);
                });

                it("should return true", function () {
                    expect(account.isAllCreditAvailable()).toBeTruthy();
                });

            });

            describe("when the available credit is equal to the credit limit", function () {

                beforeEach(function () {
                    account.creditLimit = TestUtils.getRandomNumber(10.0, 9999.0);
                    account.availableCredit = account.creditLimit;
                });

                it("should return true", function () {
                    expect(account.isAllCreditAvailable()).toBeTruthy();
                });

            });

            describe("when the available credit is less than the credit limit", function () {

                beforeEach(function () {
                    account.creditLimit = TestUtils.getRandomNumber(10.0, 9999.0);
                    account.availableCredit = TestUtils.getRandomNumber(10.0, account.creditLimit);
                });

                it("should return false", function () {
                    expect(account.isAllCreditAvailable()).toBeFalsy();
                });

            });

        });

        describe("has an isAnyCreditAvailable function that", function () {

            describe("when the available credit is greater than 0", function () {

                beforeEach(function () {
                    account.availableCredit = TestUtils.getRandomNumber(account.creditLimit, 9999.99);
                });

                it("should return true", function () {
                    expect(account.isAnyCreditAvailable()).toBeTruthy();
                });

            });

            describe("when the available credit is equal to 0", function () {

                beforeEach(function () {
                    account.availableCredit = 0;
                });

                it("should return false", function () {
                    expect(account.isAnyCreditAvailable()).toBeFalsy();
                });

            });

            describe("when the available credit is less than 0", function () {

                beforeEach(function () {
                    account.availableCredit = -TestUtils.getRandomNumber(10.0, 9999.0);
                });

                it("should return false", function () {
                    expect(account.isAnyCreditAvailable()).toBeFalsy();
                });

            });

        });

    });

})();