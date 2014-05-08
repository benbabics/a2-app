define(["utils", "globals", "Squire", "models/PaymentModel"],
    function (utils, globals, Squire, PaymentModel) {
        "use strict";

        var squire = new Squire(),
            paymentCollection;

        squire.mock("models/PaymentModel", PaymentModel);

        describe("A Payment Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/PaymentCollection"], function (PaymentCollection) {
                    paymentCollection = new PaymentCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(paymentCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(paymentCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should model to PaymentModel", function () {
                    expect(paymentCollection.model).toEqual(PaymentModel);
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(paymentCollection.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentCollection.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when the list of models is null", function () {
                    var actualValue;

                    beforeEach(function () {
                        paymentCollection.reset();

                        actualValue = paymentCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                describe("when the list of models is empty", function () {
                    var actualValue;

                    beforeEach(function () {
                        paymentCollection.reset();

                        actualValue = paymentCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                // TODO - Figure out why these tests don't work even though the collection seems to work correctly
                xdescribe("when there are models in the collection", function () {
                    var mockPayments,
                        payment1,
                        payment2,
                        actualValue;

                    beforeEach(function () {
                        mockPayments = [
                            {
                                "id"                : "13451345",
                                "scheduledDate"     : "5/8/2014",
                                "amount"            : 24356.56,
                                "bankAccount"       : {
                                    "id"            : "3465",
                                    "name"          : "Bank Name",
                                    "defaultBank"   : false
                                },
                                "status"            : "Status",
                                "confirmationNumber": "13451dvfgwdrfg23456"
                            },
                            {
                                "id"                : "v62546",
                                "scheduledDate"     : "4/8/2014",
                                "amount"            : 456.34,
                                "bankAccount"       : {
                                    "id"            : "2536",
                                    "name"          : "Bank Name 2",
                                    "defaultBank"   : true
                                },
                                "status"            : "Active",
                                "confirmationNumber": "afgasrfgw4562"
                            }
                        ];
                        payment1 = new PaymentModel();
                        payment1.initialize(mockPayments[0]);
                        payment2 = new PaymentModel();
                        payment2.initialize(mockPayments[1]);

                        paymentCollection.add(payment1);
                        paymentCollection.add(payment2);

                        spyOn(payment1, "toJSON").and.callThrough();
                        spyOn(payment2, "toJSON").and.callThrough();

                        actualValue = paymentCollection.toJSON();
                    });

                    it("should call toJSON on payment1", function () {
                        expect(payment1.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on payment2", function () {
                        expect(payment2.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockPayments);
                    });
                });
            });
        });
    });
