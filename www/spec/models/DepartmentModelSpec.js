define(["Squire", "backbone", "backbone-relational"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            departmentModel;

        squire.mock("backbone", Backbone);

        describe("A Department Model", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["models/DepartmentModel"], function (DepartmentModel) {
                    departmentModel = new DepartmentModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(departmentModel).toBeDefined();
            });

            it("looks like a Backbone RelationalModel", function () {
                expect(departmentModel instanceof Backbone.RelationalModel).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set departmentId to default", function () {
                    expect(departmentModel.defaults.departmentId).toBeNull();
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
                    spyOn(departmentModel, "set").andCallThrough();
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
                        expect(departmentModel.set.calls.length).toEqual(3);
                    });

                    it("should set departmentId", function () {
                        expect(departmentModel.set).toHaveBeenCalledWith("departmentId", options.id);
                    });

                    it("should set name", function () {
                        expect(departmentModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set visible", function () {
                        expect(departmentModel.set).toHaveBeenCalledWith("visible", options.visible);
                    });
                });
            });
        });
    });
