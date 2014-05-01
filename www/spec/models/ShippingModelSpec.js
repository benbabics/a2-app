define(["Squire", "mustache", "backbone", "globals", "utils"],
    function (Squire, Mustache, Backbone, globals, utils) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockMustashe = Mustache,
            ShippingModel,
            shippingModel;

        squire.mock("backbone", Backbone);
        squire.mock("utils", mockUtils);
        squire.mock("mustache", mockMustashe);

        describe("A Shipping Model", function () {
            beforeEach(function (done) {
                squire.require(["models/ShippingModel"], function (JasmineShippingModel) {
                    ShippingModel = JasmineShippingModel;

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
                it("should set shippingMethod to default", function () {
                    expect(shippingModel.defaults.shippingMethod).toBeNull();
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

                it("should set countryCode to default", function () {
                    expect(shippingModel.defaults.countryCode).toBeNull();
                });

                it("should set residence to default", function () {
                    expect(shippingModel.defaults.residence).toBeFalsy();
                });
            });

            describe("has property validation that", function () {
                describe("has a validation configuration for the firstName field that", function () {
                    it("should set the field as required", function () {
                        expect(shippingModel.validation.firstName.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(shippingModel.validation.firstName.msg)
                            .toEqual(globals.cardShipping.constants.ERROR_FIRST_NAME_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the lastName field that", function () {
                    it("should set the field as required", function () {
                        expect(shippingModel.validation.lastName.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(shippingModel.validation.lastName.msg)
                            .toEqual(globals.cardShipping.constants.ERROR_LAST_NAME_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the companyName field that", function () {
                    it("should set the field as required", function () {
                        expect(shippingModel.validation.companyName.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(shippingModel.validation.companyName.msg)
                            .toEqual(globals.cardShipping.constants.ERROR_COMPANY_NAME_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the addressLine1 field that", function () {
                    var addressValue = "Mock Address";

                    it("has 2 validation rules", function () {
                        expect(shippingModel.validation.addressLine1.length).toEqual(2);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(shippingModel.validation.addressLine1[0].required).toBeTruthy();
                        });

                        it("should set the error message when the field is not supplied", function () {
                            expect(shippingModel.validation.addressLine1[0].msg)
                                .toEqual(globals.cardShipping.constants.ERROR_ADDRESS1_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            var shippingMethod = new Backbone.Model(),
                                mockShippingMethod = {
                                    "id"          : "ID",
                                    "name"        : "Name",
                                    "cost"        : 6.66,
                                    "poBoxAllowed": true
                                },
                                validationMessage = "Mock validation message",
                                actualResponse;

                            beforeEach(function () {
                                shippingMethod.set(mockShippingMethod);
                                shippingModel.set("shippingMethod", shippingMethod);

                                spyOn(shippingModel, "getPOBoxValidationMessage").and.returnValue(validationMessage);

                                actualResponse = shippingModel.validation.addressLine1[1].fn
                                    .call(shippingModel, addressValue);
                            });

                            it("is defined", function () {
                                expect(shippingModel.validation.addressLine1[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(shippingModel.validation.addressLine1[1].fn).toEqual(jasmine.any(Function));
                            });

                            it("should call getPOBoxValidationMessage", function () {
                                expect(shippingModel.getPOBoxValidationMessage).toHaveBeenCalledWith(addressValue,
                                    globals.cardShipping.constants.ERROR_ADDRESS1_CANNNOT_BE_POBOX);
                            });

                            it("should return the expected result", function () {
                                expect(actualResponse).toEqual(validationMessage);
                            });
                        });
                    });
                });

                describe("has a validation configuration for the addressLine2 field that", function () {
                    var addressValue = "Mock Address";

                    it("should set the field as NOT required", function () {
                        expect(shippingModel.validation.addressLine2.required).toBeFalsy();
                    });

                    describe("should have a fn function that", function () {
                        var shippingMethod = new Backbone.Model(),
                            mockShippingMethod = {
                                "id"          : "ID",
                                "name"        : "Name",
                                "cost"        : 6.66,
                                "poBoxAllowed": true
                            },
                            validationMessage = "Mock validation message",
                            actualResponse;

                        beforeEach(function () {
                            shippingMethod.set(mockShippingMethod);
                            shippingModel.set("shippingMethod", shippingMethod);

                            spyOn(shippingModel, "getPOBoxValidationMessage").and.returnValue(validationMessage);

                            actualResponse = shippingModel.validation.addressLine2.fn.call(shippingModel, addressValue);
                        });

                        it("is defined", function () {
                            expect(shippingModel.validation.addressLine2.fn).toBeDefined();
                        });

                        it("is a function", function () {
                            expect(shippingModel.validation.addressLine2.fn).toEqual(jasmine.any(Function));
                        });

                        it("should call getPOBoxValidationMessage", function () {
                            expect(shippingModel.getPOBoxValidationMessage).toHaveBeenCalledWith(addressValue,
                                globals.cardShipping.constants.ERROR_ADDRESS2_CANNNOT_BE_POBOX);
                        });

                        it("should return the expected result", function () {
                            expect(actualResponse).toEqual(validationMessage);
                        });
                    });
                });

                describe("has a validation configuration for the city field that", function () {
                    it("should set the field as required", function () {
                        expect(shippingModel.validation.city.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(shippingModel.validation.city.msg)
                            .toEqual(globals.cardShipping.constants.ERROR_CITY_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the state field that", function () {
                    it("should set the field as required", function () {
                        expect(shippingModel.validation.state.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(shippingModel.validation.state.msg)
                            .toEqual(globals.cardShipping.constants.ERROR_STATE_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the postalCode field that", function () {
                    it("should set the field as required", function () {
                        expect(shippingModel.validation.postalCode.required).toBeTruthy();
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(shippingModel.validation.postalCode.msg)
                            .toEqual(globals.cardShipping.constants.ERROR_POSTAL_CODE_REQUIRED_FIELD);
                    });
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
                            "shippingMethod": {
                                "id"          : "ID",
                                "name"        : "Name",
                                "cost"        : 6.66,
                                "poBoxAllowed": true
                            },
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
                        shippingModel.initialize(options);
                    });

                    it("should call set 11 times", function () {
                        expect(shippingModel.set.calls.count()).toEqual(11);
                    });

                    // TODO - Replace with something that verifies that a new ShippingMethodModel was created,
                    // the correct parameter was passed to the DepartmentModel.initialize function and then set
                    // to "shippingMethod"
                    it("should set shippingMethod", function () {
                        var actualShippingMethod;

                        expect(shippingModel.set.calls.argsFor(0).length).toEqual(2);
                        expect(shippingModel.set.calls.argsFor(0)[0]).toEqual("shippingMethod");

                        actualShippingMethod = shippingModel.set.calls.argsFor(0)[1];

                        expect(actualShippingMethod.get("id")).toEqual(options.shippingMethod.id);
                        expect(actualShippingMethod.get("name")).toEqual(options.shippingMethod.name);
                        expect(actualShippingMethod.get("cost")).toEqual(options.shippingMethod.cost);
                        expect(actualShippingMethod.get("poBoxAllowed")).toEqual(options.shippingMethod.poBoxAllowed);
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

                    it("should set countryCode", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("countryCode", options.countryCode);
                    });

                    it("should set residence", function () {
                        expect(shippingModel.set).toHaveBeenCalledWith("residence", options.residence);
                    });
                });
            });

            describe("has a getPOBoxValidationMessage function that", function () {
                var shippingMethod = new Backbone.Model(),
                    mockShippingMethod = {
                        "id"          : "ID",
                        "name"        : "Name",
                        "cost"        : 6.66,
                        "poBoxAllowed": true
                    },
                    addressValue = "Mock Address Value",
                    validationMessageTemplate = "Mock Validation Message Template",
                    renderedValidationMessage = "Mock Validation Message",
                    actualResponse;

                beforeEach(function () {
                    shippingMethod.set(mockShippingMethod);
                    shippingModel.set("shippingMethod", shippingMethod);
                });

                it("is defined", function () {
                    expect(shippingModel.getPOBoxValidationMessage).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingModel.getPOBoxValidationMessage).toEqual(jasmine.any(Function));
                });

                describe("when the shipping method allows P.O. Boxes", function () {
                    beforeEach(function () {
                        shippingModel.get("shippingMethod").set("poBoxAllowed", true);
                    });

                    describe("when the isPOBox function on utils returns true", function () {
                        beforeEach(function () {
                            spyOn(mockUtils, "isPOBox").and.returnValue(true);
                            spyOn(mockMustashe, "render").and.returnValue(renderedValidationMessage);

                            actualResponse = shippingModel.getPOBoxValidationMessage(addressValue,
                                                                                     validationMessageTemplate);
                        });

                        it("should NOT call isPOBox on utils", function () {
                            expect(mockUtils.isPOBox).not.toHaveBeenCalled();
                        });

                        it("should NOT call render on Mustashe", function () {
                            expect(mockMustashe.render).not.toHaveBeenCalled();
                        });

                        it("should return the expected result", function () {
                            expect(actualResponse).toBeUndefined();
                        });
                    });

                    describe("when the isPOBox function on utils returns false", function () {
                        beforeEach(function () {
                            spyOn(mockUtils, "isPOBox").and.returnValue(false);
                            spyOn(mockMustashe, "render").and.returnValue(renderedValidationMessage);

                            actualResponse = shippingModel.getPOBoxValidationMessage(addressValue,
                                                                                     validationMessageTemplate);
                        });

                        it("should NOT call isPOBox on utils", function () {
                            expect(mockUtils.isPOBox).not.toHaveBeenCalled();
                        });

                        it("should NOT call render on Mustashe", function () {
                            expect(mockMustashe.render).not.toHaveBeenCalled();
                        });

                        it("should return the expected result", function () {
                            expect(actualResponse).toBeUndefined();
                        });
                    });
                });

                describe("when the shipping method does NOT allow P.O. Boxes", function () {
                    beforeEach(function () {
                        shippingModel.get("shippingMethod").set("poBoxAllowed", false);
                    });

                    describe("when the isPOBox function on utils returns true", function () {
                        beforeEach(function () {
                            spyOn(mockUtils, "isPOBox").and.returnValue(true);
                            spyOn(mockMustashe, "render").and.returnValue(renderedValidationMessage);

                            actualResponse = shippingModel.getPOBoxValidationMessage(addressValue,
                                                                                     validationMessageTemplate);
                        });

                        it("should call isPOBox on utils", function () {
                            expect(mockUtils.isPOBox).toHaveBeenCalledWith(addressValue);
                        });

                        it("should call render on Mustashe", function () {
                            expect(mockMustashe.render).toHaveBeenCalledWith(validationMessageTemplate,
                                {
                                    "shippingMethod": mockShippingMethod.name
                                });
                        });

                        it("should return the expected result", function () {
                            expect(actualResponse).toEqual(renderedValidationMessage);
                        });
                    });

                    describe("when the isPOBox function on utils returns false", function () {
                        beforeEach(function () {
                            spyOn(mockUtils, "isPOBox").and.returnValue(false);
                            spyOn(mockMustashe, "render").and.returnValue(renderedValidationMessage);

                            actualResponse = shippingModel.getPOBoxValidationMessage(addressValue,
                                                                                     validationMessageTemplate);
                        });

                        it("should call isPOBox on utils", function () {
                            expect(mockUtils.isPOBox).toHaveBeenCalledWith(addressValue);
                        });

                        it("should NOT call render on Mustashe", function () {
                            expect(mockMustashe.render).not.toHaveBeenCalled();
                        });

                        it("should return the expected result", function () {
                            expect(actualResponse).toBeUndefined();
                        });
                    });
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(shippingModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when shippingMethod does have a value", function () {
                    var shippingMethod,
                        mockShippingModel = {
                            "shippingMethod": {
                                "id"          : "ID",
                                "name"        : "Name",
                                "cost"        : 6.66,
                                "poBoxAllowed": true,
                                "formattedName": null
                            },
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
                        },
                        actualValue;

                    beforeEach(function () {
                        shippingModel.clear();
                        shippingModel.initialize(mockShippingModel);
                        shippingMethod = shippingModel.get("shippingMethod");

                        // Wipe out the formattedName attribute that is added in the initialize function
                        shippingMethod.set("formattedName", null);
                        spyOn(shippingMethod, "toJSON").and.callThrough();
                        spyOn(ShippingModel.__super__, "toJSON").and.callThrough();

                        actualValue = shippingModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(ShippingModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on shippingMethod", function () {
                        expect(shippingMethod.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockShippingModel);
                    });
                });

                describe("when shippingMethod does NOT have a value", function () {
                    var mockShippingModel = {
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
                        },
                        actualValue;

                    beforeEach(function () {
                        shippingModel.clear();
                        shippingModel.initialize(mockShippingModel);

                        spyOn(ShippingModel.__super__, "toJSON").and.callThrough();

                        actualValue = shippingModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(ShippingModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockShippingModel);
                    });
                });
            });
        });
    });
