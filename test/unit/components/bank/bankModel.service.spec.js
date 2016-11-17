(function () {
    "use strict";

    describe("A Bank Model Service", function () {

        var _,
            bank;

        beforeEach(function () {

            inject(function (___, BankModel) {
                _ = ___;
                bank = new BankModel();
            });
        });

        describe("has a set function that", function () {

            var mockBankResource = {
                    newField1     : "some value",
                    newField2     : "some other value",
                    newField3     : "yet another value",
                    id            : "bank id value",
                    defaultBank   : true,
                    lastFourDigits: 1234,
                    name          : "company name value"
                },
                bankModelKeys,
                bankResourceKeys;

            beforeEach(inject(function () {
                // set all values to "default" to more easily detect any changes
                for (var property in bank) {
                    if (_.has(bank, property)) {
                        bank[property] = "default";
                    }
                }

                bankModelKeys = _.keys(bank);
                bankResourceKeys = _.keys(mockBankResource);
            }));

            it("should set the BankModel object with the fields from the passed in bankResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(bankModelKeys, bankResourceKeys);

                bank.set(mockBankResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(bank[key]).toEqual(mockBankResource[key]);
                }
            });

            it("should NOT change the BankModel object fields that the bankResource object does not have", function () {
                var key,
                    keysDifference = _.difference(bankModelKeys, bankResourceKeys);

                bank.set(mockBankResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(bank[key]).toEqual("default");
                }
            });

            it("should extend the BankModel object with the fields from the passed in bankResource object that the BankModel does not have", function () {
                var key,
                    keysDifference = _.difference(bankResourceKeys, bankModelKeys);

                bank.set(mockBankResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(bank, key)).toBeTruthy();
                    expect(bank[key]).toEqual(mockBankResource[key]);
                }
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