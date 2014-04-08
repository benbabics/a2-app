define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            departmentModel;

        squire.mock("backbone", Backbone);

        describe("A Department Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DepartmentModel"], function (DepartmentModel) {
                    departmentModel = new DepartmentModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(departmentModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(departmentModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set id to default", function () {
                    expect(departmentModel.defaults.id).toBeNull();
                });

                it("should set name to default", function () {
                    expect(departmentModel.defaults.name).toBeNull();
                });

                it("should set visible to default", function () {
                    expect(departmentModel.defaults.visible).toBeFalsy();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(departmentModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(departmentModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(departmentModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        departmentModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(departmentModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        departmentModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(departmentModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        id     : "2457624567",
                        name   : "Mock Name",
                        visible: true
                    };

                    beforeEach(function () {
                        departmentModel.initialize(options);
                    });

                    it("should call set 3 times", function () {
                        expect(departmentModel.set.calls.count()).toEqual(3);
                    });

                    it("should set id", function () {
                        expect(departmentModel.set).toHaveBeenCalledWith("id", options.id);
                    });

                    it("should set name", function () {
                        expect(departmentModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set visible", function () {
                        expect(departmentModel.set).toHaveBeenCalledWith("visible", options.visible);
                    });

                    describe("that includes name and displayValue", function () {
                        var options = {
                            name        : "Mock Name",
                            displayValue: "Mock Display Value"
                        };

                        beforeEach(function () {
                            departmentModel.initialize(options);
                        });

                        it("should set name using name", function () {
                            expect(departmentModel.set).toHaveBeenCalledWith("name", options.name);
                        });

                        it("should not set name using displayValue", function () {
                            expect(departmentModel.set).not.toHaveBeenCalledWith("name", options.displayValue);
                        });
                    });

                    describe("that includes displayValue and not name", function () {
                        var options = {
                            displayValue: "Mock Display Value"
                        };

                        beforeEach(function () {
                            departmentModel.initialize(options);
                        });

                        it("should set name using displayValue", function () {
                            expect(departmentModel.set).toHaveBeenCalledWith("name", options.displayValue);
                        });
                    });
                });
            });
        });
    });
