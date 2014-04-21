define(["Squire", "backbone", "mustache", "globals", "utils", "models/ShippingModel", "models/UserModel",
        "text!tmpl/card/shipping.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, ShippingModel, UserModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
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
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            mockShippingModel = {},
            shippingModel = new ShippingModel(),
            userModel = UserModel.getInstance(),
            cardShippingView,
            CardShippingView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);

        describe("A Card Shipping View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/CardShippingView"], function (JasmineCardShippingView) {
                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    shippingModel.initialize(mockShippingModel);
                    userModel.initialize(mockUserModel);

                    CardShippingView = JasmineCardShippingView;
                    cardShippingView = new CardShippingView({
                        model: shippingModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(cardShippingView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(cardShippingView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardShippingView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(cardShippingView.el).toEqual("#cardShipping");
                });

                it("should set el nodeName", function () {
                    expect(cardShippingView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(cardShippingView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(CardShippingView.__super__, "initialize").and.callFake(function () {});

                    cardShippingView.initialize();
                });

                it("is defined", function () {
                    expect(cardShippingView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(CardShippingView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should set userModel", function () {
                    expect(cardShippingView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = cardShippingView.$el.find(":jqmData(role=content)");
                    spyOn(cardShippingView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardShippingView, "formatRequiredFields").and.callThrough();

                    cardShippingView.render();
                });

                it("is defined", function () {
                    expect(cardShippingView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardShippingView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(cardShippingView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });
        });
    });
