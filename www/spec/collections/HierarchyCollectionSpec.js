define(["utils", "globals", "Squire", "models/HierarchyModel"],
    function (utils, globals, Squire, HierarchyModel) {
        "use strict";

        var squire = new Squire(),
            hierarchyCollection;

        squire.mock("models/HierarchyModel", HierarchyModel);

        describe("A Hierarchy Collection", function () {
            beforeEach(function(done) {
                squire.require(["collections/HierarchyCollection"], function(HierarchyCollection) {
                    hierarchyCollection = new HierarchyCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchyCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(hierarchyCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(hierarchyCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to HierarchyModel", function () {
                    expect(hierarchyCollection.model).toEqual(HierarchyModel);
                });
            });
        });
    });
