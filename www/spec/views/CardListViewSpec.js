define(["Squire", "globals", "utils", "backbone", "mustache", "collections/CardCollection",
        "models/CardModel", "models/UserModel", "text!tmpl/card/searchResults.html",
        "text!tmpl/card/searchResultsHeader.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, CardCollection, CardModel, UserModel,
              pageTemplate, searchResultsHeaderTemplate) {

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
            mockCardModel = {
                "number"                  : 1234,
                "authorizationProfileName": "Auth Profile Name",
                "status"                  : "Status",
                "department"              : {
                    id: "134613456",
                    name: "UNASSIGNED",
                    visible: true
                },
                "customVehicleId"         : "Custom Vehicle Id",
                "vehicleDescription"      : "Vehicle Description",
                "licensePlateNumber"      : "1234567",
                "licensePlateState"       : "ME",
                "vin"                     : "12345678901234567"
            },
            cardModel = new CardModel(),
            mockNode = document.createElement("li"),
            mockCardView = {
                el: mockNode,
                constructor: function () { },
                initialize: function () { },
                render: function () { return mockCardView; }
            },
            cardCollection,
            cardListView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("views/CardView", Squire.Helpers.returns(mockCardView));

        describe("A Card List View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/CardListView"],
                    function (CardListView) {
                        //TODO - Fix - Loading fixtures causes phantomjs to hang
                        if (window._phantom === undefined) {
                            loadFixtures("index.html");
                        }

                        userModel.initialize(mockUserModel);
                        cardModel = new CardModel();
                        cardModel.initialize(mockCardModel);

                        cardCollection = new CardCollection();
                        cardCollection.add(cardModel);

                        cardListView =  new CardListView({
                            collection: cardCollection,
                            userModel: userModel
                        });

                        done();
                    });
            });

            it("is defined", function () {
                expect(cardListView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(cardListView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call handleShowAllCards when showAllResults-btn is clicked", function () {
                    expect(cardListView.events["click #showAllResults-btn"]).toEqual("handleShowAllCards");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardListView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardListView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(cardListView.el).toEqual("#cardSearchResults");
                });

                it("should set el nodeName", function () {
                    expect(cardListView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(cardListView.template).toEqual(pageTemplate);
                });

                it("should set the headerTemplate", function () {
                    expect(cardListView.headerTemplate).toEqual(searchResultsHeaderTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    cardListView.initialize();
                });

                it("is defined", function () {
                    expect(cardListView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardListView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(cardListView.template);
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(cardListView.headerTemplate);
                });

                it("should set userModel", function () {
                    expect(cardListView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(cardListView, "renderHeader").and.callFake(function () { });
                    spyOn(cardListView, "renderContent").and.callFake(function () { });

                    cardListView.render();
                });

                it("is defined", function () {
                    expect(cardListView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardListView.render).toEqual(jasmine.any(Function));
                });

                it("should call renderHeader", function () {
                    expect(cardListView.renderHeader).toHaveBeenCalledWith();
                });

                it("should call renderContent", function () {
                    expect(cardListView.renderContent).toHaveBeenCalledWith();
                });
            });

            describe("has a renderHeader function that", function () {
                var actualHeader;

                beforeEach(function () {
                    actualHeader = cardListView.$el.find(":jqmData(role=header)");
                    spyOn(cardListView.$el, "find").and.returnValue(actualHeader);
                    spyOn(actualHeader, "html").and.callThrough();
                    spyOn(actualHeader, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();

                    cardListView.renderHeader();

                });

                it("is defined", function () {
                    expect(cardListView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardListView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardListView.headerTemplate,
                        {
                            "permissions"   : userModel.get("permissions")
                        });
                });

                it("should call the html function on the header", function () {
                    var expectedContent = Mustache.render(searchResultsHeaderTemplate,
                        {
                            "permissions": userModel.get("permissions")
                        });
                    expect(actualHeader.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the header", function () {
                    expect(actualHeader.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should include a link to the Card Add page if the user has the MOBILE_CARD_ADD permission",
                        function () {
                            cardListView.userModel.set("permissions", {"MOBILE_CARD_ADD": true});
                            cardListView.renderHeader();

                            expect(actualHeader[0]).toContainElement("a[href='#cardAdd']");
                        });

                    it("should NOT include a link to the Card Add page if the user does NOT have the MOBILE_CARD_ADD permission",
                        function () {
                            cardListView.userModel.set("permissions", {"MOBILE_CARD_ADD": false});
                            cardListView.renderHeader();

                            expect(actualHeader[0]).not.toContainElement("a[href='#cardAdd']");
                        });
                });
            });

            describe("has a renderContent function that", function () {
                var actualContent,
                    mockConfiguration = globals.cardSearchResults.configuration;

                beforeEach(function () {
                    actualContent = cardListView.$el.find(":jqmData(role=content)");

                    spyOn(cardListView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardListView, "getConfiguration").and.callFake(function () { return mockConfiguration; });
                    spyOn(cardCollection, "each").and.callThrough();

                    cardListView.renderContent();
                });

                it("is defined", function () {
                    expect(cardListView.renderContent).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardListView.renderContent).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardListView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call each on the collection sending a function and scope object", function () {
                    expect(cardCollection.each).toHaveBeenCalled();
                    expect(cardCollection.each.calls.mostRecent().args.length).toEqual(2);
                    expect(cardCollection.each.calls.mostRecent().args[0]).toEqual(jasmine.any(Function));
                    expect(cardCollection.each.calls.mostRecent().args[1]).toEqual(cardListView);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a getConfiguration function that", function () {
                beforeEach(function () {
                    cardListView.collection.isAllResults = true;
                    cardListView.collection.pageSize = globals.cardSearchResults.constants.DEFAULT_PAGE_SIZE;
                    cardListView.collection.totalResults = 136256;
                });

                it("is defined", function () {
                    expect(cardListView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardListView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the collection is empty", function () {
                    beforeEach(function () {
                        cardListView.collection.length = 0;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({},
                            utils.deepClone(globals.cardSearchResults.configuration));

                        expectedConfiguration.totalResults.value =
                            globals.cardSearchResults.constants.NO_RESULTS_MESSAGE;
                        expectedConfiguration.submitButton.visible = !cardListView.collection.isAllResults &&
                            cardListView.collection.pageSize < globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE;

                        actualConfiguration = cardListView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the collection is not empty", function () {
                    beforeEach(function () {
                        cardListView.collection.length = 3;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({},
                            utils.deepClone(globals.cardSearchResults.configuration));

                        expectedConfiguration.totalResults.value =
                            Mustache.render(globals.cardSearchResults.constants.TOTAL_RESULTS_FORMAT, {
                                "numberDisplayed": cardListView.collection.length,
                                "totalResults"   : cardListView.collection.totalResults
                            });
                        expectedConfiguration.submitButton.visible = !cardListView.collection.isAllResults &&
                            cardListView.collection.pageSize < globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE;

                        actualConfiguration = cardListView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a handleShowAllCards function that", function () {
                beforeEach(function () {
                    spyOn(cardListView, "trigger").and.callFake(function () { });
                    cardListView.handleShowAllCards();
                });

                it("is defined", function () {
                    expect(cardListView.handleShowAllCards).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardListView.handleShowAllCards).toEqual(jasmine.any(Function));
                });

                it("should trigger showAllCards", function () {
                    expect(cardListView.trigger).toHaveBeenCalledWith("showAllCards");
                });
            });
        });
    });
