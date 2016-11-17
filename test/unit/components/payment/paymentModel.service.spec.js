(function () {
    "use strict";

    describe("A Payment Model Service", function () {

        var payment,
            BankModel,
            PaymentModel;

        beforeEach(inject(function (_BankModel_, _PaymentModel_) {
            BankModel = _BankModel_;
            PaymentModel = _PaymentModel_;

            payment = new PaymentModel();
        }));

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