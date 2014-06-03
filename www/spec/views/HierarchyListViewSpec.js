define(["Squire", "globals", "utils", "backbone", "mustache", "models/UserModel", "views/BaseView",
        "text!tmpl/hierarchy/hierarchyList.html", "text!tmpl/hierarchy/hierarchyListHeader.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, UserModel, BaseView, pageTemplate, headerTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockUtils = utils,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
                    departments: [
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
                    ],
                    requiredFields: [
                        "REQUIRED_FIELD_1",
                        "REQUIRED_FIELD_2",
                        "REQUIRED_FIELD_3"
                    ],
                    settings: {
                        cardSettings: {
                            customVehicleIdMaxLength: 17,
                            licensePlateNumberMaxLength: 10,
                            licensePlateStateFixedLength: 2,
                            vehicleDescriptionMaxLength: 17,
                            vinFixedLength: 17
                        },
                        driverSettings: {
                            idFixedLength: 4,
                            firstNameMaxLength: 11,
                            middleNameMaxLength: 1,
                            lastNameMaxLength: 12
                        }
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
            },
            userModel = UserModel.getInstance(),
            mockHierarchyModel = {
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
            },
            hierarchyModel = new Backbone.Model(),
            hierarchyCollection = new Backbone.Collection(),
            mockNode = document.createElement("li"),
            mockHierarchyView = {
                el: mockNode,
                constructor: function () { },
                initialize: function () { },
                on: function () { },
                render: function () { return mockHierarchyView; }
            },
            HierarchyListView,
            hierarchyListView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("collections/HierarchyCollection", Squire.Helpers.returns(hierarchyCollection));
        squire.mock("views/BaseView", BaseView);
        squire.mock("views/HierarchyView", Squire.Helpers.returns(mockHierarchyView));

        describe("A Hierarchy List View", function () {
            beforeEach(function (done) {
                squire.require(["views/HierarchyListView"], function (JasmineHierarchyListView) {
                    loadFixtures("../../../index.html");

                    HierarchyListView = JasmineHierarchyListView;

                    userModel.parse(mockUserModel);
                    hierarchyModel.set(mockHierarchyModel);
                    hierarchyCollection.reset([]);
                    hierarchyCollection.add(hierarchyModel);

                    hierarchyListView =  new HierarchyListView({
                        collection: hierarchyCollection,
                        model     : hierarchyModel,
                        userModel : userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(hierarchyListView).toBeDefined();
            });

            it("looks like a BaseView", function () {
                expect(hierarchyListView instanceof BaseView).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(hierarchyListView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(hierarchyListView.el).toEqual("#hierarchyManager");
                });

                it("should set el nodeName", function () {
                    expect(hierarchyListView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(hierarchyListView.template).toEqual(pageTemplate);
                });

                it("should set the headerTemplate", function () {
                    expect(hierarchyListView.headerTemplate).toEqual(headerTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(HierarchyListView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockMustache, "parse").and.callThrough();
                    hierarchyListView.initialize();
                });

                it("is defined", function () {
                    expect(hierarchyListView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(HierarchyListView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(hierarchyListView.headerTemplate);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(hierarchyListView, "renderHeader").and.callFake(function () { });
                    spyOn(hierarchyListView, "renderContent").and.callFake(function () { });

                    hierarchyListView.render();
                });

                it("is defined", function () {
                    expect(hierarchyListView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.render).toEqual(jasmine.any(Function));
                });

                it("should call renderHeader", function () {
                    expect(hierarchyListView.renderHeader).toHaveBeenCalledWith();
                });

                it("should call renderContent", function () {
                    expect(hierarchyListView.renderContent).toHaveBeenCalledWith();
                });
            });

            describe("has a renderHeader function that", function () {
                var mockConfiguration,
                    actualHeader;

                beforeEach(function () {
                    mockConfiguration = utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration));

                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(hierarchyListView, "getHeaderConfiguration").and.returnValue(mockConfiguration);

                    actualHeader = hierarchyListView.$el.find(":jqmData(role=header)");
                    spyOn(hierarchyListView.$el, "find").and.returnValue(actualHeader);
                    spyOn(actualHeader, "html").and.callThrough();
                    spyOn(actualHeader, "trigger").and.callThrough();

                    hierarchyListView.renderHeader();
                });

                it("is defined", function () {
                    expect(hierarchyListView.renderHeader).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.renderHeader).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render)
                        .toHaveBeenCalledWith(hierarchyListView.headerTemplate, mockConfiguration);
                });

                it("should call the html function on the header", function () {
                    var expectedContent = Mustache.render(headerTemplate, mockConfiguration);
                    expect(actualHeader.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the header", function () {
                    expect(actualHeader.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should contain a back button if the configuration has it as visible", function () {
                        mockConfiguration.backButton.visible = true;

                        hierarchyListView.renderHeader();

                        expect(hierarchyListView.$el[0]).toContainElement("a");
                    });

                    it("should NOT contain a back button if the configuration has it as NOT visible", function () {
                        mockConfiguration.backButton.visible = false;

                        hierarchyListView.renderHeader();

                        expect(hierarchyListView.$el[0]).not.toContainElement("a");
                    });
                });
            });

            describe("has a renderContent function that", function () {
                var actualContent,
                    actualHierarchyListContainer,
                    mockDocumentFragment = {
                        appendChild: function () {}
                    },
                    mockConfiguration =
                        utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration));

                beforeEach(function () {
                    hierarchyListView.collection = hierarchyCollection;
                    actualContent = hierarchyListView.$el.find(":jqmData(role=content)");
                    actualHierarchyListContainer = actualContent.find("#hierarchyList");

                    spyOn(document, "createDocumentFragment").and.returnValue(mockDocumentFragment);
                    spyOn(hierarchyListView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "find").and.returnValue(actualHierarchyListContainer);
                    spyOn(hierarchyListView, "getConfiguration").and.returnValue(mockConfiguration);
                    spyOn(actualHierarchyListContainer, "empty").and.callThrough();
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(hierarchyCollection, "each").and.callThrough();
                    spyOn(actualHierarchyListContainer, "append").and.callThrough();
                    spyOn(actualHierarchyListContainer, "listview").and.callThrough();
                    spyOn(actualContent, "trigger").and.callFake(function () {});

                    hierarchyListView.renderContent();
                });

                it("is defined", function () {
                    expect(hierarchyListView.renderContent).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.renderContent).toEqual(jasmine.any(Function));
                });

                it("should call find on the hierarchyListView.$el", function () {
                    expect(hierarchyListView.$el.find).toHaveBeenCalledWith(":jqmData(role=content)");
                });

                it("should call createDocumentFragment on the document", function () {
                    expect(document.createDocumentFragment).toHaveBeenCalledWith();
                });

                it("should call find on the content", function () {
                    expect(actualContent.find).toHaveBeenCalledWith("#hierarchyList");
                });

                it("should call getConfiguration", function () {
                    expect(hierarchyListView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(hierarchyListView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call each on the collection sending a function", function () {
                    expect(hierarchyCollection.each).toHaveBeenCalledWith(jasmine.any(Function));
                });

                describe("sends to each on the collection a function that", function () {
                    var callback;

                    beforeEach(function () {
                        callback = hierarchyCollection.each.calls.mostRecent().args[0];

                        spyOn(mockHierarchyView, "render").and.callThrough();
                        spyOn(mockHierarchyView, "on").and.callThrough();
                        spyOn(mockDocumentFragment, "appendChild").and.callThrough();

                        callback.call();
                    });

                    it("should call render on the Hierarchy View", function () {
                        expect(mockHierarchyView.render).toHaveBeenCalledWith();
                    });

                    it("should call on on the Hierarchy View", function () {
                        expect(mockHierarchyView.on).toHaveBeenCalledWith("hierarchySelected",
                            hierarchyListView.hierarchySelected, hierarchyListView);
                    });

                    it("should call appendChild on the Document Fragment", function () {
                        expect(mockDocumentFragment.appendChild).toHaveBeenCalledWith(mockHierarchyView.el);
                    });
                });

                it("should call append() on the list container", function () {
                    expect(actualHierarchyListContainer.append).toHaveBeenCalledWith(mockDocumentFragment);
                });

                it("should call listview() on the list container", function () {
                    expect(actualHierarchyListContainer.listview).toHaveBeenCalledWith("refresh");
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a getHeaderConfiguration function that", function () {
                it("is defined", function () {
                    expect(hierarchyListView.getHeaderConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.getHeaderConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when selectedCompany is null", function () {
                    beforeEach(function () {
                        hierarchyListView.userModel.set("selectedCompany", null);
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration =
                                utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration)),
                            actualConfiguration;

                        expectedConfiguration.backButton.visible = false;

                        actualConfiguration = hierarchyListView.getHeaderConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when selectedCompany is NOT null", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration =
                                utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration)),
                            actualConfiguration;

                        expectedConfiguration.backButton.visible = true;

                        actualConfiguration = hierarchyListView.getHeaderConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(hierarchyListView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    beforeEach(function () {
                        hierarchyListView.model = null;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration =
                                utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration)),
                            actualConfiguration;

                        expectedConfiguration.title.value = globals.hierarchyManager.constants.TOP_LEVEL_TITLE;

                        actualConfiguration = hierarchyListView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when model is NOT null", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration =
                                utils._.extend({}, utils.deepClone(globals.hierarchyManager.configuration)),
                            actualConfiguration;

                        expectedConfiguration.title.value =
                            Mustache.render(globals.hierarchyManager.constants.SECOND_LEVEL_TITLE,
                                {
                                    "hierarchyName": mockHierarchyModel.name
                                });

                        actualConfiguration = hierarchyListView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a setCollection function that", function () {
                beforeEach(function () {
                    hierarchyListView.collection = null;
                    spyOn(hierarchyListView, "setModel").and.callFake(function () { });
                });

                it("is defined", function () {
                    expect(hierarchyListView.setCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.setCollection).toEqual(jasmine.any(Function));
                });

                describe("when collection is null", function () {
                    beforeEach(function () {
                        hierarchyListView.setCollection(null);
                    });

                    it("should update the collection", function () {
                        expect(hierarchyListView.collection).toBeNull();
                    });

                    it("should NOT call setModel", function () {
                        expect(hierarchyListView.setModel).not.toHaveBeenCalled();
                    });
                });

                describe("when collection has a single model", function () {
                    beforeEach(function () {
                        var model1 = new Backbone.Model();

                        hierarchyCollection.reset([]);
                        hierarchyCollection.add(model1);

                        hierarchyListView.setCollection(hierarchyCollection);
                    });

                    it("should update the collection", function () {
                        expect(hierarchyListView.collection).toEqual(hierarchyCollection);
                    });

                    it("should call setModel", function () {
                        expect(hierarchyListView.setModel).toHaveBeenCalledWith(hierarchyCollection.at(0));
                    });
                });

                describe("when collection has multiple models", function () {
                    beforeEach(function () {
                        var model1 = new Backbone.Model(),
                            model2 = new Backbone.Model();

                        hierarchyCollection.reset([]);
                        hierarchyCollection.add(model1);
                        hierarchyCollection.add(model2);

                        hierarchyListView.setCollection(hierarchyCollection);
                    });

                    it("should update the collection", function () {
                        expect(hierarchyListView.collection).toEqual(hierarchyCollection);
                    });

                    it("should NOT call setModel", function () {
                        expect(hierarchyListView.setModel).not.toHaveBeenCalled();
                    });
                });
            });

            describe("has a setModel function that", function () {
                beforeEach(function () {
                    hierarchyListView.model = null;
                    spyOn(hierarchyListView, "setCollection").and.callFake(function () { });
                });

                it("is defined", function () {
                    expect(hierarchyListView.setModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.setModel).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    beforeEach(function () {
                        hierarchyListView.setModel(null);
                    });

                    it("should update the model", function () {
                        expect(hierarchyListView.model).toBeNull();
                    });

                    it("should NOT call setCollection", function () {
                        expect(hierarchyListView.setCollection).not.toHaveBeenCalled();
                    });
                });

                describe("when model is NOT null", function () {
                    beforeEach(function () {
                        hierarchyListView.setModel(hierarchyModel);
                    });

                    it("should update the model", function () {
                        expect(hierarchyListView.model).toEqual(hierarchyModel);
                    });

                    it("should call setCollection", function () {
                        expect(hierarchyListView.setCollection).toHaveBeenCalledWith(hierarchyModel.get("children"));
                    });
                });
            });

            describe("has a findHierarchy function that", function () {
                var mockAccountId = "25621354",
                    actualValue;

                beforeEach(function () {
                    hierarchyListView.collection = hierarchyCollection;

                    spyOn(hierarchyCollection, "findWhere").and.returnValue(mockHierarchyModel);

                    actualValue = hierarchyListView.findHierarchy(mockAccountId);
                });

                it("is defined", function () {
                    expect(hierarchyListView.findHierarchy).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.findHierarchy).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the hierarchy collection", function () {
                    expect(hierarchyCollection.findWhere).toHaveBeenCalledWith(
                        {
                            "accountId": mockAccountId
                        }
                    );
                });

                it("should return the expected value", function () {
                    expect(actualValue).toEqual(mockHierarchyModel);
                });
            });

            describe("has a hierarchySelected function that", function () {
                var mockAccountId = "25621354";

                beforeEach(function () {
                    hierarchyListView.collection = hierarchyCollection;
                });

                it("is defined", function () {
                    expect(hierarchyListView.hierarchySelected).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.hierarchySelected).toEqual(jasmine.any(Function));
                });

                describe("when hierarchy is NOT found", function () {
                    beforeEach(function () {
                        spyOn(hierarchyListView, "findHierarchy").and.returnValue(null);
                        spyOn(mockUtils._, "size").and.callFake(function () {});
                        spyOn(hierarchyListView, "setModel").and.callFake(function () {});
                        spyOn(hierarchyListView, "render").and.callFake(function () {});
                        spyOn(hierarchyListView, "trigger").and.callFake(function () {});

                        hierarchyListView.hierarchySelected(mockAccountId);
                    });

                    it("should call findHierarchy", function () {
                        expect(hierarchyListView.findHierarchy).toHaveBeenCalledWith(mockAccountId);
                    });

                    it("should NOT call size on utils._", function () {
                        expect(mockUtils._.size).not.toHaveBeenCalled();
                    });

                    it("should NOT call setModel", function () {
                        expect(hierarchyListView.setModel).not.toHaveBeenCalled();
                    });

                    it("should NOT call render", function () {
                        expect(hierarchyListView.render).not.toHaveBeenCalled();
                    });

                    it("should NOT call trigger", function () {
                        expect(hierarchyListView.trigger).not.toHaveBeenCalled();
                    });
                });

                describe("when hierarchy found does NOT have a children attribute", function () {
                    var model = new Backbone.Model();

                    beforeEach(function () {
                        spyOn(hierarchyListView, "findHierarchy").and.returnValue(model);
                        spyOn(mockUtils._, "size").and.callFake(function () {});
                        spyOn(hierarchyListView, "setModel").and.callFake(function () {});
                        spyOn(hierarchyListView, "render").and.callFake(function () {});
                        spyOn(hierarchyListView, "trigger").and.callFake(function () {});

                        hierarchyListView.hierarchySelected(mockAccountId);
                    });

                    it("should call findHierarchy", function () {
                        expect(hierarchyListView.findHierarchy).toHaveBeenCalledWith(mockAccountId);
                    });

                    it("should NOT call size on utils._", function () {
                        expect(mockUtils._.size).not.toHaveBeenCalled();
                    });

                    it("should NOT call setModel", function () {
                        expect(hierarchyListView.setModel).not.toHaveBeenCalled();
                    });

                    it("should NOT call render", function () {
                        expect(hierarchyListView.render).not.toHaveBeenCalled();
                    });

                    it("should call trigger", function () {
                        expect(hierarchyListView.trigger).toHaveBeenCalledWith("hierarchySelected", mockAccountId);
                    });
                });

                describe("when hierarchy found does NOT have children", function () {
                    var model = new Backbone.Model(),
                        collection = new Backbone.Collection();

                    beforeEach(function () {
                        model.set("children", collection);
                        spyOn(hierarchyListView, "findHierarchy").and.returnValue(model);
                        spyOn(mockUtils._, "size").and.returnValue(0);
                        spyOn(hierarchyListView, "setModel").and.callFake(function () {});
                        spyOn(hierarchyListView, "render").and.callFake(function () {});
                        spyOn(hierarchyListView, "trigger").and.callFake(function () {});

                        hierarchyListView.hierarchySelected(mockAccountId);
                    });

                    it("should call findHierarchy", function () {
                        expect(hierarchyListView.findHierarchy).toHaveBeenCalledWith(mockAccountId);
                    });

                    it("should call size on utils._", function () {
                        expect(mockUtils._.size).toHaveBeenCalledWith(collection);
                    });

                    it("should NOT call setModel", function () {
                        expect(hierarchyListView.setModel).not.toHaveBeenCalled();
                    });

                    it("should NOT call render", function () {
                        expect(hierarchyListView.render).not.toHaveBeenCalled();
                    });

                    it("should call trigger", function () {
                        expect(hierarchyListView.trigger).toHaveBeenCalledWith("hierarchySelected", mockAccountId);
                    });
                });

                describe("when hierarchy found has children", function () {
                    var model = new Backbone.Model(),
                        collection = new Backbone.Collection();

                    beforeEach(function () {
                        model.set("children", collection);
                        spyOn(hierarchyListView, "findHierarchy").and.returnValue(model);
                        spyOn(mockUtils._, "size").and.returnValue(1);
                        spyOn(hierarchyListView, "setModel").and.callFake(function () {});
                        spyOn(hierarchyListView, "render").and.callFake(function () {});
                        spyOn(hierarchyListView, "trigger").and.callFake(function () {});

                        hierarchyListView.hierarchySelected(mockAccountId);
                    });

                    it("should call findHierarchy", function () {
                        expect(hierarchyListView.findHierarchy).toHaveBeenCalledWith(mockAccountId);
                    });

                    it("should call size on utils._", function () {
                        expect(mockUtils._.size).toHaveBeenCalledWith(collection);
                    });

                    it("should call setModel", function () {
                        expect(hierarchyListView.setModel).toHaveBeenCalledWith(model);
                    });

                    it("should call render", function () {
                        expect(hierarchyListView.render).toHaveBeenCalledWith();
                    });

                    it("should NOT call trigger", function () {
                        expect(hierarchyListView.trigger).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
