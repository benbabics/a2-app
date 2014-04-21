define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            addressModel;

        squire.mock("backbone", Backbone);

        describe("An Address Model", function () {
            beforeEach(function (done) {
                squire.require(["models/AddressModel"], function (AddressModel) {
                    addressModel = new AddressModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(addressModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(addressModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set firstName to default", function () {
                    expect(addressModel.defaults.firstName).toBeNull();
                });

                it("should set lastName to default", function () {
                    expect(addressModel.defaults.lastName).toBeNull();
                });

                it("should set companyName to default", function () {
                    expect(addressModel.defaults.companyName).toBeNull();
                });

                it("should set addressLine1 to default", function () {
                    expect(addressModel.defaults.addressLine1).toBeNull();
                });

                it("should set addressLine2 to default", function () {
                    expect(addressModel.defaults.addressLine2).toBeNull();
                });

                it("should set city to default", function () {
                    expect(addressModel.defaults.city).toBeNull();
                });

                it("should set state to default", function () {
                    expect(addressModel.defaults.state).toBeNull();
                });

                it("should set postalCode to default", function () {
                    expect(addressModel.defaults.postalCode).toBeNull();
                });

                it("should set countryCode to default", function () {
                    expect(addressModel.defaults.countryCode).toBeNull();
                });

                it("should set residence to default", function () {
                    expect(addressModel.defaults.residence).toBeFalsy();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(addressModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(addressModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(addressModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        addressModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(addressModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        addressModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(addressModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "firstName"     : "First Name",
                        "lastName"      : "Last Name",
                        "companyName"   : "Company Name",
                        "addressLine1"  : "Address Line 1",
                        "addressLine2"  : "Address Line 2",
                        "city"          : "City",
                        "state"         : "State",
                        "postalCode"    : "Postal Code",
                        "countryCode"   : "Country Code",
                        "residence"     : true
                    };

                    beforeEach(function () {
                        addressModel.initialize(options);
                    });

                    it("should call set 10 times", function () {
                        expect(addressModel.set.calls.count()).toEqual(10);
                    });

                    it("should set firstName", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set lastName", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("lastName", options.lastName);
                    });

                    it("should set companyName", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("companyName", options.companyName);
                    });

                    it("should set addressLine1", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("addressLine1", options.addressLine1);
                    });

                    it("should set addressLine2", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("addressLine2", options.addressLine2);
                    });

                    it("should set city", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("city", options.city);
                    });

                    it("should set state", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("state", options.state);
                    });

                    it("should set postalCode", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("postalCode", options.postalCode);
                    });

                    it("should set countryCode", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("countryCode", options.countryCode);
                    });

                    it("should set residence", function () {
                        expect(addressModel.set).toHaveBeenCalledWith("residence", options.residence);
                    });
                });
            });
        });
    });
