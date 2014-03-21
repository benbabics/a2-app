define(["Squire", "globals", "utils", "backbone", "mustache", "collections/DriverCollection",
        "models/DriverModel", "models/UserModel", "text!tmpl/driver/searchResults.html",
        "text!tmpl/driver/searchResultsHeader.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, DriverCollection, DriverModel, UserModel,
              pageTemplate, searchResultsHeaderTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    wexAccountNumber: "5764309",
                    driverIdLength: "4",
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
                    ]
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = UserModel.getInstance(),
            mockDriverModel = {
                "driverId"  : "354t25ty",
                "firstName" : "Ben",
                "middleName": "D",
                "lastName"  : "Over",
                "status"    : "Active",
                "statusDate": "3/20/2014",
                "department": {
                    id: "134613456",
                    name: "UNASSIGNED",
                    visible: true
                }
            },
            driverModel,
            mockDriverView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { return mockDriverView; }
            },
            driverCollection,
            driverListView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("views/DriverView", Squire.Helpers.returns(mockDriverView));

        describe("A Driver List View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverListView"],
                    function (DriverListView) {
                        loadFixtures("index.html");

                        userModel.initialize(mockUserModel);
                        driverModel = new DriverModel();
                        driverModel.initialize(mockDriverModel);

                        driverCollection = new DriverCollection();
                        driverCollection.add(driverModel);

                        driverListView =  new DriverListView({
                            collection: driverCollection,
                            userModel: userModel
                        });

                        done();
                    });
            });

            it("is defined", function () {
                expect(driverListView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverListView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call handleShowAllDrivers when showAllResults-btn is clicked", function () {
                    expect(driverListView.events["click #showAllResults-btn"]).toEqual("handleShowAllDrivers");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverListView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(driverListView.el).toEqual("#driverSearchResults");
                });

                it("should set el nodeName", function () {
                    expect(driverListView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(driverListView.template).toEqual(pageTemplate);
                });

                it("should set the headerTemplate", function () {
                    expect(driverListView.headerTemplate).toEqual(searchResultsHeaderTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    driverListView.initialize();
                });

                it("is defined", function () {
                    expect(driverListView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverListView.template);
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverListView.headerTemplate);
                });

                it("should set userModel", function () {
                    expect(driverListView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var mockConfiguration = globals.driverSearchResults.configuration;

                beforeEach(function () {
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(driverListView, "getConfiguration").and.callFake(function () { return mockConfiguration; });
                    spyOn(driverCollection, "each").and.callThrough();

                    driverListView.render();
                });

                it("is defined", function () {
                    expect(driverListView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverListView.headerTemplate,
                        {
                            "permissions"   : userModel.get("permissions")
                        });
                });

                it("sets the header content", function () {
                    var expectedContent =
                            Mustache.render(searchResultsHeaderTemplate, {"permissions": userModel.get("permissions")}),
                        $header = driverListView.$el.find(":jqmData(role=header)");

                    expect($header[0]).toContainHtml(expectedContent);
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverListView.template, mockConfiguration);
                });

                it("sets content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration),
                        $content = driverListView.$el.find(":jqmData(role=content)");

                    expect($content[0]).toContainHtml(expectedContent);
                });

                it("should call each on the collection sending a function and scope object", function () {
                    expect(driverCollection.each).toHaveBeenCalled();
                    expect(driverCollection.each.calls.mostRecent().args.length).toEqual(2);
                    expect(driverCollection.each.calls.mostRecent().args[0]).toEqual(jasmine.any(Function));
                    expect(driverCollection.each.calls.mostRecent().args[1]).toEqual(driverListView);
                });
            });

            describe("has a getConfiguration function that", function () {
                beforeEach(function () {
                    driverListView.collection.isAllResults = true;
                    driverListView.collection.pageSize = globals.driverSearch.constants.DEFAULT_PAGE_SIZE;
                    driverListView.collection.totalResults = 136256;
                });

                it("is defined", function () {
                    expect(driverListView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the collection is empty", function () {
                    beforeEach(function () {
                        driverListView.collection.length = 0;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({},
                            utils.deepClone(globals.driverSearchResults.configuration));

                        expectedConfiguration.totalResults.value =
                            globals.driverSearchResults.constants.NO_RESULTS_MESSAGE;
                        expectedConfiguration.submitButton.visible = !driverListView.collection.isAllResults &&
                            driverListView.collection.pageSize < globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE;

                        actualConfiguration = driverListView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the collection is not empty", function () {
                    beforeEach(function () {
                        driverListView.collection.length = 3;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({},
                            utils.deepClone(globals.driverSearchResults.configuration));

                        expectedConfiguration.totalResults.value =
                            Mustache.render(globals.driverSearchResults.constants.TOTAL_RESULTS_FORMAT, {
                                "numberDisplayed": driverListView.collection.length,
                                "totalResults"   : driverListView.collection.totalResults
                            });
                        expectedConfiguration.submitButton.visible = !driverListView.collection.isAllResults &&
                            driverListView.collection.pageSize < globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE;

                        actualConfiguration = driverListView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a handleShowAllDrivers function that", function () {
                beforeEach(function () {
                    spyOn(driverListView, "trigger").and.callFake(function () { });
                    driverListView.handleShowAllDrivers();
                });

                it("is defined", function () {
                    expect(driverListView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverListView.initialize).toEqual(jasmine.any(Function));
                });

                it("should trigger showAllDrivers", function () {
                    expect(driverListView.trigger).toHaveBeenCalledWith("showAllDrivers");
                });
            });
        });
    });
