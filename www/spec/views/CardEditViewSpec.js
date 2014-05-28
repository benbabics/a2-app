define(["Squire", "backbone", "mustache", "globals", "utils", "models/CardModel", "models/UserModel",
        "views/ValidationFormView", "text!tmpl/card/cardEdit.html", "text!tmpl/card/cardChangeDetails.html",
        "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, CardModel, UserModel, ValidationFormView,
              pageTemplate, cardChangeDetailsTemplate) {

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
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
            },
            mockCardModel = {
                number: 2456,
                authorizationProfileName: "Auth Profile",
                status: "Active",
                department: {
                    id: "134613456",
                    name: "UNASSIGNED",
                    visible: true
                },
                customVehicleId: "Custom Vehicle Id",
                vehicleDescription: "Vehicle Description",
                licensePlateNumber: "1234567",
                licensePlateState: "ME",
                vin: "12345678901234567"
            },
            cardModel = new CardModel(),
            userModel = UserModel.getInstance(),
            cardEditView,
            CardEditView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);
        squire.mock("views/ValidationFormView", ValidationFormView);

        describe("A Card Edit View", function () {
            beforeEach(function (done) {
                squire.require(["views/CardEditView"], function (JasmineCardEditView) {
                    var authorizationProfiles;

                    loadFixtures("../../../index.html");

                    cardModel.initialize(mockCardModel);
                    userModel.parse(mockUserModel);
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

            it("looks like a ValidationFormView", function () {
                expect(cardEditView instanceof ValidationFormView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitCardEdit-btn is clicked", function () {
                    expect(cardEditView.events["click #submitCardEdit-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when cardEditForm is submitted", function () {
                    expect(cardEditView.events["submit #cardEditForm"]).toEqual("submitForm");
                });
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

                it("should set the changeDetailsTemplate", function () {
                    expect(cardEditView.changeDetailsTemplate).toEqual(cardChangeDetailsTemplate);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = {
                        "card"          : utils._.extend({}, utils.deepClone(globals.cardEdit.configuration)),
                        "requiredFields": cardEditView.userModel.get("selectedCompany").get("requiredFields")
                    };
                    expectedConfiguration.card.ableToEditCard = true;

                    actualContent = cardEditView.$el.find(":jqmData(role=content)");
                    spyOn(cardEditView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(cardEditView.$el, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardEditView, "getConfiguration").and.callFake(function () { return expectedConfiguration; });
                    spyOn(cardEditView, "formatRequiredFields").and.callThrough();

                    cardEditView.render();
                });

                it("is defined", function () {
                    expect(cardEditView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration", function () {
                    expect(cardEditView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardEditView.template, expectedConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, expectedConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(cardEditView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the $el", function () {
                    expect(cardEditView.$el.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    describe("when able to edit card", function () {
                        beforeEach(function () {
                            expectedConfiguration.card.ableToEditCard = true;
                            expectedConfiguration.card.unableToEditCardMessage = "Should not include this";

                            cardEditView.render();
                        });

                        it("should NOT include an unable to edit card message", function () {
                            expect(actualContent[0]).not
                                .toContainText(expectedConfiguration.card.unableToEditCardMessage);
                        });

                        it("should include a cardEditForm", function () {
                            expect(actualContent[0]).toContainElement("form[id='cardEditForm']");
                        });
                    });

                    describe("when NOT able to edit card", function () {
                        beforeEach(function () {
                            expectedConfiguration.card.ableToEditCard = false;
                            expectedConfiguration.card.unableToEditCardMessage = "Unable to add card";

                            cardEditView.render();
                        });

                        it("should include an unable to edit card message", function () {
                            expect(actualContent[0]).toContainText(expectedConfiguration.card.unableToEditCardMessage);
                        });

                        it("should NOT include a cardEditForm", function () {
                            expect(actualContent[0]).not.toContainElement("form[id='cardEditForm']");
                        });
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardEditView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the Company does NOT have any auth profiles", function () {
                    var emptyCollection = new Backbone.Collection(),
                        actualConfiguration;

                    beforeEach(function () {
                        userModel.get("selectedCompany").set("authorizationProfiles", emptyCollection);

                        actualConfiguration = cardEditView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                card: utils._.extend({}, utils.deepClone(globals.cardEdit.configuration)),
                                requiredFields: {}
                            };

                        expectedConfiguration.card.ableToEditCard = false;
                        expectedConfiguration.card.unableToEditCardMessage =
                            globals.cardEdit.constants.NO_AUTH_PROFILES_MESSAGE;

                        expectedConfiguration.requiredFields = userModel.get("selectedCompany").get("requiredFields");

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the Company has auth profiles", function () {
                    var collection = new Backbone.Collection(),
                        actualConfiguration;

                    beforeEach(function () {
                        var model = new Backbone.Model();
                        model.set({
                            "id": 1435613456,
                            "name": "Mock Name"
                        });
                        collection.add(model);
                        userModel.get("selectedCompany").set("authorizationProfiles", collection);

                        actualConfiguration = cardEditView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                card: utils._.extend({}, utils.deepClone(globals.cardEdit.configuration)),
                                requiredFields: {}
                            },
                            user = userModel.toJSON(),
                            authorizationProfileListValues = [],
                            departmentListValues = [],
                            stateListValues = [];

                        expectedConfiguration.card.ableToEditCard = true;

                        utils._.each(user.selectedCompany.authorizationProfiles, function (authorizationProfile) {
                            authorizationProfileListValues.push({
                                "id": authorizationProfile.name,
                                "name": authorizationProfile.name,
                                "selected": authorizationProfile.name === cardModel.get("authorizationProfileName")
                            });
                        });

                        utils._.each(user.selectedCompany.departments, function (department) {
                            if (department.visible === true) {
                                departmentListValues.push({
                                    "id": department.id,
                                    "name": department.name,
                                    "selected": department.id === cardModel.get("department").get("id")
                                });
                            }
                        });

                        stateListValues.push(globals.card.constants.SELECT_STATE);
                        utils._.each(globals.APP.constants.STATES, function (state) {
                            state.selected = state.id === cardModel.get("licensePlateState");
                            stateListValues.push(state);
                        });

                        expectedConfiguration.card.id.value = cardModel.get("id");

                        expectedConfiguration.card.customVehicleId.value = cardModel.get("customVehicleId");
                        expectedConfiguration.card.customVehicleId.maxLength =
                            user.selectedCompany.settings.cardSettings.customVehicleIdMaxLength;

                        expectedConfiguration.card.vehicleDescription.value = cardModel.get("vehicleDescription");
                        expectedConfiguration.card.vehicleDescription.maxLength =
                            user.selectedCompany.settings.cardSettings.vehicleDescriptionMaxLength;

                        expectedConfiguration.card.vin.value = cardModel.get("vin");
                        expectedConfiguration.card.vin.maxLength =
                            user.selectedCompany.settings.cardSettings.vinFixedLength;
                        expectedConfiguration.card.vin.placeholder =
                            Mustache.render(globals.card.constants.VIN_PLACEHOLDER_FORMAT, {
                                "vinFixedLength": user.selectedCompany.settings.cardSettings.vinFixedLength
                            });

                        expectedConfiguration.card.licensePlateNumber.value = cardModel.get("licensePlateNumber");
                        expectedConfiguration.card.licensePlateNumber.maxLength =
                            user.selectedCompany.settings.cardSettings.licensePlateNumberMaxLength;

                        expectedConfiguration.card.licensePlateState.enabled = stateListValues.length > 1;
                        expectedConfiguration.card.licensePlateState.values = stateListValues;

                        expectedConfiguration.card.departmentId.enabled = departmentListValues.length > 1;
                        expectedConfiguration.card.departmentId.values = departmentListValues;

                        expectedConfiguration.card.authorizationProfileName.enabled =
                            authorizationProfileListValues.length > 1;
                        expectedConfiguration.card.authorizationProfileName.values = authorizationProfileListValues;

                        expectedConfiguration.requiredFields = user.selectedCompany.requiredFields;

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a getChangeDetailsConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardEditView.getChangeDetailsConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.getChangeDetailsConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration = {
                            "message": null,
                            "card": null,
                            "requiredFields": null
                        },
                        actualConfiguration,
                        changeCardResponse = {
                            "message": "Mock Message",
                            number: 13465,
                            authorizationProfileName: "Auth Profile",
                            status: "Active",
                            department: {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            },
                            customVehicleId: "Custom Vehicle Id",
                            vehicleDescription: "Vehicle Description",
                            licensePlateNumber: "1234567",
                            licensePlateState: "ME",
                            vin: "12345678901234567"
                        };

                    expectedConfiguration.message = changeCardResponse.message;

                    expectedConfiguration.card = utils._.extend({},
                        utils.deepClone(globals.cardChangedDetails.configuration));
                    expectedConfiguration.card.id.value = changeCardResponse.number;
                    expectedConfiguration.card.customVehicleId.value = changeCardResponse.customVehicleId;
                    expectedConfiguration.card.vehicleDescription.value = changeCardResponse.vehicleDescription;
                    expectedConfiguration.card.licensePlateNumber.value = changeCardResponse.licensePlateNumber;
                    expectedConfiguration.card.shipping = null;

                    expectedConfiguration.requiredFields = userModel.get("selectedCompany").get("requiredFields");

                    actualConfiguration = cardEditView.getChangeDetailsConfiguration(changeCardResponse);

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has a findDepartment function that", function () {
                var mockDepartmentId = "25621354",
                    mockDepartment = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    },
                    departments;

                beforeEach(function () {
                    departments = userModel.get("selectedCompany").get("departments");
                    spyOn(departments, "findWhere").and.returnValue(mockDepartment);
                });

                it("is defined", function () {
                    expect(cardEditView.findDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.findDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    cardEditView.findDepartment(mockDepartmentId);

                    expect(departments.findWhere).toHaveBeenCalledWith(
                        {
                            "visible": true,
                            "id": mockDepartmentId
                        }
                    );
                });

                it("should return the expected value", function () {
                    var actualValue = cardEditView.findDepartment(mockDepartmentId);

                    expect(actualValue).toEqual(mockDepartment);
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(cardEditView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.handleInputChanged).toEqual(jasmine.any(Function));
                });

                describe("when the target name is departmentId", function () {
                    var mockEvent = {
                            "target"    : {
                                "name"  : "departmentId",
                                "value" : "mock department id"
                            }
                        },
                        mockDepartment = {
                            id: "134613456",
                            name: "UNASSIGNED",
                            visible: true
                        };

                    beforeEach(function () {
                        spyOn(cardEditView, "findDepartment").and.returnValue(mockDepartment);
                        spyOn(cardEditView, "updateAttribute").and.callFake(function () {});

                        cardEditView.handleInputChanged(mockEvent);
                    });

                    it("should call findDepartment", function () {
                        expect(cardEditView.findDepartment).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(cardEditView.updateAttribute).toHaveBeenCalledWith("department", mockDepartment);
                    });
                });

                describe("when the target name is NOT departmentId", function () {
                    it("should call updateAttribute on super", function () {
                        var mockEvent = {
                            "target"            : {
                                "name"  : "target_name",
                                "value" : "target_value"
                            }
                        };

                        spyOn(CardEditView.__super__, "handleInputChanged").and.callThrough();
                        cardEditView.handleInputChanged(mockEvent);

                        expect(CardEditView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });
            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(cardModel, "edit").and.callFake(function () { });
                    cardEditView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(cardEditView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardEditView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                describe("when calling edit() on the model", function () {
                    it("should send 1 argument", function () {
                        expect(cardModel.edit).toHaveBeenCalled();
                        expect(cardModel.edit.calls.mostRecent().args.length).toEqual(2);
                        expect(cardModel.edit.calls.mostRecent().args[0]).toBeNull();
                    });

                    describe("sends as the second argument an object with a success callback that", function () {
                        var mockMustacheRenderReturnValue = "Render return value",
                            mockChangeDetailsConfiguration = utils._.extend({},
                                utils.deepClone(globals.cardChangedDetails.configuration)),
                            response = {
                                message: "Mock message",
                                data: {
                                    id: 2,
                                    details: "..."
                                }
                            },
                            model,
                            options;

                        beforeEach(function () {
                            spyOn(mockMustache, "render").and.returnValue(mockMustacheRenderReturnValue);
                            spyOn(cardEditView, "getChangeDetailsConfiguration").and
                                .returnValue(mockChangeDetailsConfiguration);
                            spyOn(cardEditView, "trigger").and.callFake(function () { });
                            spyOn(cardEditView, "resetForm").and.callFake(function () { });

                            options = cardModel.edit.calls.mostRecent().args[1];
                            options.success.call(cardEditView, model, response);
                        });

                        it("should call getChangeDetailsConfiguration", function () {
                            expect(cardEditView.getChangeDetailsConfiguration).toHaveBeenCalledWith(response);
                        });

                        it("should call Mustache.render() on the changeDetailsTemplate", function () {
                            expect(mockMustache.render)
                                .toHaveBeenCalledWith(cardEditView.changeDetailsTemplate,
                                                      mockChangeDetailsConfiguration);
                        });

                        it("should trigger cardEditSuccess", function () {
                            expect(cardEditView.trigger)
                                .toHaveBeenCalledWith("cardEditSuccess", mockMustacheRenderReturnValue);
                        });

                        it("should call resetForm", function () {
                            expect(cardEditView.resetForm).toHaveBeenCalledWith();
                        });
                    });

                    describe("sends as the second argument an object with an error callback that", function () {
                        var response,
                            model,
                            options;

                        describe("When the response type is INFO and message is ADDRESS_IS_REQUIRED", function () {
                            beforeEach(function () {
                                response = {
                                    type: "INFO",
                                    message: "ADDRESS_IS_REQUIRED"
                                };
                                spyOn(cardEditView, "trigger").and.callFake(function () { });

                                options = cardModel.edit.calls.mostRecent().args[1];
                                options.error.call(cardEditView, model, response);
                            });

                            it("should trigger cardEditSubmitted", function () {
                                expect(cardEditView.trigger).toHaveBeenCalledWith("cardEditSubmitted");
                            });
                        });

                        describe("When the response type is INFO and message is NOT ADDRESS_IS_REQUIRED", function () {
                            beforeEach(function () {
                                response = {
                                    type: "INFO",
                                    message: "NOT ADDRESS_IS_REQUIRED"
                                };
                                spyOn(cardEditView, "trigger").and.callFake(function () { });

                                options = cardModel.edit.calls.mostRecent().args[1];
                                options.error.call(cardEditView, model, response);
                            });

                            it("should NOT call trigger", function () {
                                expect(cardEditView.trigger).not.toHaveBeenCalled();
                            });
                        });

                        describe("When the response type is NOT INFO and message is ADDRESS_IS_REQUIRED", function () {
                            beforeEach(function () {
                                response = {
                                    type: "NOT INFO",
                                    message: "ADDRESS_IS_REQUIRED"
                                };
                                spyOn(cardEditView, "trigger").and.callFake(function () { });

                                options = cardModel.edit.calls.mostRecent().args[1];
                                options.error.call(cardEditView, model, response);
                            });

                            it("should NOT call trigger", function () {
                                expect(cardEditView.trigger).not.toHaveBeenCalled();
                            });
                        });

                        describe("When neither the response type is INFO or message is ADDRESS_IS_REQUIRED", function () {
                            beforeEach(function () {
                                response = {
                                    type: "NOT INFO",
                                    message: "NOT ADDRESS_IS_REQUIRED"
                                };
                                spyOn(cardEditView, "trigger").and.callFake(function () { });

                                options = cardModel.edit.calls.mostRecent().args[1];
                                options.error.call(cardEditView, model, response);
                            });

                            it("should NOT call trigger", function () {
                                expect(cardEditView.trigger).not.toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });
    });
