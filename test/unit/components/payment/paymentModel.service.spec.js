(function () {
    "use strict";

    describe("A Payment Model Service", function () {

        var _,
            payment,
            BankModel,
            PaymentModel;

        beforeEach(inject(function (___, _BankModel_, _PaymentModel_) {
            _ = ___;

            BankModel = _BankModel_;
            PaymentModel = _PaymentModel_;

            payment = new PaymentModel();
        }));

        describe("has a set function that", function () {

            var mockPaymentResource,
                paymentModelKeys,
                paymentResourceKeys;

            beforeEach(inject(function () {
                mockPaymentResource = angular.extend(TestUtils.getRandomPayment(PaymentModel, BankModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

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

        describe("has a getBankAccountDisplayName function that", function () {

            describe("when the method is DIRECT_DEBIT", function () {

                beforeEach(function () {
                    payment.method = "DIRECT_DEBIT";
                });

                it("should return 'N/A'", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual("N/A");
                });
            });

            describe("when the method is ONLINE", function () {

                beforeEach(function () {
                    payment.method = "ONLINE";
                });

                it("should return the bank account's display name", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual(payment.bankAccount.getDisplayName());
                });
            });

            describe("when the method is CHECK", function () {

                beforeEach(function () {
                    payment.method = "CHECK";
                });

                it("should return 'N/A'", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual("N/A");
                });
            });

            describe("when the method is IVR", function () {

                beforeEach(function () {
                    payment.method = "IVR";
                });

                it("should return the bank account's display name", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual(payment.bankAccount.getDisplayName());
                });
            });

            describe("when the method is UNKNOWN", function () {

                beforeEach(function () {
                    payment.method = "UNKNOWN";
                });

                it("should return 'N/A'", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual("N/A");
                });
            });

            describe("when the method is unrecognized", function () {

                beforeEach(function () {
                    payment.method = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                });

                it("should return the bank account's display name", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual(payment.bankAccount.getDisplayName());
                });
            });

            describe("when the method is empty", function () {

                beforeEach(function () {
                    payment.method = "";
                });

                it("should return the bank account's display name", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual(payment.bankAccount.getDisplayName());
                });
            });

            describe("when the method is null", function () {

                beforeEach(function () {
                    payment.method = null;
                });

                it("should return the bank account's display name", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual(payment.bankAccount.getDisplayName());
                });
            });

            describe("when the method is undefined", function () {

                beforeEach(function () {
                    delete payment.method;
                });

                it("should return the bank account's display name", function () {
                    expect(payment.getBankAccountDisplayName()).toEqual(payment.bankAccount.getDisplayName());
                });
            });
        });

        describe("has an isPending function that", function () {

            describe("when the Payment is Canceled", function () {

                beforeEach(function () {
                    payment.status = "CANCELLED";
                });

                it("should return false", function () {
                    expect(payment.isPending()).toBeFalsy();
                });

            });

            describe("when the Payment is Complete", function () {

                beforeEach(function () {
                    payment.status = "COMPLETE";
                });

                it("should return false", function () {
                    expect(payment.isPending()).toBeFalsy();
                });

            });

            describe("when the Payment is Scheduled", function () {

                beforeEach(function () {
                    payment.status = "SCHEDULED";
                });

                it("should return false", function () {
                    expect(payment.isPending()).toBeFalsy();
                });

            });

            describe("when the Payment is Pending", function () {

                beforeEach(function () {
                    payment.status = "PENDING";
                });

                it("should return true", function () {
                    expect(payment.isPending()).toBeTruthy();
                });

            });

            describe("when the Payment is Unknown", function () {

                beforeEach(function () {
                    payment.status = "UNKNOWN";
                });

                it("should return false", function () {
                    expect(payment.isPending()).toBeFalsy();
                });

            });

            describe("when the Payment status is null", function () {

                beforeEach(function () {
                    payment.status = null;
                });

                it("should return false", function () {
                    expect(payment.isPending()).toBeFalsy();
                });

            });

            describe("when the Payment status is empty", function () {

                beforeEach(function () {
                    payment.status = "";
                });

                it("should return false", function () {
                    expect(payment.isPending()).toBeFalsy();
                });

            });

            describe("when the Payment status is undefined", function () {

                beforeEach(function () {
                    payment.status = undefined;
                });

                it("should return false", function () {
                    expect(payment.isPending()).toBeFalsy();
                });

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

        describe("has a getMethodDisplayName function that", function () {

            describe("when the method is DIRECT_DEBIT", function () {

                beforeEach(function () {
                    payment.method = "DIRECT_DEBIT";
                });

                it("should return 'Direct Debit'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Direct Debit");
                });
            });

            describe("when the method is ONLINE", function () {

                beforeEach(function () {
                    payment.method = "ONLINE";
                });

                it("should return 'Online Payment'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Online Payment");
                });
            });

            describe("when the method is CHECK", function () {

                beforeEach(function () {
                    payment.method = "CHECK";
                });

                it("should return 'Check'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Check");
                });
            });

            describe("when the method is IVR", function () {

                beforeEach(function () {
                    payment.method = "IVR";
                });

                it("should return 'Phone Payment'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Phone Payment");
                });
            });

            describe("when the method is UNKNOWN", function () {

                beforeEach(function () {
                    payment.method = "UNKNOWN";
                });

                it("should return 'Unknown'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is unrecognized", function () {

                beforeEach(function () {
                    payment.method = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                });

                it("should return 'Unknown'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is null", function () {

                beforeEach(function () {
                    payment.method = null;
                });

                it("should return 'Unknown'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is empty", function () {

                beforeEach(function () {
                    payment.method = "";
                });

                it("should return 'Unknown'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Unknown");
                });
            });

            describe("when the method is undefined", function () {

                beforeEach(function () {
                    payment.method = undefined;
                });

                it("should return 'Unknown'", function () {
                    expect(payment.getMethodDisplayName()).toEqual("Unknown");
                });
            });
        });

    });

})();