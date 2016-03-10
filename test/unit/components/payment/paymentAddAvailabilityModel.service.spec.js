(function () {
    "use strict";

    describe("A Payment Add Availability Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.payment");

            inject(function (___) {
                _ = ___;
            });
        });

        describe("has a set function that", function () {

            var paymentAddAvailability,
                mockPaymentAddAvailabilityResource = {
                    newField1                             : "some value",
                    newField2                             : "some other value",
                    newField3                             : "yet another value",
                    makePaymentAllowed                    : "false",
                    shouldDisplayCurrentBalanceDueMessage : "false",
                    shouldDisplayBankAccountSetupMessage  : "true",
                    shouldDisplayDirectDebitEnabledMessage: "false",
                    shouldDisplayOutstandingPaymentMessage: "true"
                },
                paymentAddAvailabilityModelKeys,
                paymentAddAvailabilityResourceKeys;

            beforeEach(inject(function (PaymentAddAvailabilityModel) {
                paymentAddAvailability = new PaymentAddAvailabilityModel();

                // set all values to "default" to more easily detect any changes
                for (var property in paymentAddAvailability) {
                    if (_.has(paymentAddAvailability, property)) {
                        paymentAddAvailability[property] = "default";
                    }
                }

                paymentAddAvailabilityModelKeys = _.keys(paymentAddAvailability);
                paymentAddAvailabilityResourceKeys = _.keys(mockPaymentAddAvailabilityResource);
            }));

            it("should set the PaymentAddAvailabilityModel object with the fields from the passed in paymentAddAvailabilityResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(paymentAddAvailabilityModelKeys, paymentAddAvailabilityResourceKeys);

                paymentAddAvailability.set(mockPaymentAddAvailabilityResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(paymentAddAvailability[key]).toEqual(mockPaymentAddAvailabilityResource[key]);
                }
            });

            it("should NOT change the PaymentAddAvailabilityModel object fields that the paymentAddAvailabilityResource object does not have", function () {
                var key,
                    keysDifference = _.difference(paymentAddAvailabilityModelKeys, paymentAddAvailabilityResourceKeys);

                paymentAddAvailability.set(mockPaymentAddAvailabilityResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(paymentAddAvailability[key]).toEqual("default");
                }
            });

            it("should extend the PaymentAddAvailabilityModel object with the fields from the passed in paymentAddAvailabilityResource object that the PaymentAddAvailabilityModel does not have", function () {
                var key,
                    keysDifference = _.difference(paymentAddAvailabilityResourceKeys, paymentAddAvailabilityModelKeys);

                paymentAddAvailability.set(mockPaymentAddAvailabilityResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(paymentAddAvailability, key)).toBeTruthy();
                    expect(paymentAddAvailability[key]).toEqual(mockPaymentAddAvailabilityResource[key]);
                }
            });

        });

    });

})();