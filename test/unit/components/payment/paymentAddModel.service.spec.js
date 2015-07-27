(function () {
    "use strict";

    describe("A Payment Add Model Service", function () {

        var _;

        beforeEach(function () {
            module("app.shared");
            module("app.components.payment");

            inject(function (CommonService) {
                _ = CommonService._;
            });
        });

        describe("has a set function that", function () {

            var paymentAdd,
                mockPaymentAddResource = {
                    newField1  : "some value",
                    newField2  : "some other value",
                    newField3  : "yet another value",
                    amount     : "amount value",
                    bankAccount: "bank account value",
                    paymentDate: "payment date value"
                },
                paymentAddModelKeys,
                paymentAddResourceKeys;

            beforeEach(inject(function (PaymentAddModel) {
                paymentAdd = new PaymentAddModel();

                // set all values to "default" to more easily detect any changes
                for (var property in paymentAdd) {
                    if (_.has(paymentAdd, property)) {
                        paymentAdd[property] = "default";
                    }
                }

                paymentAddModelKeys = _.keys(paymentAdd);
                paymentAddResourceKeys = _.keys(mockPaymentAddResource);
            }));

            it("should set the PaymentAddModel object with the fields from the passed in paymentAddResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(paymentAddModelKeys, paymentAddResourceKeys);

                paymentAdd.set(mockPaymentAddResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(paymentAdd[key]).toEqual(mockPaymentAddResource[key]);
                }
            });

            it("should NOT change the PaymentAddModel object fields that the paymentAddResource object does not have", function () {
                var key,
                    keysDifference = _.difference(paymentAddModelKeys, paymentAddResourceKeys);

                paymentAdd.set(mockPaymentAddResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(paymentAdd[key]).toEqual("default");
                }
            });

            it("should extend the PaymentAddModel object with the fields from the passed in paymentAddResource object that the PaymentAddModel does not have", function () {
                var key,
                    keysDifference = _.difference(paymentAddResourceKeys, paymentAddModelKeys);

                paymentAdd.set(mockPaymentAddResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(paymentAdd, key)).toBeTruthy();
                    expect(paymentAdd[key]).toEqual(mockPaymentAddResource[key]);
                }
            });

        });

    });

})();