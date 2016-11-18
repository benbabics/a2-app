(function () {
    "use strict";

    describe("A Shipping Carrier Model Service", function () {

        var shippingCarrier;

        beforeEach(function () {

            inject(function (ShippingCarrierModel, ShippingMethodModel) {

                shippingCarrier = TestUtils.getRandomShippingCarrier(ShippingCarrierModel, ShippingMethodModel);
            });
        });

        describe("has a getDefaultShippingMethod function that", function () {

            beforeEach(function () {
                shippingCarrier.shippingMethods.forEach(function(shippingMethod) {
                    shippingMethod.default = false;
                });
            });

            describe("when there is a default shipping method", function () {
                var defaultShippingMethod;

                beforeEach(function () {
                    defaultShippingMethod = TestUtils.getRandomValueFromArray(shippingCarrier.shippingMethods);
                    defaultShippingMethod.default = true;
                });

                it("should return the default shipping method", function () {
                    expect(shippingCarrier.getDefaultShippingMethod()).toEqual(defaultShippingMethod);
                });
            });

            describe("when there is NOT a default shipping method", function () {

                it("should return falsy", function () {
                    expect(shippingCarrier.getDefaultShippingMethod()).toBeFalsy();
                });
            });
        });

        describe("has a getDisplayName function that", function () {

            it("should return name", function () {
                expect(shippingCarrier.getDisplayName()).toEqual(shippingCarrier.name);
            });
        });
    });

})();