define(["backbone", "Squire", "mustache", "globals", "utils",
        "text!tmpl/hierarchy/hierarchy.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            HierarchyView,
            hierarchyView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);

        describe("A Hierarchy View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "./";

            beforeEach(function (done) {
                squire.require(["views/HierarchyView"], function (JasmineHierarchyView) {
                    loadFixtures("index.html");

                    HierarchyView = JasmineHierarchyView;

                    hierarchyView = new HierarchyView();

                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchyView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(hierarchyView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(hierarchyView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el nodeName", function () {
                    expect(hierarchyView.el.nodeName).toEqual("LI");
                });

                it("should set the template", function () {
                    expect(hierarchyView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(HierarchyView.__super__, "initialize").and.callFake(function () {});

                    hierarchyView.initialize();
                });

                it("is defined", function () {
                    expect(hierarchyView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(HierarchyView.__super__.initialize).toHaveBeenCalledWith();
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").and.callThrough();

                    hierarchyView.initialize();
                    hierarchyView.render();
                });

                it("is defined", function () {
                    expect(hierarchyView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(hierarchyView.template);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = hierarchyView.$el;

                    expectedContent = Mustache.render(pageTemplate);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
