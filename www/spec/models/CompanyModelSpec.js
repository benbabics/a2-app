define(["Squire", "models/DepartmentModel", "collections/DepartmentCollection", "backbone", "backbone-relational"],
    function (Squire, DepartmentModel, DepartmentCollection, Backbone) {

        "use strict";

        var squire = new Squire(),
            companyModel;

        squire.mock("backbone", Backbone);
        squire.mock("collections/DepartmentCollection", DepartmentCollection);
        squire.mock("models/DepartmentModel", DepartmentModel);

        describe("A Company Model", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
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
                    spyOn(companyModel, "set").andCallThrough();
                    spyOn(companyModel, "get").andCallThrough();
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
                    var departments,
                        options = {
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
                        departments = companyModel.get("departments");
                        spyOn(departments, "add").andCallThrough();

                        companyModel.initialize(options);
                    });

                    it("should call set 4 times", function () {
                        expect(companyModel.set.calls.length).toEqual(4);
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

                    it("should get the departments collection", function () {
                        expect(companyModel.get).toHaveBeenCalledWith("departments");
                    });

                    it("should call add on the departments collection 2 times", function () {
                        expect(departments.add.calls.length).toEqual(2);
                    });

                    // TODO - Replace with something that verifies that a new DepartmentModel was created, the correct
                    // parameter was passed to the DepartmentModel.initialize function and then added to the
                    // DepartmentCollection
                    it("should set departments", function () {
                        var departmentAdded;

                        departmentAdded = departments.add.calls[0].args[0];
                        expect(departmentAdded.get("departmentId")).toEqual(options.departments[0].id);
                        expect(departmentAdded.get("name")).toEqual(options.departments[0].name);
                        expect(departmentAdded.get("visible")).toEqual(options.departments[0].visible);

                        departmentAdded = departments.add.calls[1].args[0];
                        expect(departmentAdded.get("departmentId")).toEqual(options.departments[1].id);
                        expect(departmentAdded.get("name")).toEqual(options.departments[1].name);
                        expect(departmentAdded.get("visible")).toEqual(options.departments[1].visible);
                    });
                });
            });
        });
    });
