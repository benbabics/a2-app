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
                "department"              :
                {
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
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/CardView"], function (CardView) {
                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

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
                beforeEach(function () {
                    spyOn(mockMustache, "render").and.callThrough();

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
                    expect(mockMustache.render.calls.mostRecent().args.length).toEqual(1);
                    expect(mockMustache.render.calls.mostRecent().args[0]).toEqual(cardView.template);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = cardView.$el;

                    expectedContent = Mustache.render(pageTemplate);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
