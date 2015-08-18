(function () {
    "use strict";

    describe("A Payment Model Service", function () {

        var _,
            payment,
            BankModel;

        beforeEach(function () {
            module("app.shared");
            module("app.components.bank");
            module("app.components.payment");

            inject(function (_BankModel_, CommonService, PaymentModel) {
                _ = CommonService._;

                BankModel = _BankModel_;

                payment = new PaymentModel();
            });
        });

        describe("has a set function that", function () {

            var mockPaymentResource = {
                    newField1         : "some value",
                    newField2         : "some other value",
                    newField3         : "yet another value",
                    id                : "id value",
                    scheduledDate     : "scheduledDate value",
                    amount            : "amount value",
                    bankAccount       : {
                        id            : "bank id value",
                        defaultBank   : true,
                        lastFourDigits: "1234",
                        name          : "company name value"
                    },
                    status            : "status value",
                    confirmationNumber: "confirmationNumber value"
                },
                paymentModelKeys,
                paymentResourceKeys;

            beforeEach(inject(function () {
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
                    if (key === "bankAccount") {
                        var expectedBank = new BankModel();
                        expectedBank.set(mockPaymentResource[key]);

                        expect(payment[key]).toEqual(expectedBank);
                    }
                    else {
                        expect(payment[key]).toEqual(mockPaymentResource[key]);
                    }
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

        describe("has an isScheduled function that", function () {

            describe("when the Payment is Canceled", function () {

                beforeEach(function () {
                    payment.status = "CANCELLED";
                });

                it("should return false", function () {
                    expect(payment.isScheduled()).toBeFalsy();
                });

            });

            describe("when the Payment is Complete", function () {

                beforeEach(function () {
                    payment.status = "COMPLETE";
                });

                it("should return false", function () {
                    expect(payment.isScheduled()).toBeFalsy();
                });

            });

            describe("when the Payment is Scheduled", function () {

                beforeEach(function () {
                    payment.status = "SCHEDULED";
                });

                it("should return true", function () {
                    expect(payment.isScheduled()).toBeTruthy();
                });

            });

            describe("when the Payment is Pending", function () {

                beforeEach(function () {
                    payment.status = "PENDING";
                });

                it("should return false", function () {
                    expect(payment.isScheduled()).toBeFalsy();
                });

            });

            describe("when the Payment is Unknown", function () {

                beforeEach(function () {
                    payment.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(payment.isScheduled()).toBeFalsy();
                });

            });

            describe("when the Payment status is null", function () {

                beforeEach(function () {
                    payment.status = null;
                });

                it("should return false", function () {
                    expect(payment.isScheduled()).toBeFalsy();
                });

            });

            describe("when the Payment status is empty", function () {

                beforeEach(function () {
                    payment.status = "";
                });

                it("should return false", function () {
                    expect(payment.isScheduled()).toBeFalsy();
                });

            });

            describe("when the Payment status is undefined", function () {

                beforeEach(function () {
                    payment.status = undefined;
                });

                it("should return false", function () {
                    expect(payment.isScheduled()).toBeFalsy();
                });

            });

        });

    });

})();