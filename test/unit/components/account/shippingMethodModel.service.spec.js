(function () {
    "use strict";

    describe("A Shipping Method Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");

            inject(function (___) {
                _ = ___;
            });
        });

        describe("has a set function that", function () {

            var shippingMethod,
                mockShippingMethodResource,
                shippingMethodModelKeys,
                shippingMethodResourceKeys;

            beforeEach(inject(function (ShippingMethodModel) {
                shippingMethod = new ShippingMethodModel();

                mockShippingMethodResource = angular.extend(TestUtils.getRandomShippingMethod(ShippingMethodModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in shippingMethod) {
                    if (_.has(shippingMethod, property)) {
                        shippingMethod[property] = "default";
                    }
                }

                shippingMethodModelKeys = _.keys(shippingMethod);
                shippingMethodResourceKeys = _.keys(mockShippingMethodResource);
            }));

            it("should set the ShippingMethodModel object with the fields from the passed in shippingMethodResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(shippingMethodModelKeys, shippingMethodResourceKeys);

                shippingMethod.set(mockShippingMethodResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(shippingMethod[key]).toEqual(mockShippingMethodResource[key]);
                }
            });

            it("should NOT change the ShippingMethodModel object fields that the shippingMethodResource object does not have", function () {
                var key,
                    keysDifference = _.difference(shippingMethodModelKeys, shippingMethodResourceKeys);

                shippingMethod.set(mockShippingMethodResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(shippingMethod[key]).toEqual("default");
                }
            });

            it("should extend the ShippingMethodModel object with the fields from the passed in shippingMethodResource object that the ShippingMethodModel does not have", function () {
                var key,
                    keysDifference = _.difference(shippingMethodResourceKeys, shippingMethodModelKeys);

                shippingMethod.set(mockShippingMethodResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(shippingMethod, key)).toBeTruthy();
                    expect(shippingMethod[key]).toEqual(mockShippingMethodResource[key]);
                }
            });

        });

    });

})();