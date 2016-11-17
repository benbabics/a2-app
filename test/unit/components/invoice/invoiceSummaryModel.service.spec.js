(function () {
    "use strict";

    describe("An Invoice Summary Model Service", function () {

        var account,
            InvoiceSummaryModel;

        beforeEach(inject(function (_InvoiceSummaryModel_) {
            InvoiceSummaryModel = _InvoiceSummaryModel_;

            account = new InvoiceSummaryModel();
        }));

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