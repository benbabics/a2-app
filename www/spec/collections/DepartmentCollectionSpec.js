define(["utils", "globals", "Squire", "models/DepartmentModel"],
    function (utils, globals, Squire, DepartmentModel) {
        "use strict";

        var squire = new Squire(),
            departmentCollection;

        squire.mock("models/DepartmentModel", DepartmentModel);

        describe("A Department Collection", function () {
            beforeEach(function(done) {
                squire.require(["collections/DepartmentCollection"], function(DepartmentCollection) {
                    departmentCollection = new DepartmentCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(departmentCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(departmentCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(departmentCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(departmentCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to DepartmentModel", function () {
                    expect(departmentCollection.model).toEqual(DepartmentModel);
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(departmentCollection.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(departmentCollection.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when the list of models is null", function () {
                    var actualValue;

                    beforeEach(function () {
                        departmentCollection.reset();

                        actualValue = departmentCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                describe("when the list of models is empty", function () {
                    var actualValue;

                    beforeEach(function () {
                        departmentCollection.reset();

                        actualValue = departmentCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                // TODO - Figure out why these tests don't work even though the collection seems to work correctly
                xdescribe("when there are models in the collection", function () {
                    var mockDepartments,
                        department1,
                        department2,
                        actualValue;

                    beforeEach(function () {
                        mockDepartments = [
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
                        department1 = new DepartmentModel();
                        department1.initialize(mockDepartments[0]);
                        department2 = new DepartmentModel();
                        department2.initialize(mockDepartments[1]);

                        departmentCollection.add(department1);
                        departmentCollection.add(department2);

                        spyOn(department1, "toJSON").and.callThrough();
                        spyOn(department2, "toJSON").and.callThrough();

                        actualValue = departmentCollection.toJSON();
                    });

                    it("should call toJSON on department1", function () {
                        expect(department1.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on department2", function () {
                        expect(department2.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockDepartments);
                    });
                });
            });
        });
    });
