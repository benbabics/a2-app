define(["Squire", "utils", "globals", "backbone"],
    function (Squire, utils, globals, Backbone) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockAuthorizationProfileCollection = new Backbone.Collection(),
            CompanyModel,
            companyModel;

        squire.mock("backbone", Backbone);
        squire.mock("utils", mockUtils);
        squire.mock("collections/AuthorizationProfileCollection",
            Squire.Helpers.returns(mockAuthorizationProfileCollection));

        describe("A Company Model", function () {
            beforeEach(function (done) {
                squire.require(["models/CompanyModel"], function (JasmineCompanyModel) {
                    CompanyModel = JasmineCompanyModel;
                    companyModel = new CompanyModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(companyModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(companyModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set name to default", function () {
                    expect(companyModel.defaults.name).toBeNull();
                });

                it("should set accountId to default", function () {
                    expect(companyModel.defaults.accountId).toBeNull();
                });

                it("should set wexAccountNumber to default", function () {
                    expect(companyModel.defaults.wexAccountNumber).toBeNull();
                });

                it("should set departments to default", function () {
                    expect(companyModel.defaults.departments).toBeNull();
                });

                it("should set requiredFields to default", function () {
                    expect(companyModel.defaults.requiredFields).toEqual(globals.companyData.requiredFields);
                });

                it("should set settings to default", function () {
                    expect(companyModel.defaults.settings).toBeNull();
                });

                it("should set authorizationProfiles to default", function () {
                    expect(companyModel.defaults.authorizationProfiles).toBeNull();
                });

                it("should set defaultShippingAddress to default", function () {
                    expect(companyModel.defaults.defaultShippingAddress).toBeNull();
                });

                it("should set shippingMethods to default", function () {
                    expect(companyModel.defaults.shippingMethods).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(companyModel, "set").and.callThrough();
                    spyOn(companyModel, "get").and.callThrough();
                    spyOn(companyModel, "setDepartments").and.callFake(function () {});
                    spyOn(companyModel, "setRequiredFields").and.callFake(function () {});
                    spyOn(companyModel, "setShippingMethods").and.callFake(function () {});
                });

                it("is defined", function () {
                    expect(companyModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        companyModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(companyModel.set).not.toHaveBeenCalled();
                        expect(companyModel.setDepartments).not.toHaveBeenCalled();
                        expect(companyModel.setRequiredFields).not.toHaveBeenCalled();
                        expect(companyModel.setShippingMethods).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        companyModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(companyModel.set).not.toHaveBeenCalled();
                        expect(companyModel.setDepartments).not.toHaveBeenCalled();
                        expect(companyModel.setRequiredFields).not.toHaveBeenCalled();
                        expect(companyModel.setShippingMethods).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            departments: [
                                {
                                    id: "134613456",
                                    name: "UNASSIGNED",
                                    visible: true
                                },
                                {
                                    id: "2456724567",
                                    name: "Dewey, Cheetum and Howe",
                                    visible: false
                                }
                            ],
                            requiredFields: [
                                "REQUIRED_FIELD_1",
                                "REQUIRED_FIELD_2",
                                "REQUIRED_FIELD_3"
                            ],
                            settings: {
                                cardSettings: {
                                    customVehicleIdMaxLength: 17,
                                    licensePlateNumberMaxLength: 10,
                                    licensePlateStateFixedLength: 2,
                                    vehicleDescriptionMaxLength: 17,
                                    vinFixedLength: 17
                                },
                                driverSettings: {
                                    idFixedLength: 4,
                                    firstNameMaxLength: 11,
                                    middleNameMaxLength: 1,
                                    lastNameMaxLength: 12
                                }
                            },
                            defaultShippingAddress: {
                                firstName: "First Name",
                                lastName: "Last Name",
                                companyName: "Company Name",
                                addressLine1: "Address Line 1",
                                addressLine2: "Address Line 2",
                                city: "City",
                                state: "State",
                                postalCode: "Postal Code",
                                countryCode: "Country Code",
                                residence: true
                            },
                            shippingMethods: [
                                {
                                    id: "134613456",
                                    name: "UNASSIGNED",
                                    cost: 3.14,
                                    poBoxAllowed: true
                                },
                                {
                                    id: "2456724567",
                                    name: "Dewey, Cheetum and Howe",
                                    cost: 6.66,
                                    poBoxAllowed: false
                                }
                            ]
                        };

                    beforeEach(function () {
                        companyModel.initialize(options);
                    });

                    it("should call set 5 times", function () {
                        expect(companyModel.set.calls.count()).toEqual(5);
                    });

                    it("should set name", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set accountId", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("accountId", options.accountId);
                    });

                    it("should set wexAccountNumber", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("wexAccountNumber", options.wexAccountNumber);
                    });

                    it("should set departments", function () {
                        expect(companyModel.setDepartments).toHaveBeenCalledWith(options.departments);
                    });

                    it("should set requiredFields", function () {
                        expect(companyModel.setRequiredFields).toHaveBeenCalledWith(options.requiredFields);
                    });

                    // TODO - Replace with something that verifies that a new CompanySettingsModel was created,
                    // the correct parameter was passed to the CompanySettingsModel.initialize function and then set
                    // to "settings"
                    it("should set settings", function () {
                        var actualSettings;

                        expect(companyModel.set.calls.argsFor(3).length).toEqual(2);
                        expect(companyModel.set.calls.argsFor(3)[0]).toEqual("settings");

                        actualSettings = companyModel.set.calls.argsFor(3)[1].toJSON();

                        expect(actualSettings.cardSettings.customVehicleIdMaxLength)
                            .toEqual(options.settings.cardSettings.customVehicleIdMaxLength);
                        expect(actualSettings.cardSettings.licensePlateNumberMaxLength)
                            .toEqual(options.settings.cardSettings.licensePlateNumberMaxLength);
                        expect(actualSettings.cardSettings.licensePlateStateFixedLength)
                            .toEqual(options.settings.cardSettings.licensePlateStateFixedLength);
                        expect(actualSettings.cardSettings.vehicleDescriptionMaxLength)
                            .toEqual(options.settings.cardSettings.vehicleDescriptionMaxLength);
                        expect(actualSettings.cardSettings.vinFixedLength)
                            .toEqual(options.settings.cardSettings.vinFixedLength);

                        expect(actualSettings.driverSettings.idFixedLength)
                            .toEqual(options.settings.driverSettings.idFixedLength);
                        expect(actualSettings.driverSettings.firstNameMaxLength)
                            .toEqual(options.settings.driverSettings.firstNameMaxLength);
                        expect(actualSettings.driverSettings.middleNameMaxLength)
                            .toEqual(options.settings.driverSettings.middleNameMaxLength);
                        expect(actualSettings.driverSettings.lastNameMaxLength)
                            .toEqual(options.settings.driverSettings.lastNameMaxLength);
                    });

                    // TODO - Replace with something that verifies that a new AddressModel was created,
                    // the correct parameter was passed to the AddressModel.initialize function and then set
                    // to "defaultShippingAddress"
                    it("should set defaultShippingAddress", function () {
                        var actualDefaultShippingAddress;

                        expect(companyModel.set.calls.argsFor(4).length).toEqual(2);
                        expect(companyModel.set.calls.argsFor(4)[0]).toEqual("defaultShippingAddress");

                        actualDefaultShippingAddress = companyModel.set.calls.argsFor(4)[1].toJSON();

                        expect(actualDefaultShippingAddress.firstName)
                            .toEqual(options.defaultShippingAddress.firstName);
                        expect(actualDefaultShippingAddress.lastName)
                            .toEqual(options.defaultShippingAddress.lastName);
                        expect(actualDefaultShippingAddress.companyName)
                            .toEqual(options.defaultShippingAddress.companyName);
                        expect(actualDefaultShippingAddress.addressLine1)
                            .toEqual(options.defaultShippingAddress.addressLine1);
                        expect(actualDefaultShippingAddress.addressLine2)
                            .toEqual(options.defaultShippingAddress.addressLine2);
                        expect(actualDefaultShippingAddress.city)
                            .toEqual(options.defaultShippingAddress.city);
                        expect(actualDefaultShippingAddress.state)
                            .toEqual(options.defaultShippingAddress.state);
                        expect(actualDefaultShippingAddress.postalCode)
                            .toEqual(options.defaultShippingAddress.postalCode);
                        expect(actualDefaultShippingAddress.countryCode)
                            .toEqual(options.defaultShippingAddress.countryCode);
                        expect(actualDefaultShippingAddress.residence)
                            .toEqual(options.defaultShippingAddress.residence);
                    });

                    it("should set shippingMethods", function () {
                        expect(companyModel.setShippingMethods).toHaveBeenCalledWith(options.shippingMethods);
                    });
                });
            });

            describe("has a sync function that", function () {
                it("is defined", function () {
                    expect(companyModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.sync).toEqual(jasmine.any(Function));
                });

                describe("when the method is read", function () {
                    beforeEach(function () {
                        spyOn(companyModel, "trigger").and.callThrough();
                        spyOn(companyModel, "fetchAuthorizationProfiles").and.callFake(function () {});
                        companyModel.sync("read", companyModel);
                    });

                    it("should call fetchAuthorizationProfiles", function () {
                        expect(companyModel.fetchAuthorizationProfiles).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a setDepartments function that", function () {
                var mockDepartments = [
                    {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    },
                    {
                        id: "2456724567",
                        name: "Dewey, Cheetum and Howe",
                        visible: false
                    }
                ];

                beforeEach(function () {
                    spyOn(companyModel, "set").and.callThrough();

                    companyModel.setDepartments(mockDepartments);
                });

                it("is defined", function () {
                    expect(companyModel.setDepartments).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.setDepartments).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(companyModel.set).toHaveBeenCalled();
                    expect(companyModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(companyModel.set.calls.mostRecent().args[0]).toEqual("departments");
                });

                describe("when building a new object to set the departments property with", function () {
                    var newDepartments;

                    beforeEach(function () {
                        newDepartments = companyModel.set.calls.mostRecent().args[1];
                    });

                    it("should be the same size as the parameter passed", function () {
                        expect(utils._.size(newDepartments)).toEqual(utils._.size(mockDepartments));
                    });

                    it("should include all the mock departments", function () {
                        var newDepartment;

                        // find all elements in the newDepartments that have a matching key with the default values
                        utils._.each(mockDepartments, function (mockDepartment, key) {
                            newDepartment = newDepartments.at(key);

                            expect(newDepartment).not.toBeNull();
                            expect(newDepartment.get("id")).toEqual(mockDepartment.id);
                            expect(newDepartment.get("name")).toEqual(mockDepartment.name);
                            expect(newDepartment.get("visible")).toEqual(mockDepartment.visible);
                        });
                    });
                });
            });

            describe("has a setRequiredFields function that", function () {
                var mockRequiredFields = [
                        "REQUIRED_FIELD_1",
                        "REQUIRED_FIELD_2",
                        "REQUIRED_FIELD_3"
                    ];

                beforeEach(function () {
                    spyOn(companyModel, "set").and.callThrough();

                    companyModel.setRequiredFields(mockRequiredFields);
                });

                it("is defined", function () {
                    expect(companyModel.setRequiredFields).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.setRequiredFields).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(companyModel.set).toHaveBeenCalled();
                    expect(companyModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(companyModel.set.calls.mostRecent().args[0]).toEqual("requiredFields");
                });

                describe("when building a new object to set the requiredFields property with", function () {
                    var newRequiredFields;

                    beforeEach(function () {
                        newRequiredFields = companyModel.set.calls.mostRecent().args[1];
                    });

                    it("should include all the default requiredFields", function () {
                        var numOfMatches = 0;

                        // find all elements in the newRequiredFields that have a matching key with the default values
                        utils._.each(companyModel.defaults.requiredFields, function (value, key) {
                            if (utils._.has(newRequiredFields, key)) {
                                numOfMatches += 1;
                            }
                        });

                        expect(numOfMatches).toEqual(utils._.size(companyModel.defaults.requiredFields));
                    });

                    it("should set only the passed in requiredFields to true", function () {
                        var trueRequiredFields = {},
                            matchingRequiredFields;

                        // find all elements in newRequiredFields that are set to true
                        utils._.each(newRequiredFields, function (value, key) {
                            if (value) {
                                trueRequiredFields[key] = value;
                            }
                        });

                        // get all the trueRequiredFields that match the mockRequiredFields
                        matchingRequiredFields = utils._.pick(trueRequiredFields, mockRequiredFields);

                        expect(utils._.size(matchingRequiredFields)).toEqual(utils._.size(mockRequiredFields));
                    });
                });
            });

            describe("has a setShippingMethods function that", function () {
                var mockShippingMethods = [
                        {
                            id: "134613456",
                            name: "UNASSIGNED",
                            cost: 3.14,
                            poBoxAllowed: true
                        },
                        {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            cost: 6.66,
                            poBoxAllowed: false
                        }
                    ];

                beforeEach(function () {
                    spyOn(companyModel, "set").and.callThrough();

                    companyModel.setShippingMethods(mockShippingMethods);
                });

                it("is defined", function () {
                    expect(companyModel.setShippingMethods).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.setShippingMethods).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(companyModel.set).toHaveBeenCalled();
                    expect(companyModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(companyModel.set.calls.mostRecent().args[0]).toEqual("shippingMethods");
                });

                describe("when building a new object to set the shippingMethods property with", function () {
                    var newShippingMethods;

                    beforeEach(function () {
                        newShippingMethods = companyModel.set.calls.mostRecent().args[1];
                    });

                    it("should be the same size as the parameter passed", function () {
                        expect(utils._.size(newShippingMethods)).toEqual(utils._.size(mockShippingMethods));
                    });

                    it("should include all the mock shippingMethods", function () {
                        var newShippingMethod;

                        // find all elements in the newShippingMethods that have a matching key with the default values
                        utils._.each(mockShippingMethods, function (mockShippingMethod, key) {
                            newShippingMethod = newShippingMethods.at(key);

                            expect(newShippingMethod).not.toBeNull();
                            expect(newShippingMethod.get("id")).toEqual(mockShippingMethod.id);
                            expect(newShippingMethod.get("name")).toEqual(mockShippingMethod.name);
                            expect(newShippingMethod.get("cost")).toEqual(mockShippingMethod.cost);
                            expect(newShippingMethod.get("poBoxAllowed")).toEqual(mockShippingMethod.poBoxAllowed);
                        });
                    });
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(companyModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when departments does have a value", function () {
                    var departments,
                        mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            departments: [
                                {
                                    id: "134613456",
                                    name: "UNASSIGNED",
                                    visible: true
                                },
                                {
                                    id: "2456724567",
                                    name: "Dewey, Cheetum and Howe",
                                    visible: false
                                }
                            ],
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);
                        departments = companyModel.get("departments");

                        spyOn(departments, "toJSON").and.callThrough();
                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on departments", function () {
                        expect(departments.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when departments does NOT have a value", function () {
                    var mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);

                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when settings does have a value", function () {
                    var settings,
                        mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            settings: {
                                cardSettings: {
                                    customVehicleIdMaxLength: 17,
                                    licensePlateNumberMaxLength: 10,
                                    licensePlateStateFixedLength: 2,
                                    vehicleDescriptionMaxLength: 17,
                                    vinFixedLength: 17
                                },
                                driverSettings: {
                                    idFixedLength: 4,
                                    firstNameMaxLength: 11,
                                    middleNameMaxLength: 1,
                                    lastNameMaxLength: 12
                                }
                            },
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);
                        settings = companyModel.get("settings");

                        spyOn(settings, "toJSON").and.callThrough();
                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on settings", function () {
                        expect(settings.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when settings does NOT have a value", function () {
                    var mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);

                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when authorizationProfiles does have a value", function () {
                    var authorizationProfiles,
                        mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);
                        authorizationProfiles = new Backbone.Collection();
                        mockCompanyModel.authorizationProfiles = authorizationProfiles.toJSON();
                        companyModel.set("authorizationProfiles", authorizationProfiles);

                        spyOn(authorizationProfiles, "toJSON").and.callThrough();
                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on authorizationProfiles", function () {
                        expect(authorizationProfiles.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when authorizationProfiles does NOT have a value", function () {
                    var mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);

                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when defaultShippingAddress does have a value", function () {
                    var defaultShippingAddress,
                        mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            defaultShippingAddress: {
                                firstName: "First Name",
                                lastName: "Last Name",
                                companyName: "Company Name",
                                addressLine1: "Address Line 1",
                                addressLine2: "Address Line 2",
                                city: "City",
                                state: "State",
                                postalCode: "Postal Code",
                                countryCode: "Country Code",
                                residence: true
                            },
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);
                        defaultShippingAddress = companyModel.get("defaultShippingAddress");

                        spyOn(defaultShippingAddress, "toJSON").and.callThrough();
                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on defaultShippingAddress", function () {
                        expect(defaultShippingAddress.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when defaultShippingAddress does NOT have a value", function () {
                    var mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);

                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when shippingMethods does have a value", function () {
                    var shippingMethods,
                        mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            shippingMethods: [
                                {
                                    id: "134613456",
                                    name: "UNASSIGNED",
                                    cost: 3.14,
                                    poBoxAllowed: true,
                                    formattedName: null
                                },
                                {
                                    id: "2456724567",
                                    name: "Dewey, Cheetum and Howe",
                                    cost: 6.66,
                                    poBoxAllowed: false,
                                    formattedName: null
                                }
                            ],
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);
                        shippingMethods = companyModel.get("shippingMethods");
                        // Wipe out the formattedName attribute that is added in the initialize function
                        shippingMethods.each(function (shippingMethod) {
                            shippingMethod.set("formattedName", null);
                        });

                        spyOn(shippingMethods, "toJSON").and.callThrough();
                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on shippingMethods", function () {
                        expect(shippingMethods.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });

                describe("when shippingMethods does NOT have a value", function () {
                    var mockCompanyModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanyModel = {
                            name: "Beavis and Butthead Inc",
                            accountId: "3673683",
                            wexAccountNumber: "5764309",
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);

                        spyOn(CompanyModel.__super__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });
            });
            
            describe("has a fetchAuthorizationProfiles function that", function () {
                var mockCompanyJSON = {
                    accountId: "3456256"
                };

                beforeEach(function () {
                    spyOn(mockUtils, "fetchCollection").and.callFake(function() {});
                    spyOn(companyModel, "set").and.callThrough();
                    spyOn(companyModel, "toJSON").and.callFake(function() { return mockCompanyJSON});

                    companyModel.fetchAuthorizationProfiles();
                });

                it("is defined", function () {
                    expect(companyModel.fetchAuthorizationProfiles).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.fetchAuthorizationProfiles).toEqual(jasmine.any(Function));
                });

                it("should call toJSON", function () {
                    expect(companyModel.toJSON).toHaveBeenCalledWith();
                });

                it("should call fetchCollection on utils", function () {
                    expect(mockUtils.fetchCollection)
                        .toHaveBeenCalledWith(mockAuthorizationProfileCollection, mockCompanyJSON);
                });

                it("should call set", function () {
                    expect(companyModel.set)
                        .toHaveBeenCalledWith("authorizationProfiles", mockAuthorizationProfileCollection);
                });
            });

            describe("has an areFetchedPropertiesEmpty function that", function () {
                it("is defined", function () {
                    expect(companyModel.areFetchedPropertiesEmpty).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.areFetchedPropertiesEmpty).toEqual(jasmine.any(Function));
                });

                it("returns true when the authorizationProfiles property is null", function () {
                    companyModel.set("authorizationProfiles", null);

                    expect(companyModel.areFetchedPropertiesEmpty()).toBeTruthy();
                });

                it("returns true when the authorizationProfiles property is empty", function () {
                    companyModel.set("authorizationProfiles", []);

                    expect(companyModel.areFetchedPropertiesEmpty()).toBeTruthy();
                });

                it("returns true when the authorizationProfiles property has a size of 0", function () {
                    var collection = new Backbone.Collection();

                    companyModel.set("authorizationProfiles", collection);

                    expect(companyModel.areFetchedPropertiesEmpty()).toBeTruthy();
                });

                it("returns false when the authorizationProfiles property contains a model", function () {
                    var collection = new Backbone.Collection(),
                        model = new Backbone.Model();

                    collection.add(model);

                    companyModel.set("authorizationProfiles", collection);

                    expect(companyModel.areFetchedPropertiesEmpty()).toBeFalsy();
                });
            });
        });
    });
