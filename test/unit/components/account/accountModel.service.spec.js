(function () {
    "use strict";

    describe("An Account Model Service", function () {

        var _,
            ShippingMethodModel,
            account;

        beforeEach(function () {

            inject(function (___, AccountModel, AddressModel, ShippingCarrierModel, _ShippingMethodModel_) {
                _ = ___;
                ShippingMethodModel = _ShippingMethodModel_;

                account = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
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