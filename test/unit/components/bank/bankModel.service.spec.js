(function () {
    "use strict";

    describe("A Bank Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.bank");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var bank,
                mockBankResource = {
                    newField1  : "some value",
                    newField2  : "some other value",
                    newField3  : "yet another value",
                    id         : "bank id value",
                    defaultBank: true,
                    name       : "company name value"
                },
                bankModelKeys,
                bankResourceKeys;

            beforeEach(inject(function (BankModel) {
                bank = new BankModel();

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

    });

})();