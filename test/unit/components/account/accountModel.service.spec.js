(function () {
    "use strict";

    describe("An Account Model Service", function () {

        var _,
            ShippingMethodModel,
            account;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");

            inject(function (___, AccountModel, AddressModel, ShippingCarrierModel, _ShippingMethodModel_) {
                _ = ___;
                ShippingMethodModel = _ShippingMethodModel_;

                account = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
            });
        });

        describe("has a set function that", function () {

            var mockAccountResource,
                accountModelKeys,
                accountResourceKeys;

            beforeEach(inject(function (AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel) {
                account = new AccountModel();

                mockAccountResource = angular.extend(TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

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

        describe("has a hasRegularShippingMethod method that", function () {

            describe("when the cardShippingCarrier has a Regular shipping method", function () {

                beforeEach(function () {
                    account.cardShippingCarrier.shippingMethods.push(account.regularCardShippingMethod);
                });

                it("should return true", function () {
                    expect(account.hasRegularShippingMethod()).toBeTruthy();
                });
            });

            describe("when the cardShippingCarrier does NOT have a Regular shipping method", function () {

                beforeEach(function () {
                    _.remove(account.cardShippingCarrier.shippingMethods, {id: account.regularCardShippingMethod.id});
                });

                it("should return false", function () {
                    expect(account.hasRegularShippingMethod()).toBeFalsy();
                });
            });
        });

    });

})();