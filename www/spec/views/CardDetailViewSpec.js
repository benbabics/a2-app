define(["Squire", "backbone", "mustache", "globals", "utils", "models/CardModel", "models/UserModel",
        "text!tmpl/card/cardDetail.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, CardModel, UserModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockMustache = Mustache,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "254624562",
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
                ],
                requiredFields: [
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
            cardDetailView,
            CardDetailView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);

        describe("A Card Detail View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/CardDetailView"], function (JasmineCardDetailView) {
                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    cardModel.initialize(mockCardModel);
                    userModel.initialize(mockUserModel);

                    CardDetailView = JasmineCardDetailView;
                    cardDetailView = new CardDetailView({
                        model    : cardModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(cardDetailView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(cardDetailView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardDetailView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(cardDetailView.el).toEqual("#cardDetails");
                });

                it("should set el nodeName", function () {
                    expect(cardDetailView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(cardDetailView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(CardDetailView.__super__, "initialize").and.callFake(function () {});

                    cardDetailView.initialize();
                });

                it("is defined", function () {
                    expect(cardDetailView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(CardDetailView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(cardDetailView.template);
                });

                it("should set userModel", function () {
                    expect(cardDetailView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = cardDetailView.$el.find(":jqmData(role=content)");

                    spyOn(cardDetailView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();

                    cardDetailView.render();
                });

                it("is defined", function () {
                    expect(cardDetailView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardDetailView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });
        });
    });
