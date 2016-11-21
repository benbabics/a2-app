(function () {
    "use strict";

    describe("A Bank Model Service", function () {

        var bank;

        beforeEach(function () {

            inject(function (BankModel) {
                bank = new BankModel();
            });
        });

        describe("has a getDisplayName function that", function () {

            describe("when the name and last four have values", function () {
                beforeEach(function () {
                    bank.name = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    bank.lastFourDigits = TestUtils.getRandomNumberWithLength(4);
                });

                it("should return the Bank Name + Last Four Digits", function () {
                    expect(bank.getDisplayName()).toEqual(bank.name + " " + bank.lastFourDigits);
                });
            });

            describe("when the name is empty", function () {
                beforeEach(function () {
                    bank.name = "";
                    bank.lastFourDigits = TestUtils.getRandomNumberWithLength(4);
                });

                it("should return the Last Four Digits", function () {
                    expect(bank.getDisplayName()).toEqual(bank.lastFourDigits);
                });
            });

            describe("when the name is null", function () {
                beforeEach(function () {
                    bank.name = null;
                    bank.lastFourDigits = TestUtils.getRandomNumberWithLength(4);
                });

                it("should return the Last Four Digits", function () {
                    expect(bank.getDisplayName()).toEqual(bank.lastFourDigits);
                });
            });

            describe("when the name is undefined", function () {
                beforeEach(function () {
                    delete bank.name;
                    bank.lastFourDigits = TestUtils.getRandomNumberWithLength(4);
                });

                it("should return the Last Four Digits", function () {
                    expect(bank.getDisplayName()).toEqual(bank.lastFourDigits);
                });
            });

        });

    });

})();