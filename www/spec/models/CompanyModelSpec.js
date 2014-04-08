define(["Squire", "utils", "globals", "models/DepartmentModel", "collections/DepartmentCollection", "backbone"],
    function (Squire, utils, globals, DepartmentModel, DepartmentCollection, Backbone) {

        "use strict";

        var squire = new Squire(),
            companyModel;

        squire.mock("backbone", Backbone);
        squire.mock("collections/DepartmentCollection", DepartmentCollection);
        squire.mock("models/DepartmentModel", DepartmentModel);

        describe("A Company Model", function () {
            beforeEach(function (done) {
                squire.require(["models/CompanyModel"], function (CompanyModel) {
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

                it("should set wexAccountNumber to default", function () {
                    expect(companyModel.defaults.wexAccountNumber).toBeNull();
                });

                it("should set accountId to default", function () {
                    expect(companyModel.defaults.accountId).toBeNull();
                });

                it("should set driverIdLength to default", function () {
                    expect(companyModel.defaults.driverIdLength).toBeNull();
                });

                it("should set departments to default", function () {
                    expect(companyModel.defaults.departments).toBeNull();
                });

                it("should set requiredFields to default", function () {
                    expect(companyModel.defaults.requiredFields).toEqual(globals.companyData.requiredFields);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(companyModel, "set").and.callThrough();
                    spyOn(companyModel, "get").and.callThrough();
                    spyOn(companyModel, "setDepartments").and.callFake(function () {});
                    spyOn(companyModel, "setRequiredFields").and.callFake(function () {});
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
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            name: "Beavis and Butthead Inc",
                            accountId: "2562456",
                            wexAccountNumber: "5764309",
                            driverIdLength: "4",
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
                            ]
                        };

                    beforeEach(function () {
                        companyModel.initialize(options);
                    });

                    it("should call set 4 times", function () {
                        expect(companyModel.set.calls.count()).toEqual(4);
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

                    it("should set driverIdLength", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("driverIdLength", options.driverIdLength);
                    });

                    it("should set departments", function () {
                        expect(companyModel.setDepartments).toHaveBeenCalledWith(options.departments);
                    });

                    it("should set requiredFields", function () {
                        expect(companyModel.setRequiredFields).toHaveBeenCalledWith(options.requiredFields);
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
                            driverIdLength: "4",
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
                        spyOn(companyModel.__proto__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(companyModel.__proto__.toJSON).toHaveBeenCalledWith();
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
                            driverIdLength: "4",
                            requiredFields: companyModel.defaults.requiredFields
                        };
                        companyModel.clear();
                        companyModel.initialize(mockCompanyModel);

                        spyOn(companyModel.__proto__, "toJSON").and.callThrough();

                        actualValue = companyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(companyModel.__proto__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanyModel);
                    });
                });
            });
        });
    });
