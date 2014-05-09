define(["backbone", "Squire", "mustache", "globals", "utils", "models/CardModel",
        "text!tmpl/card/card.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, CardModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
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
            cardView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);

        describe("A Card View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "./";

            beforeEach(function (done) {
                squire.require(["views/CardView"], function (CardView) {
                    loadFixtures("index.html");

                    cardModel.initialize(mockCardModel);

                    cardView = new CardView({
                        model: cardModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(cardView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(cardView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el nodeName", function () {
                    expect(cardView.el.nodeName).toEqual("LI");
                });

                it("should set the template", function () {
                    expect(cardView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();

                    cardView.initialize();
                });

                it("is defined", function () {
                    expect(cardView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(cardView.template);
                });
            });

            describe("has a render function that", function () {
                var mockConfiguration;

                beforeEach(function () {
                    mockConfiguration = {
                        "card": utils._.extend({}, utils.deepClone(globals.cardSearchResults.configuration))
                    };

                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardView, "getConfiguration").and.callFake(function () { return mockConfiguration; });

                    cardView.initialize();
                    cardView.render();
                });

                it("is defined", function () {
                    expect(cardView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.mostRecent().args.length).toEqual(2);
                    expect(mockMustache.render.calls.mostRecent().args[0]).toEqual(cardView.template);
                    expect(mockMustache.render.calls.mostRecent().args[1]).toEqual(mockConfiguration);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = cardView.$el;

                    expectedContent = Mustache.render(pageTemplate, mockConfiguration);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should contain a card link if the model is set", function () {
                        cardView.render();

                        expect(cardView.$el[0]).toContainElement("a");
                    });

                    it("should NOT contain a card link if the model is not set", function () {
                        mockConfiguration.card = null;

                        cardView.render();

                        expect(cardView.$el[0]).not.toContainElement("a");
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    beforeEach(function () {
                        cardView.model = null;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "card" : null
                            },
                            actualConfiguration;

                        actualConfiguration = cardView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when model exists", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                card: {}
                            },
                            actualConfiguration;

                        expectedConfiguration.card = utils._.extend({},
                            utils.deepClone(globals.cardSearchResults.configuration));

                        expectedConfiguration.card.url.value =
                            globals.cardSearchResults.constants.CARD_DETAILS_BASE_URL + mockCardModel.number;
                        expectedConfiguration.card.id.value = mockCardModel.number;
                        expectedConfiguration.card.customVehicleId.value = mockCardModel.customVehicleId;
                        expectedConfiguration.card.vehicleDescription.value = mockCardModel.vehicleDescription;
                        expectedConfiguration.card.licensePlateNumber.value = mockCardModel.licensePlateNumber;
                        expectedConfiguration.card.licensePlateState.value = mockCardModel.licensePlateState;
                        expectedConfiguration.card.customVehicleId.value = mockCardModel.customVehicleId;
                        expectedConfiguration.card.status.value = mockCardModel.status;
                        if (mockCardModel.department) {
                            expectedConfiguration.card.department.value = mockCardModel.department.name;
                        }

                        actualConfiguration = cardView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });
        });
    });
