define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            makePaymentAvailabilityModel;

        squire.mock("backbone", Backbone);

        describe("A Make Payment Availability Model", function () {
            beforeEach(function (done) {
                squire.require(["models/MakePaymentAvailabilityModel"], function (MakePaymentAvailabilityModel) {
                    makePaymentAvailabilityModel = new MakePaymentAvailabilityModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(makePaymentAvailabilityModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(makePaymentAvailabilityModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set shouldDisplayDirectDebitEnabledMessage to default", function () {
                    expect(makePaymentAvailabilityModel.defaults.shouldDisplayDirectDebitEnabledMessage).toBeFalsy();
                });

                it("should set shouldDisplayBankAccountSetupMessage to default", function () {
                    expect(makePaymentAvailabilityModel.defaults.shouldDisplayBankAccountSetupMessage).toBeFalsy();
                });

                it("should set shouldDisplayOutstandingPaymentMessage to default", function () {
                    expect(makePaymentAvailabilityModel.defaults.shouldDisplayOutstandingPaymentMessage).toBeFalsy();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(makePaymentAvailabilityModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(makePaymentAvailabilityModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(makePaymentAvailabilityModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        makePaymentAvailabilityModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(makePaymentAvailabilityModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        makePaymentAvailabilityModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(makePaymentAvailabilityModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "shouldDisplayDirectDebitEnabledMessage": true,
                        "shouldDisplayBankAccountSetupMessage"  : true,
                        "shouldDisplayOutstandingPaymentMessage": true
                    };

                    beforeEach(function () {
                        makePaymentAvailabilityModel.initialize(options);
                    });

                    it("should call set 3 times", function () {
                        expect(makePaymentAvailabilityModel.set.calls.count()).toEqual(3);
                    });

                    it("should set shouldDisplayDirectDebitEnabledMessage", function () {
                        expect(makePaymentAvailabilityModel.set)
                            .toHaveBeenCalledWith("shouldDisplayDirectDebitEnabledMessage",
                                                  options.shouldDisplayDirectDebitEnabledMessage);
                    });

                    it("should set shouldDisplayBankAccountSetupMessage", function () {
                        expect(makePaymentAvailabilityModel.set)
                            .toHaveBeenCalledWith("shouldDisplayBankAccountSetupMessage",
                                                  options.shouldDisplayBankAccountSetupMessage);
                    });

                    it("should set shouldDisplayOutstandingPaymentMessage", function () {
                        expect(makePaymentAvailabilityModel.set)
                            .toHaveBeenCalledWith("shouldDisplayOutstandingPaymentMessage",
                                                  options.shouldDisplayOutstandingPaymentMessage);
                    });
                });
            });
        });
    });
