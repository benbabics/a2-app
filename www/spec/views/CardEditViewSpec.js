define(["Squire", "backbone", "mustache", "globals", "utils", "models/CardModel", "models/UserModel",
        "text!tmpl/card/cardEdit.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, CardModel, UserModel, pageTemplate) {

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
            mockCardModel = {},
            cardModel = new CardModel(),
            userModel = UserModel.getInstance(),
            cardEditView,
            CardEditView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);

        describe("A Card Edit View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/CardEditView"], function (JasmineCardEditView) {
                    var authorizationProfiles;

                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    cardModel.initialize(mockCardModel);
                    userModel.initialize(mockUserModel);
                    authorizationProfiles = new Backbone.Collection();
                    userModel.get("selectedCompany").set("authorizationProfiles", authorizationProfiles);

                    CardEditView = JasmineCardEditView;
                    cardEditView = new CardEditView({
                        model: cardModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(cardEditView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(cardEditView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardEditView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(cardEditView.el).toEqual("#cardEdit");
                });

                it("should set el nodeName", function () {
                    expect(cardEditView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(cardEditView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(cardEditView.$el, "on").and.callFake(function () {});
                    spyOn(CardEditView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    cardEditView.initialize();
                });

                it("is defined", function () {
                    expect(cardEditView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(CardEditView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(cardEditView, "handlePageBeforeShow");
                });

                it("should set userModel", function () {
                    expect(cardEditView.userModel).toEqual(userModel);
                });

                it("should call on() on $el", function () {
                    expect(cardEditView.$el.on)
                        .toHaveBeenCalledWith("pagebeforeshow", cardEditView.handlePageBeforeShow);
                });
            });

            describe("has a render function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = cardEditView.$el.find(":jqmData(role=content)");
                    spyOn(cardEditView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardEditView, "formatRequiredFields").and.callThrough();

                    cardEditView.render();
                });

                it("is defined", function () {
                    expect(cardEditView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardEditView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(cardEditView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a pageBeforeShow function that", function () {
                beforeEach(function () {
                    spyOn(cardEditView, "resetForm").and.callFake(function () { });

                    cardEditView.pageBeforeShow();
                });

                it("is defined", function () {
                    expect(cardEditView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm", function () {
                    expect(cardEditView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a handlePageBeforeShow function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(cardEditView, "pageBeforeShow").and.callFake(function () { });

                    cardEditView.handlePageBeforeShow(mockEvent);
                });

                it("is defined", function () {
                    expect(cardEditView.handlePageBeforeShow).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.handlePageBeforeShow).toEqual(jasmine.any(Function));
                });

                it("should call pageBeforeShow", function () {
                    expect(cardEditView.pageBeforeShow).toHaveBeenCalledWith();
                });
            });
        });
    });
