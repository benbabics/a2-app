(function () {
    "use strict";

    describe("A Payment Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.bank");
            module("app.components.payment");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var payment,
                mockPaymentResource = {
                    newField1         : "some value",
                    newField2         : "some other value",
                    newField3         : "yet another value",
                    id                : "id value",
                    scheduledDate     : "scheduledDate value",
                    amount            : "amount value",
                    bankAccount       : {
                        id            : "bank id value",
                        defaultBank   : true,
                        name          : "company name value"
                    },
                    status            : "status value",
                    confirmationNumber: "confirmationNumber value"
                },
                paymentModelKeys,
                paymentResourceKeys;

            beforeEach(inject(function (PaymentModel) {
                payment = new PaymentModel();

                // set all values to "default" to more easily detect any changes
                for (var property in payment) {
                    if (_.has(payment, property)) {
                        payment[property] = "default";
                    }
                }

                paymentModelKeys = _.keys(payment);
                paymentResourceKeys = _.keys(mockPaymentResource);
            }));

            it("should set the PaymentModel object with the fields from the passed in paymentResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(paymentModelKeys, paymentResourceKeys);

                payment.set(mockPaymentResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(payment[key]).toEqual(mockPaymentResource[key]);
                }
            });

            it("should NOT change the PaymentModel object fields that the paymentResource object does not have", function () {
                var key,
                    keysDifference = _.difference(paymentModelKeys, paymentResourceKeys);

                payment.set(mockPaymentResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(payment[key]).toEqual("default");
                }
            });

            it("should extend the PaymentModel object with the fields from the passed in paymentResource object that the PaymentModel does not have", function () {
                var key,
                    keysDifference = _.difference(paymentResourceKeys, paymentModelKeys);

                payment.set(mockPaymentResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(payment, key)).toBeTruthy();
                    expect(payment[key]).toEqual(mockPaymentResource[key]);
                }
            });

        });

    });

})();