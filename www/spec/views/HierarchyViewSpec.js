define(["backbone", "Squire", "mustache", "globals", "utils", "views/BaseView",
        "text!tmpl/hierarchy/hierarchy.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, BaseView, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockHierarchyModel = {
                "accountId"    : "652b34b6465",
                "name"         : "Name",
                "displayNumber": "Number",
                "children"     : [
                    {
                        "accountId"    : "652b34b6465",
                        "name"         : "Name 1",
                        "displayNumber": "Number 1",
                        "children"     : null
                    },
                    {
                        "accountId"    : "26n24561",
                        "name"         : "Name 2",
                        "displayNumber": "Number 2",
                        "children"     : null
                    },
                    {
                        "accountId"    : "2b56245n7",
                        "name"         : "Name 3",
                        "displayNumber": "Number 3",
                        "children"     : null
                    }
                ]
            },
            hierarchyModel = new Backbone.Model(),
            HierarchyView,
            hierarchyView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);
        squire.mock("views/BaseView", BaseView);

        describe("A Hierarchy View", function () {
            beforeEach(function (done) {
                squire.require(["views/HierarchyView"], function (JasmineHierarchyView) {
                    loadFixtures("../../../index.html");

                    HierarchyView = JasmineHierarchyView;

                    hierarchyModel.set(mockHierarchyModel);

                    hierarchyView = new HierarchyView({
                        model: hierarchyModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchyView).toBeDefined();
            });

            it("looks like a BaseView", function () {
                expect(hierarchyView instanceof BaseView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call handleClick when view is clicked", function () {
                    expect(hierarchyView.events.click).toEqual("handleClick");
                });
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

            describe("has a render function that", function () {
                var mockConfiguration;

                beforeEach(function () {
                    mockConfiguration = {
                        "hierarchy": utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration))
                    };

                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(hierarchyView, "getConfiguration").and.returnValue(mockConfiguration);

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
                    expect(mockMustache.render).toHaveBeenCalledWith(hierarchyView.template, mockConfiguration);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = hierarchyView.$el;

                    expectedContent = Mustache.render(pageTemplate, mockConfiguration);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should contain a hierarchy link if the model is set", function () {
                        hierarchyView.render();

                        expect(hierarchyView.$el[0]).toContainElement("a");
                    });

                    it("should NOT contain a hierarchy link if the model is not set", function () {
                        mockConfiguration.hierarchy = null;

                        hierarchyView.render();

                        expect(hierarchyView.$el[0]).not.toContainElement("a");
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(hierarchyView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    beforeEach(function () {
                        hierarchyView.model = null;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "hierarchy" : null
                            },
                            actualConfiguration;

                        actualConfiguration = hierarchyView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when model exists", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                hierarchy: {}
                            },
                            actualConfiguration;

                        expectedConfiguration.hierarchy = utils._.extend({},
                            utils.deepClone(globals.hierarchyManager.configuration));

                        expectedConfiguration.hierarchy.name.value = mockHierarchyModel.name;
                        expectedConfiguration.hierarchy.displayNumber.value = mockHierarchyModel.displayNumber;

                        actualConfiguration = hierarchyView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });
        });
    });
