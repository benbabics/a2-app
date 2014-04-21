define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            shippingModel;

        squire.mock("backbone", Backbone);

        describe("A Shipping Model", function () {
            beforeEach(function (done) {
                squire.require(["models/ShippingModel"], function (ShippingModel) {
                    shippingModel = new ShippingModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(shippingModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(shippingModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set deliveryMethod to default", function () {
                    expect(shippingModel.defaults.deliveryMethod).toBeNull();
                });

                it("should set firstName to default", function () {
                    expect(shippingModel.defaults.firstName).toBeNull();
                });

                it("should set lastName to default", function () {
                    expect(shippingModel.defaults.lastName).toBeNull();
                });

                it("should set companyName to default", function () {
                    expect(shippingModel.defaults.companyName).toBeNull();
                });

                it("should set addressLine1 to default", function () {
                    expect(shippingModel.defaults.addressLine1).toBeNull();
                });

                it("should set addressLine2 to default", function () {
                    expect(shippingModel.defaults.addressLine2).toBeNull();
                });

                it("should set city to default", function () {
                    expect(shippingModel.defaults.city).toBeNull();
                });

                it("should set state to default", function () {
                    expect(shippingModel.defaults.state).toBeNull();
                });

                it("should set postalCode to default", function () {
                    expect(shippingModel.defaults.postalCode).toBeNull();
                });

                it("should set residence to default", function () {
                    expect(shippingModel.defaults.residence).toBeFalsy();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(shippingModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(shippingModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        shippingModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(shippingModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        shippingModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(shippingModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "deliveryMethod": "Delivery Method",
                        "firstName"     : "First Name",
                        "lastName"      : "Last Name",
                        "companyName"   : "Company Name",
                        "addressLine1"  : "Address Line 1",
                        "addressLine2"  : "Address Line 2",
                        "city"          : "City",
                        "state"         : "State",
                        "postalCode"    : "Postal Code",
                        "residence"     : true
                    };

                    beforeEach(function () {
                        shippingModel.initialize(options);
                    });

                    it("should call set 3 times", function () {
                        expect(shippingModel.set.calls.count()).toEqual(10);
                    });

                    it("should set deliveryMethod", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("deliveryMethod", options.deliveryMethod);
                    });

                    it("should set firstName", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set lastName", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("lastName", options.lastName);
                    });

                    it("should set companyName", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("companyName", options.companyName);
                    });

                    it("should set addressLine1", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("addressLine1", options.addressLine1);
                    });

                    it("should set addressLine2", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("addressLine2", options.addressLine2);
                    });

                    it("should set city", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("city", options.city);
                    });

                    it("should set state", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("state", options.state);
                    });

                    it("should set postalCode", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("postalCode", options.postalCode);
                    });

                    it("should set residence", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("residence", options.residence);
                    });
                });
            });
        });
    });
