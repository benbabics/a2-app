define(["Squire", "utils", "globals", "backbone"],
    function (Squire, utils, globals, Backbone) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockHierarchyCollection = new Backbone.Collection(),
            HierarchyModel,
            hierarchyModel;

        squire.mock("backbone", Backbone);
        squire.mock("utils", mockUtils);
        squire.mock("collections/HierarchyCollection", Squire.Helpers.returns(mockHierarchyCollection));

        describe("A Hierarchy Model", function () {
            beforeEach(function (done) {
                squire.require(["models/HierarchyModel"], function (JasmineHierarchyModel) {
                    HierarchyModel = JasmineHierarchyModel;
                    hierarchyModel = new HierarchyModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchyModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(hierarchyModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set accountId to default", function () {
                    expect(hierarchyModel.defaults.accountId).toBeNull();
                });

                it("should set name to default", function () {
                    expect(hierarchyModel.defaults.name).toBeNull();
                });

                it("should set displayNumber to default", function () {
                    expect(hierarchyModel.defaults.displayNumber).toBeNull();
                });

                it("should set children to default", function () {
                    expect(hierarchyModel.defaults.children).toBeNull();
                });
            });

            describe("has a parse function that", function () {
                beforeEach(function () {
                    spyOn(hierarchyModel, "set").and.callThrough();
                    spyOn(hierarchyModel, "get").and.callThrough();
                    spyOn(hierarchyModel, "setChildren").and.callFake(function () {});
                });

                it("is defined", function () {
                    expect(hierarchyModel.parse).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyModel.parse).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        hierarchyModel.parse();
                    });

                    it("should NOT call set", function () {
                        expect(hierarchyModel.set).not.toHaveBeenCalled();
                        expect(hierarchyModel.setChildren).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        hierarchyModel.parse(options);
                    });

                    it("should NOT call set", function () {
                        expect(hierarchyModel.set).not.toHaveBeenCalled();
                        expect(hierarchyModel.setChildren).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "accountId"    : "652b34b6465",
                        "name"         : "Name",
                        "displayNumber": "Number",
                        "children"     : [
                            {
                                "accountId"    : "652b34b6465",
                                "name"         : "Name 1",
                                "displayNumber": "Number 1"
                            },
                            {
                                "accountId"    : "26n24561",
                                "name"         : "Name 2",
                                "displayNumber": "Number 2"
                            },
                            {
                                "accountId"    : "2b56245n7",
                                "name"         : "Name 3",
                                "displayNumber": "Number 3"
                            }
                        ]
                    };

                    beforeEach(function () {
                        hierarchyModel.parse(options);
                    });

                    it("should call set 3 times", function () {
                        expect(hierarchyModel.set.calls.count()).toEqual(3);
                    });

                    it("should set accountId", function () {
                        expect(hierarchyModel.set).toHaveBeenCalledWith("accountId", options.accountId);
                    });

                    it("should set name", function () {
                        expect(hierarchyModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set displayNumber", function () {
                        expect(hierarchyModel.set).toHaveBeenCalledWith("displayNumber", options.displayNumber);
                    });

                    it("should set children", function () {
                        expect(hierarchyModel.setChildren).toHaveBeenCalledWith(options.children);
                    });
                });
            });

            describe("has a setChildren function that", function () {
                var mockChildren = [
                    {
                        "accountId"    : "652b34b6465",
                        "name"         : "Name 1",
                        "displayNumber": "Number 1"
                    },
                    {
                        "accountId"    : "26n24561",
                        "name"         : "Name 2",
                        "displayNumber": "Number 2"
                    },
                    {
                        "accountId"    : "2b56245n7",
                        "name"         : "Name 3",
                        "displayNumber": "Number 3"
                    }
                ];

                beforeEach(function () {
                    spyOn(hierarchyModel, "set").and.callThrough();

                    mockHierarchyCollection.reset([]);
                    hierarchyModel.setChildren(mockChildren);
                });

                it("is defined", function () {
                    expect(hierarchyModel.setChildren).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyModel.setChildren).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(hierarchyModel.set).toHaveBeenCalled();
                    expect(hierarchyModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(hierarchyModel.set.calls.mostRecent().args[0]).toEqual("children");
                });

                describe("when building a new object to set the children property with", function () {
                    var newChildren;

                    beforeEach(function () {
                        newChildren = hierarchyModel.set.calls.mostRecent().args[1];
                    });

                    it("should be the same size as the parameter passed", function () {
                        expect(utils._.size(newChildren)).toEqual(utils._.size(mockChildren));
                    });

                    it("should include all the mock children", function () {
                        var newChild;

                        // find all elements in the newChildren that have a matching key with the default values
                        utils._.each(mockChildren, function (mockChild, key) {
                            newChild = newChildren.at(key);

                            expect(newChild).not.toBeNull();
                            expect(newChild.get("accountId")).toEqual(mockChild.accountId);
                            expect(newChild.get("name")).toEqual(mockChild.name);
                            expect(newChild.get("displayNumber")).toEqual(mockChild.displayNumber);
                        });
                    });
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(hierarchyModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when children does have a value", function () {
                    var children,
                        mockHierarchyModel,
                        actualValue;

                    beforeEach(function () {
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
                        };
                        hierarchyModel.clear();
                        mockHierarchyCollection.reset([]);
                        hierarchyModel.parse(mockHierarchyModel);
                        children = hierarchyModel.get("children");

                        spyOn(children, "toJSON").and.callThrough();
                        spyOn(HierarchyModel.__super__, "toJSON").and.callThrough();

                        actualValue = hierarchyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(HierarchyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on children", function () {
                        expect(children.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockHierarchyModel);
                    });
                });

                describe("when children does NOT have a value", function () {
                    var mockHierarchyModel,
                        actualValue;

                    beforeEach(function () {
                        mockHierarchyModel = {
                            "accountId"    : "652b34b6465",
                            "name"         : "Name",
                            "displayNumber": "Number"
                        };
                        hierarchyModel.clear();
                        hierarchyModel.parse(mockHierarchyModel);

                        spyOn(HierarchyModel.__super__, "toJSON").and.callThrough();

                        actualValue = hierarchyModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(HierarchyModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockHierarchyModel);
                    });
                });
            });
        });
    });
