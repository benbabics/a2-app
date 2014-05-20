define(["Squire", "globals", "utils", "backbone", "mustache", "models/UserModel",
        "text!tmpl/hierarchy/hierarchyList.html", "text!tmpl/hierarchy/hierarchyListHeader.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, UserModel, pageTemplate, headerTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
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
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = UserModel.getInstance(),
            mockHierarchyModel = {
                "accountId"    : "652b34b6465",
                "name"         : "Name",
                "displayNumber": "Number"
            },
            hierarchyModel = new Backbone.Model(),
            hierarchyCollection = new Backbone.Collection(),
            mockNode = document.createElement("li"),
            mockHierarchyView = {
                el: mockNode,
                constructor: function () { },
                initialize: function () { },
                render: function () { return mockHierarchyView; }
            },
            hierarchyListView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("collections/HierarchyCollection", Squire.Helpers.returns(hierarchyCollection));
        squire.mock("views/HierarchyView", Squire.Helpers.returns(mockHierarchyView));

        describe("A Hierarchy List View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "./";

            beforeEach(function (done) {
                squire.require(["views/HierarchyListView"],
                    function (HierarchyListView) {
                        loadFixtures("index.html");

                        userModel.initialize(mockUserModel);
                        hierarchyModel.set(mockHierarchyModel);
                        hierarchyCollection.add(hierarchyModel);

                        hierarchyListView =  new HierarchyListView({
                            collection: hierarchyCollection,
                            userModel: userModel
                        });

                        done();
                    });
            });

            it("is defined", function () {
                expect(hierarchyListView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(hierarchyListView instanceof Backbone.View).toBeTruthy();
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
                    spyOn(mockMustache, "parse").and.callThrough();
                    hierarchyListView.initialize();
                });

                it("is defined", function () {
                    expect(hierarchyListView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(hierarchyListView.template);
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(hierarchyListView.headerTemplate);
                });

                it("should set userModel", function () {
                    expect(hierarchyListView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(hierarchyListView, "renderHeader").and.callFake(function () { });
                    spyOn(hierarchyListView, "renderContent").and.callFake(function () { });
                    spyOn(hierarchyListView.$el, "trigger").and.callThrough();

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

                it("should call the trigger function on the $el", function () {
                    expect(hierarchyListView.$el.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a renderHeader function that", function () {
                var actualHeader;

                beforeEach(function () {
                    actualHeader = hierarchyListView.$el.find(":jqmData(role=header)");
                    spyOn(hierarchyListView.$el, "find").and.returnValue(actualHeader);
                    spyOn(actualHeader, "html").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();

                    hierarchyListView.renderHeader();

                });

                it("is defined", function () {
                    expect(hierarchyListView.renderHeader).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.renderHeader).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(hierarchyListView.headerTemplate);
                });

                it("should call the html function on the header", function () {
                    var expectedContent = Mustache.render(headerTemplate);
                    expect(actualHeader.html).toHaveBeenCalledWith(expectedContent);
                });
            });

            describe("has a renderContent function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = hierarchyListView.$el.find(":jqmData(role=content)");

                    spyOn(hierarchyListView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(hierarchyCollection, "each").and.callThrough();

                    hierarchyListView.renderContent();
                });

                it("is defined", function () {
                    expect(hierarchyListView.renderContent).toBeDefined();
                });

                it("is a function", function () {
                    expect(hierarchyListView.renderContent).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(hierarchyListView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call each on the collection sending a function", function () {
                    expect(hierarchyCollection.each).toHaveBeenCalledWith(jasmine.any(Function));
                });
            });
        });
    });
