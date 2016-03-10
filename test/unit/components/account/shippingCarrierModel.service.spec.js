(function () {
    "use strict";

    describe("A Shipping Carrier Model Service", function () {

        var _,
            shippingCarrier;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");

            inject(function (___, ShippingCarrierModel, ShippingMethodModel) {
                _ = ___;

                shippingCarrier = TestUtils.getRandomShippingCarrier(ShippingCarrierModel, ShippingMethodModel);
            });
        });

        describe("has a set function that", function () {
            var mockShippingCarrierResource,
                shippingCarrierModelKeys,
                shippingCarrierResourceKeys;

            beforeEach(inject(function (ShippingCarrierModel, ShippingMethodModel) {
                mockShippingCarrierResource = angular.extend(TestUtils.getRandomShippingCarrier(ShippingCarrierModel, ShippingMethodModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in shippingCarrier) {
                    if (_.has(shippingCarrier, property)) {
                        shippingCarrier[property] = "default";
                    }
                }

                shippingCarrierModelKeys = _.keys(shippingCarrier);
                shippingCarrierResourceKeys = _.keys(mockShippingCarrierResource);
            }));

            it("should set the ShippingCarrierModel object with the fields from the passed in shippingCarrierResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(shippingCarrierModelKeys, shippingCarrierResourceKeys);

                shippingCarrier.set(mockShippingCarrierResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(shippingCarrier[key]).toEqual(mockShippingCarrierResource[key]);
                }
            });

            it("should NOT change the ShippingCarrierModel object fields that the shippingCarrierResource object does not have", function () {
                var key,
                    keysDifference = _.difference(shippingCarrierModelKeys, shippingCarrierResourceKeys);

                shippingCarrier.set(mockShippingCarrierResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(shippingCarrier[key]).toEqual("default");
                }
            });

            it("should extend the ShippingCarrierModel object with the fields from the passed in shippingCarrierResource object that the ShippingCarrierModel does not have", function () {
                var key,
                    keysDifference = _.difference(shippingCarrierResourceKeys, shippingCarrierModelKeys);

                shippingCarrier.set(mockShippingCarrierResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(shippingCarrier, key)).toBeTruthy();
                    expect(shippingCarrier[key]).toEqual(mockShippingCarrierResource[key]);
                }
            });

        });

        describe("has a getDefaultShippingMethod function that", function () {

            beforeEach(function () {
                _.forEach(shippingCarrier.shippingMethods, function(shippingMethod) {
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