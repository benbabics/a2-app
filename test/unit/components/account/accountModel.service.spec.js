(function () {
    "use strict";

    describe("An Account Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var account,
                mockAccountResource = {
                    newField1    : "some value",
                    newField2    : "some other value",
                    newField3    : "yet another value",
                    accountId    : "company account id value",
                    accountNumber: "company account number value",
                    name         : "company name value"
                },
                accountModelKeys,
                accountResourceKeys;

            beforeEach(inject(function (AccountModel) {
                account = new AccountModel();

                // set all values to "default" to more easily detect any changes
                for (var property in account) {
                    if (_.has(account, property)) {
                        account[property] = "default";
                    }
                }

                accountModelKeys = _.keys(account);
                accountResourceKeys = _.keys(mockAccountResource);
            }));

            it("should set the AccountModel object with the fields from the passed in accountResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(accountModelKeys, accountResourceKeys);

                account.set(mockAccountResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(account[key]).toEqual(mockAccountResource[key]);
                }
            });

            it("should NOT change the AccountModel object fields that the accountResource object does not have", function () {
                var key,
                    keysDifference = _.difference(accountModelKeys, accountResourceKeys);

                account.set(mockAccountResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(account[key]).toEqual("default");
                }
            });

            it("should extend the AccountModel object with the fields from the passed in accountResource object that the AccountModel does not have", function () {
                var key,
                    keysDifference = _.difference(accountResourceKeys, accountModelKeys);

                account.set(mockAccountResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(account, key)).toBeTruthy();
                    expect(account[key]).toEqual(mockAccountResource[key]);
                }
            });

        });

    });

})();