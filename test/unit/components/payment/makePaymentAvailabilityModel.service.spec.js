(function () {
    "use strict";

    describe("An Make Payment Availability Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.payment");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var makePaymentAvailability,
                mockMakePaymentAvailabilityResource = {
                    newField1                             : "some value",
                    newField2                             : "some other value",
                    newField3                             : "yet another value",
                    makePaymentAllowed                    : "false",
                    shouldDisplayBankAccountSetupMessage  : "true",
                    shouldDisplayDirectDebitEnabledMessage: "false",
                    shouldDisplayOutstandingPaymentMessage: "true"
                },
                makePaymentAvailabilityModelKeys,
                makePaymentAvailabilityResourceKeys;

            beforeEach(inject(function (MakePaymentAvailabilityModel) {
                makePaymentAvailability = new MakePaymentAvailabilityModel();

                // set all values to "default" to more easily detect any changes
                for (var property in makePaymentAvailability) {
                    if (_.has(makePaymentAvailability, property)) {
                        makePaymentAvailability[property] = "default";
                    }
                }

                makePaymentAvailabilityModelKeys = _.keys(makePaymentAvailability);
                makePaymentAvailabilityResourceKeys = _.keys(mockMakePaymentAvailabilityResource);
            }));

            it("should set the MakePaymentAvailabilityModel object with the fields from the passed in makePaymentAvailabilityResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(makePaymentAvailabilityModelKeys, makePaymentAvailabilityResourceKeys);

                makePaymentAvailability.set(mockMakePaymentAvailabilityResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(makePaymentAvailability[key]).toEqual(mockMakePaymentAvailabilityResource[key]);
                }
            });

            it("should NOT change the MakePaymentAvailabilityModel object fields that the makePaymentAvailabilityResource object does not have", function () {
                var key,
                    keysDifference = _.difference(makePaymentAvailabilityModelKeys, makePaymentAvailabilityResourceKeys);

                makePaymentAvailability.set(mockMakePaymentAvailabilityResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(makePaymentAvailability[key]).toEqual("default");
                }
            });

            it("should extend the MakePaymentAvailabilityModel object with the fields from the passed in makePaymentAvailabilityResource object that the MakePaymentAvailabilityModel does not have", function () {
                var key,
                    keysDifference = _.difference(makePaymentAvailabilityResourceKeys, makePaymentAvailabilityModelKeys);

                makePaymentAvailability.set(mockMakePaymentAvailabilityResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(makePaymentAvailability, key)).toBeTruthy();
                    expect(makePaymentAvailability[key]).toEqual(mockMakePaymentAvailabilityResource[key]);
                }
            });

        });

    });

})();