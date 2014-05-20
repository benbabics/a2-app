define(["backbone", "Squire"],
    function (Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            hierarchyController;

        describe("A Hierarchy Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/HierarchyController"], function (HierarchyController) {
                    hierarchyController = HierarchyController;

                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchyController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(hierarchyController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    hierarchyController.init();
                });

                it("is defined", function () {
                    expect(hierarchyController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyController.init).toEqual(jasmine.any(Function));
                });
            });
        });
    });
