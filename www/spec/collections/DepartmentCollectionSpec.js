define(["utils", "globals", "Squire", "models/DepartmentModel"],
    function (utils, globals, Squire, DepartmentModel) {
        "use strict";

        var squire = new Squire(),
            departmentCollection;

        squire.mock("models/DepartmentModel", DepartmentModel);

        describe("A Department Collection", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function(done) {
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
        });
    });
