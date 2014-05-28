define(["Squire", "backbone", "utils", "globals", "collections/HierarchyCollection", "models/CompanyModel",
        "models/HierarchyModel"],
    function (Squire, Backbone, utils, globals, HierarchyCollection, CompanyModel, HierarchyModel) {

        "use strict";

        var squire = new Squire(),
            companyModel = new CompanyModel(),
            userModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/CompanyModel", Squire.Helpers.returns(companyModel));
        squire.mock("models/HierarchyModel", HierarchyModel);
        squire.mock("models/HierarchyCollection", HierarchyCollection);

        describe("A User Model", function () {
            beforeEach(function (done) {
                squire.require(["models/UserModel"], function (UserModel) {
                    userModel = UserModel.getInstance();

                    done();
                });
            });

            it("is defined", function () {
                expect(userModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(userModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set authenticated to default", function () {
                    expect(userModel.defaults.authenticated).toBeFalsy();
                });

                it("should set firstName to default", function () {
                    expect(userModel.defaults.firstName).toBeNull();
                });

                it("should set email to default", function () {
                    expect(userModel.defaults.email).toBeNull();
                });

                it("should set selectedCompany to default", function () {
                    expect(userModel.defaults.selectedCompany).toBeNull();
                });

                it("should set hasMultipleAccounts to default", function () {
                    expect(userModel.defaults.hasMultipleAccounts).toBeFalsy();
                });
            });

            describe("has a parse function that", function () {
                beforeEach(function () {
                    spyOn(companyModel, "parse").and.callFake(function () {});
                    spyOn(userModel, "setHierarchies").and.callFake(function () {});
                    spyOn(userModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(userModel.parse).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.parse).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        userModel.parse();
                    });

                    it("should NOT call set", function () {
                        expect(userModel.set).not.toHaveBeenCalled();
                        expect(companyModel.parse).not.toHaveBeenCalled();
                        expect(userModel.setHierarchies).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        userModel.parse(options);
                    });

                    it("should NOT call set", function () {
                        expect(userModel.set).not.toHaveBeenCalled();
                        expect(companyModel.parse).not.toHaveBeenCalled();
                        expect(userModel.setHierarchies).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            authenticated: true,
                            firstName: "Beavis",
                            email: "cornholio@bnbinc.com",
                            hasMultipleAccounts: true,
                            selectedCompany: {
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
                                }
                            },
                            hierarchyDetails: [
                                {
                                    "accountId"    : "652b34b6465",
                                    "name"         : "Name A",
                                    "displayNumber": "Number A",
                                    "children"     : [
                                        {
                                            "accountId"    : "652b34b6465",
                                            "name"         : "Name 1",
                                            "displayNumber": "Number 1"
                                        },
                                        {
                                            "accountId"    : "26n24561",
                                            "name"         : "Name 2",
                                            "displayNumber": "Number 2"
                                        },
                                        {
                                            "accountId"    : "2b56245n7",
                                            "name"         : "Name 3",
                                            "displayNumber": "Number 3"
                                        }
                                    ]
                                },
                                {
                                    "accountId"    : "25672m7217",
                                    "name"         : "Name B",
                                    "displayNumber": "Number B",
                                    "children"     : [
                                        {
                                            "accountId"    : "25762n71",
                                            "name"         : "Name 1",
                                            "displayNumber": "Number 1"
                                        }
                                    ]
                                }
                            ]
                        };

                    beforeEach(function () {
                        userModel.parse(options);
                    });

                    it("should call set 5 times", function () {
                        expect(userModel.set.calls.count()).toEqual(5);
                    });

                    it("should set authenticated", function () {
                        expect(userModel.set).toHaveBeenCalledWith("authenticated", options.authenticated);
                    });

                    it("should set firstName", function () {
                        expect(userModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set email", function () {
                        expect(userModel.set).toHaveBeenCalledWith("email", options.email);
                    });

                    it("should call parse on the CompanyModel", function () {
                        expect(companyModel.parse).toHaveBeenCalledWith(options.selectedCompany);
                    });

                    it("should set selectedCompany", function () {
                        expect(userModel.set).toHaveBeenCalledWith("selectedCompany", companyModel);
                    });

                    it("should set hasMultipleAccounts", function () {
                        expect(userModel.set).toHaveBeenCalledWith("hasMultipleAccounts", options.hasMultipleAccounts);
                    });

                    it("should set hierarchies", function () {
                        expect(userModel.setHierarchies).toHaveBeenCalledWith(options.hierarchyDetails);
                    });
                });
            });

            describe("has a setHierarchies function that", function () {
                var mockHierarchies = [
                        {
                            "accountId"    : "652b34b6465",
                            "name"         : "Name A",
                            "displayNumber": "Number A",
                            "children"     : [
                                {
                                    "accountId"    : "652b34b6465",
                                    "name"         : "Name 1",
                                    "displayNumber": "Number 1"
                                },
                                {
                                    "accountId"    : "26n24561",
                                    "name"         : "Name 2",
                                    "displayNumber": "Number 2"
                                },
                                {
                                    "accountId"    : "2b56245n7",
                                    "name"         : "Name 3",
                                    "displayNumber": "Number 3"
                                }
                            ]
                        },
                        {
                            "accountId"    : "25672m7217",
                            "name"         : "Name B",
                            "displayNumber": "Number B",
                            "children"     : [
                                {
                                    "accountId"    : "25762n71",
                                    "name"         : "Name 1",
                                    "displayNumber": "Number 1"
                                }
                            ]
                        }
                    ];

                beforeEach(function () {
                    spyOn(userModel, "set").and.callThrough();

                    userModel.setHierarchies(mockHierarchies);
                });

                it("is defined", function () {
                    expect(userModel.setHierarchies).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.setHierarchies).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(userModel.set).toHaveBeenCalled();
                    expect(userModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(userModel.set.calls.mostRecent().args[0]).toEqual("hierarchies");
                });

                describe("when building a new object to set the hierarchies property with", function () {
                    var newHierarchies;

                    beforeEach(function () {
                        newHierarchies = userModel.set.calls.mostRecent().args[1];
                    });

                    it("should be the same size as the parameter passed", function () {
                        expect(utils._.size(newHierarchies)).toEqual(utils._.size(mockHierarchies));
                    });

                    it("should include all the mock hierarchies", function () {
                        var newHierarchy;

                        // find all elements in the newHierarchies that have a matching key with the default values
                        utils._.each(mockHierarchies, function (mockDepartment, key) {
                            newHierarchy = newHierarchies.at(key);

                            expect(newHierarchy).not.toBeNull();
                            expect(newHierarchy.get("accountId")).toEqual(mockDepartment.accountId);
                            expect(newHierarchy.get("name")).toEqual(mockDepartment.name);
                            expect(newHierarchy.get("displayNumber")).toEqual(mockDepartment.displayNumber);
                        });
                    });
                });
            });

            describe("has a reset function that", function () {
                beforeEach(function () {
                    spyOn(userModel, "set").and.callThrough();

                    userModel.reset();
                });

                it("is defined", function () {
                    expect(userModel.reset).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.reset).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(userModel.set).toHaveBeenCalledWith(userModel.defaults);
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(userModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when selectedCompany does have a value", function () {
                    var selectedCompany,
                        mockUserModel,
                        actualValue;

                    beforeEach(function () {
                        mockUserModel = {
                            authenticated: true,
                            firstName: "Beavis",
                            email: "cornholio@bnbinc.com",
                            hasMultipleAccounts: true,
                            selectedCompany: {
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
                                requiredFields: globals.companyData.requiredFields,
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
                                authorizationProfiles : null,
                                bankAccounts : null,
                                defaultShippingAddress : null,
                                shippingMethods : null,
                                permissions: globals.companyData.permissions
                            }
                        };
                        userModel.clear();
                        userModel.parse(mockUserModel);
                        selectedCompany = userModel.get("selectedCompany");

                        spyOn(selectedCompany, "toJSON").and.callThrough();
                        spyOn(userModel.__proto__.constructor.__super__, "toJSON").and.callThrough();

                        actualValue = userModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(userModel.__proto__.constructor.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on selectedCompany", function () {
                        expect(selectedCompany.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockUserModel);
                    });
                });

                describe("when selectedCompany does NOT have a value", function () {
                    var mockUserModel,
                        actualValue;

                    beforeEach(function () {
                        mockUserModel = {
                            authenticated : true,
                            firstName     : "Beavis",
                            email         : "cornholio@bnbinc.com"
                        };
                        userModel.clear();
                        userModel.parse(mockUserModel);

                        spyOn(userModel.__proto__.constructor.__super__, "toJSON").and.callThrough();

                        actualValue = userModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(userModel.__proto__.constructor.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockUserModel);
                    });
                });

                describe("when hierarchies does have a value", function () {
                    var hierarchies,
                        mockUserModel,
                        actualValue;

                    beforeEach(function () {
                        mockUserModel = {
                            authenticated: true,
                            firstName: "Beavis",
                            email: "cornholio@bnbinc.com",
                            hasMultipleAccounts: true,
                            hierarchies: [
                                {
                                    "accountId"    : "652b34b6465",
                                    "name"         : "Name A",
                                    "displayNumber": "Number A",
                                    "children"     : [
                                        {
                                            "accountId"    : "652b34b6465",
                                            "name"         : "Name 1",
                                            "displayNumber": "Number 1",
                                            "children"     : null
                                        },
                                        {
                                            "accountId"    : "26n24561",
                                            "name"         : "Name 2",
                                            "displayNumber": "Number 2",
                                            "children"     : null
                                        },
                                        {
                                            "accountId"    : "2b56245n7",
                                            "name"         : "Name 3",
                                            "displayNumber": "Number 3",
                                            "children"     : null
                                        }
                                    ]
                                },
                                {
                                    "accountId"    : "25672m7217",
                                    "name"         : "Name B",
                                    "displayNumber": "Number B",
                                    "children"     : [
                                        {
                                            "accountId"    : "25762n71",
                                            "name"         : "Name 1",
                                            "displayNumber": "Number 1",
                                            "children"     : null
                                        }
                                    ]
                                }
                            ]
                        };
                        userModel.clear();
                        userModel.parse(mockUserModel);
                        userModel.setHierarchies(mockUserModel.hierarchies);
                        hierarchies = userModel.get("hierarchies");

                        spyOn(userModel.__proto__.constructor.__super__, "toJSON").and.callThrough();
                        spyOn(hierarchies, "toJSON").and.callThrough();

                        actualValue = userModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(userModel.__proto__.constructor.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on hierarchies", function () {
                        expect(hierarchies.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockUserModel);
                    });
                });

                describe("when hierarchies does NOT have a value", function () {
                    var mockUserModel,
                        actualValue;

                    beforeEach(function () {
                        mockUserModel = {
                            authenticated: true,
                            firstName: "Beavis",
                            email: "cornholio@bnbinc.com",
                            hasMultipleAccounts: true,
                            selectedCompany: {
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
                                requiredFields: globals.companyData.requiredFields,
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
                                authorizationProfiles : null,
                                bankAccounts : null,
                                defaultShippingAddress : null,
                                shippingMethods : null,
                                permissions: globals.companyData.permissions
                            }
                        };
                        userModel.clear();
                        userModel.parse(mockUserModel);

                        spyOn(userModel.__proto__.constructor.__super__, "toJSON").and.callThrough();

                        actualValue = userModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(userModel.__proto__.constructor.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockUserModel);
                    });
                });
            });
        });
    });
