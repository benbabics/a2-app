define(["Squire", "utils", "models/DepartmentModel", "collections/DepartmentCollection", "backbone", "backbone-relational"],
    function (Squire, utils, DepartmentModel, DepartmentCollection, Backbone) {

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

            it("looks like a Backbone RelationalModel", function () {
                expect(companyModel instanceof Backbone.RelationalModel).toBeTruthy();
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
            });

            describe("has property relations that", function () {
                describe("has a department relation that", function () {
                    it("should set type to Backbone.HasMany", function () {
                        expect(companyModel.relations[0].type).toEqual(Backbone.HasMany);
                    });

                    it("should set key to departments", function () {
                        expect(companyModel.relations[0].key).toEqual("departments");
                    });

                    it("should set relatedModel to DepartmentModel", function () {
                        expect(companyModel.relations[0].relatedModel).toEqual(DepartmentModel);
                    });

                    it("should set collectionType to DepartmentCollection", function () {
                        expect(companyModel.relations[0].collectionType).toEqual(DepartmentCollection);
                    });
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(companyModel, "set").and.callThrough();
                    spyOn(companyModel, "get").and.callThrough();
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
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        companyModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(companyModel.set).not.toHaveBeenCalled();
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
                            ]
                        };

                    beforeEach(function () {
                        spyOn(companyModel, "setDepartments").and.callFake(function () {});

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

                        // find all elements in the newDepartments that have a matching key with the default permissions
                        utils._.each(mockDepartments, function (mockDepartment, key, list) {
                            newDepartment = newDepartments.at(key);

                            expect(newDepartment).not.toBeNull();
                            expect(newDepartment.get("departmentId")).toEqual(mockDepartment.id);
                            expect(newDepartment.get("name")).toEqual(mockDepartment.name);
                            expect(newDepartment.get("visible")).toEqual(mockDepartment.visible);
                        });
                    });
                });
            });
        });
    });
