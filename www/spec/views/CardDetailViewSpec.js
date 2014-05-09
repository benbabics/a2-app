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
            cardDetailView,
            CardDetailView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);

        describe("A Card Detail View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "./";

            beforeEach(function (done) {
                squire.require(["views/CardDetailView"], function (JasmineCardDetailView) {
                    loadFixtures("index.html");

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

            describe("has events that", function () {
                it("should call handleEditCard when submitEditCard-btn is clicked", function () {
                    expect(cardDetailView.events["click #submitEditCard-btn"]).toEqual("handleEditCardClick");
                });

                it("should call changeStatus when submitTerminateCard-btn is clicked", function () {
                    expect(cardDetailView.events["click #submitTerminateCard-btn"]).toEqual("handleChangeStatus");
                });
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
                var actualContent,
                    mockConfiguration;

                beforeEach(function () {
                    mockConfiguration = {
                        "card"       : utils._.extend({}, utils.deepClone(globals.cardDetails.configuration)),
                        "permissions": userModel.get("permissions")
                    };

                    actualContent = cardDetailView.$el.find(":jqmData(role=content)");

                    spyOn(cardDetailView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardDetailView, "getConfiguration").and.callFake(function () { return mockConfiguration; });

                    cardDetailView.render();
                });

                it("is defined", function () {
                    expect(cardDetailView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration", function () {
                    expect(cardDetailView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardDetailView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should contain content if the model is set", function () {
                        cardDetailView.render();

                        expect(actualContent[0]).not.toBeEmpty();
                    });

                    it("should NOT contain any content if the model is not set", function () {
                        mockConfiguration.card = null;

                        cardDetailView.render();

                        expect(actualContent[0]).toBeEmpty();
                    });

                    describe("when the user has the MOBILE_CARD_EDIT permission", function () {
                        beforeEach(function () {
                            userModel.set("permissions", {"MOBILE_CARD_EDIT": true});
                            mockConfiguration.permissions = userModel.get("permissions");
                        });

                        it("should include a button to edit card when it's configured to be visible",
                            function () {
                                mockConfiguration.card.editButton.visible = true;
                                cardDetailView.render();

                                expect(actualContent[0]).toContainElement("button[id='submitEditCard-btn']");
                            });

                        it("should NOT include a button to edit card when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.card.editButton.visible = false;
                                cardDetailView.render();

                                expect(actualContent[0]).not
                                    .toContainElement("button[id='submitEditCard-btn']");
                            });

                        it("should include a button to terminate card when it's configured to be visible",
                            function () {
                                mockConfiguration.card.terminateButton.visible = true;
                                cardDetailView.render();

                                expect(actualContent[0]).toContainElement("button[id='submitTerminateCard-btn']");
                            });

                        it("should NOT include a button to terminate card when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.card.terminateButton.visible = false;
                                cardDetailView.render();

                                expect(actualContent[0]).not
                                    .toContainElement("button[id='submitTerminateCard-btn']");
                            });
                    });

                    describe("when the user does NOT have the MOBILE_CARD_EDIT permission", function () {
                        beforeEach(function () {
                            userModel.set("permissions", {"MOBILE_CARD_EDIT": false});
                            mockConfiguration.permissions = userModel.get("permissions");
                        });

                        it("should NOT include a button to edit card when it's configured to be visible",
                            function () {
                                mockConfiguration.card.editButton.visible = true;
                                cardDetailView.render();

                                expect(actualContent[0]).not.toContainElement("button[id='submitEditCard-btn']");
                            });

                        it("should NOT include a button to edit card when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.card.editButton.visible = false;
                                cardDetailView.render();

                                expect(actualContent[0]).not
                                    .toContainElement("button[id='submitEditCard-btn']");
                            });

                        it("should NOT include a button to terminate card when it's configured to be visible",
                            function () {
                                mockConfiguration.card.terminateButton.visible = true;
                                cardDetailView.render();

                                expect(actualContent[0]).not
                                    .toContainElement("button[id='submitTerminateCard-btn']");
                            });

                        it("should NOT include a button to terminate card when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.card.terminateButton.visible = false;
                                cardDetailView.render();

                                expect(actualContent[0]).not
                                    .toContainElement("button[id='submitTerminateCard-btn']");
                            });
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardDetailView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "card" : null,
                                "permissions": null
                            },
                            actualConfiguration;

                        expectedConfiguration.permissions = userModel.get("permissions");
                        cardDetailView.model = null;

                        actualConfiguration = cardDetailView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the card is terminated", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "card": null,
                                "permissions": null
                            },
                            actualConfiguration,
                            cardModelJSON;

                        cardModel.set("status", globals.card.constants.STATUS_TERMINATED);

                        cardModelJSON = cardModel.toJSON();

                        expectedConfiguration.card = utils._.extend({},
                            utils.deepClone(globals.cardDetails.configuration));
                        expectedConfiguration.card.id.value = cardModelJSON.id;
                        expectedConfiguration.card.customVehicleId.value = cardModelJSON.customVehicleId;
                        expectedConfiguration.card.vehicleDescription.value = cardModelJSON.vehicleDescription;
                        expectedConfiguration.card.licensePlateNumber.value = cardModelJSON.licensePlateNumber;
                        expectedConfiguration.card.licensePlateState.value = cardModelJSON.licensePlateState;
                        expectedConfiguration.card.customVehicleId.value = cardModelJSON.customVehicleId;
                        expectedConfiguration.card.status.value = cardModelJSON.status;
                        if (cardModelJSON.department) {
                            expectedConfiguration.card.department.value = cardModelJSON.department.name;
                        }
                        expectedConfiguration.card.editButton.visible = false;
                        expectedConfiguration.card.terminateButton.visible = false;
                        expectedConfiguration.permissions = userModel.get("permissions");

                        actualConfiguration = cardDetailView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the card is active", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "card": null,
                                "permissions": null
                            },
                            actualConfiguration,
                            cardModelJSON;

                        cardModel.set("status", globals.card.constants.STATUS_ACTIVE);

                        cardModelJSON = cardModel.toJSON();

                        expectedConfiguration.card = utils._.extend({},
                            utils.deepClone(globals.cardDetails.configuration));
                        expectedConfiguration.card.id.value = cardModelJSON.id;
                        expectedConfiguration.card.customVehicleId.value = cardModelJSON.customVehicleId;
                        expectedConfiguration.card.vehicleDescription.value = cardModelJSON.vehicleDescription;
                        expectedConfiguration.card.licensePlateNumber.value = cardModelJSON.licensePlateNumber;
                        expectedConfiguration.card.licensePlateState.value = cardModelJSON.licensePlateState;
                        expectedConfiguration.card.customVehicleId.value = cardModelJSON.customVehicleId;
                        expectedConfiguration.card.status.value = cardModelJSON.status;
                        if (cardModelJSON.department) {
                            expectedConfiguration.card.department.value = cardModelJSON.department.name;
                        }
                        expectedConfiguration.card.editButton.visible = true;
                        expectedConfiguration.card.terminateButton.visible = true;
                        expectedConfiguration.permissions = userModel.get("permissions");

                        actualConfiguration = cardDetailView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a terminate function that", function () {
                var eventToTrigger = "mock event";

                beforeEach(function () {
                    spyOn(cardDetailView.model, "terminate").and.callFake(function () {});

                    cardDetailView.terminate(eventToTrigger);
                });

                it("is defined", function () {
                    expect(cardDetailView.terminate).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.terminate).toEqual(jasmine.any(Function));
                });

                describe("when calling terminate() on the driver model", function () {
                    it("should send 1 argument", function () {
                        expect(cardDetailView.model.terminate).toHaveBeenCalled();
                        expect(cardDetailView.model.terminate.calls.mostRecent().args.length).toEqual(1);
                    });

                    describe("sends as the first argument the options object with a success callback that",
                        function () {
                            var response = {},
                                model,
                                options;

                            beforeEach(function () {
                                spyOn(cardDetailView, "trigger").and.callFake(function () { });

                                options = cardDetailView.model.terminate.calls.mostRecent().args[0];
                                options.success.call(cardDetailView, model, response);
                            });

                            it("should call trigger", function () {
                                expect(cardDetailView.trigger).toHaveBeenCalled();
                                expect(cardDetailView.trigger.calls.mostRecent().args.length).toEqual(2);
                                expect(cardDetailView.trigger.calls.mostRecent().args[0]).toEqual(eventToTrigger);
                                expect(cardDetailView.trigger.calls.mostRecent().args[1]).toEqual(response);
                            });
                        });
                });
            });

            describe("has a handleChangeStatus function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(mockFacade, "publish").and.callThrough();

                    cardDetailView.handleChangeStatus(mockEvent);
                });

                it("is defined", function () {
                    expect(cardDetailView.handleChangeStatus).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.handleChangeStatus).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.cardTerminate.constants.CONFIRMATION_TITLE);
                    expect(appAlertOptions.message).toEqual(globals.cardTerminate.constants.CONFIRMATION_MESSAGE);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.cardTerminate.constants.OK_BTN_TEXT);
                    expect(appAlertOptions.primaryBtnHandler).toEqual(jasmine.any(Function));
                    expect(appAlertOptions.secondaryBtnLabel).toEqual(globals.cardTerminate.constants.CANCEL_BTN_TEXT);
                });

                describe("sends as the primaryBtnHandler argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(cardDetailView, "terminate").and.callFake(function () { });

                        options.primaryBtnHandler.call(cardDetailView);
                    });

                    it("should call terminate", function () {
                        expect(cardDetailView.terminate).toHaveBeenCalledWith("terminateCardSuccess");
                    });
                });
            });

            describe("has a handleEditCardClick function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(mockFacade, "publish").and.callFake(function () {});

                    cardDetailView.handleEditCardClick(mockEvent);
                });

                it("is defined", function () {
                    expect(cardDetailView.handleEditCardClick).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardDetailView.handleEditCardClick).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("card", "navigateEdit", mockCardModel.number);
                });
            });
        });
    });
