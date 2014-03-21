define(["Squire", "models/DepartmentModel", "backbone", "backbone-relational"],
    function (Squire, DepartmentModel, Backbone) {

        "use strict";

        var squire = new Squire(),
            driverModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/DepartmentModel", DepartmentModel);

        describe("A Driver Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverModel"], function (DriverModel) {
                    driverModel = new DriverModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverModel).toBeDefined();
            });

            it("looks like a Backbone Relational model", function () {
                expect(driverModel instanceof Backbone.RelationalModel).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set driverId to default", function () {
                    expect(driverModel.defaults.driverId).toBeNull();
                });

                it("should set firstName to default", function () {
                    expect(driverModel.defaults.firstName).toBeNull();
                });

                it("should set middleName to default", function () {
                    expect(driverModel.defaults.middleName).toBeNull();
                });

                it("should set lastName to default", function () {
                    expect(driverModel.defaults.lastName).toBeNull();
                });

                it("should set status to default", function () {
                    expect(driverModel.defaults.status).toBeNull();
                });

                it("should set statusDate to default", function () {
                    expect(driverModel.defaults.statusDate).toBeNull();
                });

                it("should set department to default", function () {
                    expect(driverModel.defaults.department).toBeNull();
                });

                it("should set formattedName to default", function () {
                    expect(driverModel.defaults.formattedName).toBeNull();
                });
            });

            describe("has property relations that", function () {
                describe("has a department relation that", function () {
                    it("should set type to Backbone.HasOne", function () {
                        expect(driverModel.relations[0].type).toEqual(Backbone.HasOne);
                    });

                    it("should set key to department", function () {
                        expect(driverModel.relations[0].key).toEqual("department");
                    });

                    it("should set relatedModel to DepartmentModel", function () {
                        expect(driverModel.relations[0].relatedModel).toEqual(DepartmentModel);
                    });
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(driverModel, "set").and.callThrough();
                    spyOn(driverModel, "formatAttributes").and.callFake(function () {});
                });

                it("is defined", function () {
                    expect(driverModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        driverModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(driverModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        driverModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(driverModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            driverId: "13465134561",
                            firstName: "First Name",
                            middleName: "Middle Name",
                            lastName: "Last Name",
                            status: "Active",
                            statusDate: "3/14/2015",
                            department: {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            }
                        };

                    beforeEach(function () {
                        driverModel.initialize(options);
                    });

                    it("should call set 7 times", function () {
                        expect(driverModel.set.calls.count()).toEqual(7);
                    });

                    it("should set driverId", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("driverId", options.driverId);
                    });

                    it("should set firstName", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set middleName", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("middleName", options.middleName);
                    });

                    it("should set lastName", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("lastName", options.lastName);
                    });

                    it("should set status", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("status", options.status);
                    });

                    it("should set statusDate", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("statusDate", options.statusDate);
                    });

                    // TODO - Replace with something that verifies that a new DepartmentModel was created, the correct
                    // parameter was passed to the DepartmentModel.initialize function and then set to "department"
                    it("should set department", function () {
                        var actualDepartment;

                        expect(driverModel.set.calls.argsFor(6).length).toEqual(2);
                        expect(driverModel.set.calls.argsFor(6)[0]).toEqual("department");

                        actualDepartment = driverModel.set.calls.argsFor(6)[1];

                        expect(actualDepartment.get("departmentId")).toEqual(options.department.id);
                        expect(actualDepartment.get("name")).toEqual(options.department.name);
                        expect(actualDepartment.get("visible")).toEqual(options.department.visible);
                    });
                });

                it("should call formatAttributes", function () {
                    driverModel.initialize();
                    expect(driverModel.formatAttributes).toHaveBeenCalledWith();
                });
            });

            describe("has a formatAttributes function that", function () {
                beforeEach(function () {
                    // re-initialize the model
                    driverModel.set(driverModel.defaults);

                    spyOn(driverModel, "set").and.callThrough();

                    driverModel.formatAttributes();
                });

                it("is defined", function () {
                    expect(driverModel.formatAttributes).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.formatAttributes).toEqual(jasmine.any(Function));
                });

                it("should call set 1 time", function () {
                    expect(driverModel.set.calls.count()).toEqual(1);
                });

                it("should set name", function () {
                    expect(driverModel.set).toHaveBeenCalledWith("formattedName", jasmine.any(Function));
                });

                describe("when calling the callback function", function () {
                    var callback,
                        actualResult,
                        expectedResult,
                        first = "First",
                        middle = "Middle",
                        last = "Last";

                    beforeEach(function () {
                        driverModel.formatAttributes();
                        callback = driverModel.set.calls.mostRecent().args[1];
                    });

                    describe("when first, middle and last names all have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", last);

                            expectedResult = last + ", " + first + " " + middle;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first name does not have a value", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", last);

                            expectedResult = last;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when middle name does not have a value", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", last);

                            expectedResult = last + ", " + first;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when last name does not have a value", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", null);

                            expectedResult = first + " " + middle;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first and middle names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", last);

                            expectedResult = last;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first and last names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", null);

                            expectedResult = "";
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when middle and last names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", null);

                            expectedResult = first;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first, middle and last names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", null);

                            expectedResult = "";
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });
                });
            });
        });
    });
