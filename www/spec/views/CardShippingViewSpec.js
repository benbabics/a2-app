define(["Squire", "backbone", "mustache", "globals", "utils", "models/CardModel", "models/ShippingModel",
        "models/UserModel", "views/ValidationFormView", "text!tmpl/card/shipping.html",
        "text!tmpl/card/cardChangeDetails.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, CardModel, ShippingModel, UserModel, ValidationFormView,
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
                    shippingMethods: [
                        {
                            id: "134613456",
                            name: "UNASSIGNED",
                            "cost": 3,
                            "poBoxAllowed": true
                        },
                        {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            "cost": 567,
                            "poBoxAllowed": false
                        }
                    ],
                    defaultShippingAddress: {
                        "firstName"     : "First Name",
                        "lastName"      : "Last Name",
                        "companyName"   : "Company Name",
                        "addressLine1"  : "Address Line 1",
                        "addressLine2"  : "Address Line 2",
                        "city"          : "City",
                        "state"         : "State",
                        "postalCode"    : "Postal Code",
                        "countryCode"   : "Country Code",
                        "residence"     : true
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
            },
            mockShippingModel = {
                "shippingMethod": {
                    "id"          : "ID",
                    "name"        : "Name",
                    "cost"        : 6.66,
                    "poBoxAllowed": true,
                    "formattedName": null
                },
                "firstName"     : "First Name",
                "lastName"      : "Last Name",
                "companyName"   : "Company Name",
                "addressLine1"  : "Address Line 1",
                "addressLine2"  : "Address Line 2",
                "city"          : "City",
                "state"         : "State",
                "postalCode"    : "Postal Code",
                "countryCode"   : "Country Code",
                "residence"     : true
            },
            shippingModel = new ShippingModel(),
            mockCardModel = {
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
            cardShippingView,
            CardShippingView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);
        squire.mock("views/ValidationFormView", ValidationFormView);

        describe("A Card Shipping View", function () {
            beforeEach(function (done) {
                squire.require(["views/CardShippingView"], function (JasmineCardShippingView) {
                    loadFixtures("../../../index.html");

                    cardModel.initialize(mockCardModel);
                    shippingModel.initialize(mockShippingModel);
                    userModel.parse(mockUserModel);

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

            it("looks like a ValidationFormView", function () {
                expect(cardShippingView instanceof ValidationFormView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitCardShipping-btn is clicked", function () {
                    expect(cardShippingView.events["click #submitCardShipping-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when cardShippingForm is submitted", function () {
                    expect(cardShippingView.events["submit #cardShippingForm"]).toEqual("submitForm");
                });
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

                it("should set the changeDetailsTemplate", function () {
                    expect(cardShippingView.changeDetailsTemplate).toEqual(cardChangeDetailsTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
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

                it("should parse the changeDetailsTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(cardShippingView.changeDetailsTemplate);
                });
            });

            describe("has a setCardModel function that", function () {
                beforeEach(function () {
                    cardShippingView.cardModel = null;

                    spyOn(cardShippingView, "setupLoadingIndicatorOnModel").and.callFake(function () { });

                    cardShippingView.setCardModel(cardModel);
                });

                it("is defined", function () {
                    expect(cardShippingView.setCardModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.setCardModel).toEqual(jasmine.any(Function));
                });

                it("should set cardModel", function () {
                    expect(cardShippingView.cardModel).toEqual(cardModel);
                });

                it("should call setupLoadingIndicatorOnModel", function () {
                    expect(cardShippingView.setupLoadingIndicatorOnModel).toHaveBeenCalledWith(cardModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = {
                        "shipping": utils._.extend({}, utils.deepClone(globals.cardShipping.configuration))
                    };
                    expectedConfiguration.shipping.ableToContinue = true;

                    actualContent = cardShippingView.$el.find(":jqmData(role=content)");
                    spyOn(cardShippingView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(cardShippingView.$el, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardShippingView, "resetModel").and.callThrough();
                    spyOn(cardShippingView, "getConfiguration").and.returnValue(expectedConfiguration);
                    spyOn(cardShippingView, "updateShippingWarning").and.callThrough();
                    spyOn(cardShippingView, "formatRequiredFields").and.callThrough();

                    cardShippingView.render();
                });

                it("is defined", function () {
                    expect(cardShippingView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.render).toEqual(jasmine.any(Function));
                });

                it("should call resetModel", function () {
                    expect(cardShippingView.resetModel).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(cardShippingView.template, expectedConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, expectedConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call updateShippingWarning()", function () {
                    expect(cardShippingView.updateShippingWarning).toHaveBeenCalledWith();
                });

                it("should call formatRequiredFields()", function () {
                    expect(cardShippingView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the $el", function () {
                    expect(cardShippingView.$el.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardShippingView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the Company does NOT have any auth profiles", function () {
                    var emptyCollection = new Backbone.Collection(),
                        actualConfiguration;

                    beforeEach(function () {
                        userModel.get("selectedCompany").set("authorizationProfiles", emptyCollection);

                        actualConfiguration = cardShippingView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                            shipping: utils._.extend({}, utils.deepClone(globals.cardShipping.configuration))
                        };

                        expectedConfiguration.shipping.ableToContinue = false;
                        expectedConfiguration.shipping.unableToContinueMessage =
                            globals.cardAdd.constants.NO_AUTH_PROFILES_MESSAGE;

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

                        actualConfiguration = cardShippingView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                shipping: utils._.extend({}, utils.deepClone(globals.cardShipping.configuration))
                            },
                            user = userModel.toJSON(),
                            shippingMethodListValues = [],
                            residenceListValues = [],
                            stateListValues = [];

                        expectedConfiguration.shipping.ableToContinue = true;

                        utils._.each(user.selectedCompany.shippingMethods, function (shippingMethod) {
                            shippingMethodListValues.push({
                                "id": shippingMethod.id,
                                "name": shippingMethod.formattedName()
                            });
                        });

                        utils._.each(globals.APP.constants.STATES, function (state) {
                            state.selected = state.id === user.selectedCompany.defaultShippingAddress.state;
                            stateListValues.push(state);
                        });

                        expectedConfiguration.shipping.shippingMethod.enabled = shippingMethodListValues.length > 1;
                        expectedConfiguration.shipping.shippingMethod.values = shippingMethodListValues;

                        expectedConfiguration.shipping.firstName.value = mockShippingModel.firstName;
                        expectedConfiguration.shipping.lastName.value = mockShippingModel.lastName;
                        expectedConfiguration.shipping.companyName.value = mockShippingModel.companyName;
                        expectedConfiguration.shipping.addressLine1.value = mockShippingModel.addressLine1;
                        expectedConfiguration.shipping.addressLine2.value = mockShippingModel.addressLine2;
                        expectedConfiguration.shipping.city.value = mockShippingModel.city;

                        expectedConfiguration.shipping.state.enabled = stateListValues.length > 1;
                        expectedConfiguration.shipping.state.values = stateListValues;

                        expectedConfiguration.shipping.postalCode.value = mockShippingModel.postalCode;

                        residenceListValues.push({
                            "id": "residence-yes",
                            "label": "Yes",
                            "selected": mockShippingModel.residence === true,
                            "value": "true"
                        });
                        residenceListValues.push({
                            "id": "residence-no",
                            "label": "No",
                            "selected": mockShippingModel.residence !== true,
                            "value": "false"
                        });
                        expectedConfiguration.shipping.residence.values = residenceListValues;

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a getChangeDetailsConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardShippingView.getChangeDetailsConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.getChangeDetailsConfiguration).toEqual(jasmine.any(Function));
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
                    expectedConfiguration.card.shipping.method.value = mockShippingModel.shippingMethod.name;
                    expectedConfiguration.card.shipping.address.firstName.value = mockShippingModel.firstName;
                    expectedConfiguration.card.shipping.address.lastName.value = mockShippingModel.lastName;
                    expectedConfiguration.card.shipping.address.companyName.value = mockShippingModel.companyName;
                    expectedConfiguration.card.shipping.address.addressLine1.value = mockShippingModel.addressLine1;
                    expectedConfiguration.card.shipping.address.addressLine2.value = mockShippingModel.addressLine2;
                    expectedConfiguration.card.shipping.address.city.value = mockShippingModel.city;
                    expectedConfiguration.card.shipping.address.state.value = mockShippingModel.state;
                    expectedConfiguration.card.shipping.address.postalCode.value = mockShippingModel.postalCode;
                    expectedConfiguration.card.shipping.residence.value = (mockShippingModel.residence.name === true) ?
                        globals.cardChangedDetails.constants.RESIDENCE_YES :
                        globals.cardChangedDetails.constants.RESIDENCE_NO;

                    expectedConfiguration.requiredFields = userModel.get("selectedCompany").get("requiredFields");

                    actualConfiguration = cardShippingView.getChangeDetailsConfiguration(changeCardResponse);

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has an resetModel function that", function () {
                var shippingMethod,
                    defaultShippingAddress;

                beforeEach(function () {
                    shippingMethod = userModel.get("selectedCompany").get("shippingMethods").at(0);
                    defaultShippingAddress = userModel.get("selectedCompany").get("defaultShippingAddress").toJSON();

                    spyOn(cardShippingView, "findDefaultShippingMethod").and.returnValue(shippingMethod);
                    spyOn(cardShippingView.model, "set").and.callFake(function () {});

                    cardShippingView.resetModel();
                });

                it("is defined", function () {
                    expect(cardShippingView.resetModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.resetModel).toEqual(jasmine.any(Function));
                });

                it("should call findDefaultShippingMethod", function () {
                    expect(cardShippingView.findDefaultShippingMethod).toHaveBeenCalledWith();
                });

                it("should set shippingMethod on the model", function () {
                    expect(cardShippingView.model.set).toHaveBeenCalledWith("shippingMethod", shippingMethod);
                });

                it("should set firstName on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("firstName", defaultShippingAddress.firstName);
                });

                it("should set lastName on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("lastName", defaultShippingAddress.lastName);
                });

                it("should set companyName on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("companyName", defaultShippingAddress.companyName);
                });

                it("should set addressLine1 on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("addressLine1", defaultShippingAddress.addressLine1);
                });

                it("should set addressLine2 on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("addressLine2", defaultShippingAddress.addressLine2);
                });

                it("should set city on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("city", defaultShippingAddress.city);
                });

                it("should set state on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("state", defaultShippingAddress.state);
                });

                it("should set postalCode on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("postalCode", defaultShippingAddress.postalCode);
                });

                it("should set countryCode on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("countryCode", defaultShippingAddress.countryCode);
                });

                it("should set residence on the model", function () {
                    expect(cardShippingView.model.set)
                        .toHaveBeenCalledWith("residence", defaultShippingAddress.residence);
                });
            });

            describe("has an isAfterShippingCutoff function that", function () {
                var mockTimeZone = {
                        hour: function () {}
                    },
                    mockMoment = {
                        tz: function () { return mockTimeZone; }
                    };

                it("is defined", function () {
                    expect(cardShippingView.isAfterShippingCutoff).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.isAfterShippingCutoff).toEqual(jasmine.any(Function));
                });

                describe("when time is prior to 3pm", function () {
                    it("should return the expected value", function () {
                        var hour,
                            spy = spyOn(mockTimeZone, "hour");

                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);

                        for (hour = 0; hour < 15; hour++) {
                            spy.and.returnValue(hour);

                            expect(cardShippingView.isAfterShippingCutoff()).toBeFalsy();
                        }
                    });
                });

                describe("when time is after 3pm", function () {
                    it("should return the expected value", function () {
                        var hour,
                            spy = spyOn(mockTimeZone, "hour");

                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);

                        for (hour = 15; hour < 24; hour++) {
                            spy.and.returnValue(hour);

                            expect(cardShippingView.isAfterShippingCutoff()).toBeTruthy();
                        }
                    });
                });
            });

            describe("has an updateShippingWarning function that", function () {
                var mockElement = {
                        toggleClass: function () {}
                    };

                it("is defined", function () {
                    expect(cardShippingView.updateShippingWarning).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.updateShippingWarning).toEqual(jasmine.any(Function));
                });

                describe("when the shipping method is NOT OVERNIGHT", function () {
                    var shippingMethod = new Backbone.Model(),
                        mockShippingMethod = {
                            "id"          : "ID",
                            "name"        : "Name",
                            "cost"        : 6.66,
                            "poBoxAllowed": true
                        };

                    beforeEach(function () {
                        shippingMethod.set(mockShippingMethod);
                        shippingModel.set("shippingMethod", shippingMethod);

                        spyOn(cardShippingView.$el, "find").and.returnValue(mockElement);
                        spyOn(mockElement, "toggleClass").and.callThrough();

                        cardShippingView.updateShippingWarning();
                    });

                    it("should call find on $el", function () {
                        expect(cardShippingView.$el.find).toHaveBeenCalledWith("#shippingWarning");
                    });

                    it("should call toggleClass on the element", function () {
                        expect(cardShippingView.$el.find).toHaveBeenCalledWith("#shippingWarning");

                        expect(mockElement.toggleClass).toHaveBeenCalledWith("ui-hidden", true);
                    });
                });

                describe("when the shipping method is OVERNIGHT", function () {
                    var shippingMethod = new Backbone.Model(),
                        mockShippingMethod = {
                            "id"          : "OVERNIGHT",
                            "name"        : "Name",
                            "cost"        : 6.66,
                            "poBoxAllowed": true
                        };

                    beforeEach(function () {
                        shippingMethod.set(mockShippingMethod);
                        shippingModel.set("shippingMethod", shippingMethod);
                    });

                    describe("when isAfterShippingCutoff returns false", function () {
                        beforeEach(function () {
                            spyOn(cardShippingView.$el, "find").and.returnValue(mockElement);
                            spyOn(mockElement, "toggleClass").and.callThrough();
                            spyOn(cardShippingView, "isAfterShippingCutoff").and.returnValue(false);

                            cardShippingView.updateShippingWarning();
                        });

                        it("should call isAfterShippingCutoff", function () {
                            expect(cardShippingView.isAfterShippingCutoff).toHaveBeenCalledWith();
                        });

                        it("should call find on $el", function () {
                            expect(cardShippingView.$el.find).toHaveBeenCalledWith("#shippingWarning");
                        });

                        it("should call toggleClass on the element", function () {
                            expect(cardShippingView.$el.find).toHaveBeenCalledWith("#shippingWarning");

                            expect(mockElement.toggleClass).toHaveBeenCalledWith("ui-hidden", true);
                        });
                    });

                    describe("when isAfterShippingCutoff returns true", function () {
                        beforeEach(function () {
                            spyOn(cardShippingView.$el, "find").and.returnValue(mockElement);
                            spyOn(mockElement, "toggleClass").and.callThrough();
                            spyOn(cardShippingView, "isAfterShippingCutoff").and.returnValue(true);

                            cardShippingView.updateShippingWarning();
                        });

                        it("should call isAfterShippingCutoff", function () {
                            expect(cardShippingView.isAfterShippingCutoff).toHaveBeenCalledWith();
                        });

                        it("should call find on $el", function () {
                            expect(cardShippingView.$el.find).toHaveBeenCalledWith("#shippingWarning");
                        });

                        it("should call toggleClass on the element", function () {
                            expect(cardShippingView.$el.find).toHaveBeenCalledWith("#shippingWarning");

                            expect(mockElement.toggleClass).toHaveBeenCalledWith("ui-hidden", false);
                        });
                    });
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(cardShippingView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.handleInputChanged).toEqual(jasmine.any(Function));
                });

                describe("when the target name is shippingMethod", function () {
                    var mockEvent = {
                            "target"    : {
                                "name"  : "shippingMethod",
                                "value" : "mock shipping method id"
                            }
                        },
                        mockShippingMethod = {
                            id: "134613456",
                            name: "UNASSIGNED",
                            visible: true
                        };

                    beforeEach(function () {
                        spyOn(cardShippingView, "findShippingMethod").and.returnValue(mockShippingMethod);
                        spyOn(cardShippingView, "updateAttribute").and.callFake(function () {});
                        spyOn(cardShippingView, "updateShippingWarning").and.callThrough();

                        cardShippingView.handleInputChanged(mockEvent);
                    });

                    it("should call findShippingMethod", function () {
                        expect(cardShippingView.findShippingMethod).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(cardShippingView.updateAttribute)
                            .toHaveBeenCalledWith("shippingMethod", mockShippingMethod);
                    });

                    it("should call updateShippingWarning", function () {
                        expect(cardShippingView.updateShippingWarning).toHaveBeenCalledWith();
                    });
                });

                describe("when the target name is NOT shippingMethod", function () {
                    it("should call updateAttribute on super", function () {
                        var mockEvent = {
                            "target"            : {
                                "name"  : "target_name",
                                "value" : "target_value"
                            }
                        };

                        spyOn(CardShippingView.__super__, "handleInputChanged").and.callThrough();
                        cardShippingView.handleInputChanged(mockEvent);

                        expect(CardShippingView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });

            describe("has a handleSuccessResponse function that", function () {
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
                    eventToTrigger = "Event to Trigger";

                beforeEach(function () {
                    cardShippingView.cardModel = cardModel;
                    spyOn(mockMustache, "render").and.returnValue(mockMustacheRenderReturnValue);
                    spyOn(cardShippingView, "getChangeDetailsConfiguration").and
                        .returnValue(mockChangeDetailsConfiguration);
                    spyOn(cardShippingView, "trigger").and.callFake(function () { });
                    spyOn(cardShippingView, "resetForm").and.callFake(function () { });

                    cardShippingView.handleSuccessResponse(response, eventToTrigger);
                });

                it("is defined", function () {
                    expect(cardShippingView.handleSuccessResponse).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.handleSuccessResponse).toEqual(jasmine.any(Function));
                });

                it("should call getChangeDetailsConfiguration", function () {
                    expect(cardShippingView.getChangeDetailsConfiguration).toHaveBeenCalledWith(response);
                });

                it("should call Mustache.render() on the changeDetailsTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.argsFor(0).length).toEqual(2);
                    expect(mockMustache.render.calls.argsFor(0)[0])
                        .toEqual(cardShippingView.changeDetailsTemplate);
                    expect(mockMustache.render.calls.argsFor(0)[1])
                        .toEqual(mockChangeDetailsConfiguration);
                });

                it("should trigger an event", function () {
                    expect(cardShippingView.trigger)
                        .toHaveBeenCalledWith(eventToTrigger, mockMustacheRenderReturnValue);
                });

                it("should call resetForm", function () {
                    expect(cardShippingView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    cardShippingView.cardModel = cardModel;
                });

                it("is defined", function () {
                    expect(cardShippingView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardShippingView.submitForm).toEqual(jasmine.any(Function));
                });

                describe("when validate returns errors", function () {
                    var mockErrors = [
                        {
                            error: "asdfgasdf"
                        }
                    ];
                    beforeEach(function () {
                        spyOn(mockEvent, "preventDefault").and.callThrough();
                        spyOn(shippingModel, "validate").and.returnValue(mockErrors);
                        spyOn(cardShippingView, "handleValidationError").and.callFake(function () {});
                        spyOn(cardModel, "add").and.callFake(function () { });
                        spyOn(cardModel, "edit").and.callFake(function () { });
                        spyOn(cardShippingView, "trigger").and.callFake(function () {});

                        cardShippingView.submitForm(mockEvent);
                    });

                    it("should call event.preventDefault", function () {
                        expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                    });

                    it("should call validate on the ShippingModel", function () {
                        expect(shippingModel.validate).toHaveBeenCalledWith();
                    });

                    it("should call handleValidationError", function () {
                        expect(cardShippingView.handleValidationError).toHaveBeenCalledWith(shippingModel, mockErrors);
                    });

                    it("should NOT call add on the CardModel", function () {
                        expect(cardModel.add).not.toHaveBeenCalled();
                    });

                    it("should NOT call edit on the CardModel", function () {
                        expect(cardModel.edit).not.toHaveBeenCalled();
                    });
                });

                describe("when validate does NOT return errors", function () {
                    describe("when the cardModel does NOT have an id", function () {
                        beforeEach(function () {
                            cardModel.set("id", null);

                            spyOn(mockEvent, "preventDefault").and.callThrough();
                            spyOn(shippingModel, "validate").and.returnValue();
                            spyOn(cardShippingView, "handleValidationError").and.callFake(function () {});
                            spyOn(cardModel, "add").and.callFake(function () { });
                            spyOn(cardModel, "edit").and.callFake(function () { });

                            cardShippingView.submitForm(mockEvent);
                        });

                        it("should call event.preventDefault", function () {
                            expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                        });

                        it("should call validate on the ShippingModel", function () {
                            expect(shippingModel.validate).toHaveBeenCalledWith();
                        });

                        it("should NOT call handleValidationError", function () {
                            expect(cardShippingView.handleValidationError).not.toHaveBeenCalled();
                        });

                        describe("when calling add() on the card model", function () {
                            it("should send 2 arguments", function () {
                                expect(cardModel.add).toHaveBeenCalled();
                                expect(cardModel.add.calls.argsFor(0).length).toEqual(2);
                                expect(cardModel.add.calls.argsFor(0)[0]).toEqual(shippingModel.toJSON());
                            });

                            describe("sends as the seconds argument the options object with a success callback that",
                                function () {
                                    var response = {},
                                        model,
                                        options;

                                    beforeEach(function () {
                                        spyOn(cardShippingView, "handleSuccessResponse").and.callFake(function () { });

                                        options = cardModel.add.calls.mostRecent().args[1];
                                        options.success.call(cardShippingView, model, response);
                                    });

                                    it("should call handleSuccessResponse", function () {
                                        expect(cardShippingView.handleSuccessResponse)
                                            .toHaveBeenCalledWith(response, "cardAddSuccess");
                                    });
                                });
                        });

                        it("should NOT call edit() on the card model", function () {
                            expect(cardModel.edit).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the cardModel does have an id", function () {
                        beforeEach(function () {
                            cardModel.set("id", 1234);

                            spyOn(mockEvent, "preventDefault").and.callThrough();
                            spyOn(shippingModel, "validate").and.returnValue();
                            spyOn(cardShippingView, "handleValidationError").and.callFake(function () {});
                            spyOn(cardModel, "add").and.callFake(function () { });
                            spyOn(cardModel, "edit").and.callFake(function () { });

                            cardShippingView.submitForm(mockEvent);
                        });

                        it("should call event.preventDefault", function () {
                            expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                        });

                        it("should call validate on the ShippingModel", function () {
                            expect(shippingModel.validate).toHaveBeenCalledWith();
                        });

                        it("should NOT call handleValidationError", function () {
                            expect(cardShippingView.handleValidationError).not.toHaveBeenCalled();
                        });

                        describe("when calling edit() on the card model", function () {
                            it("should send 2 arguments", function () {
                                expect(cardModel.edit).toHaveBeenCalled();
                                expect(cardModel.edit.calls.argsFor(0).length).toEqual(2);
                                expect(cardModel.edit.calls.argsFor(0)[0]).toEqual(shippingModel.toJSON());
                            });

                            describe("sends as the seconds argument the options object with a success callback that",
                                function () {
                                    var response = {},
                                        model,
                                        options;

                                    beforeEach(function () {
                                        spyOn(cardShippingView, "handleSuccessResponse").and.callFake(function () { });

                                        options = cardModel.edit.calls.mostRecent().args[1];
                                        options.success.call(cardShippingView, model, response);
                                    });

                                    it("should call handleSuccessResponse", function () {
                                        expect(cardShippingView.handleSuccessResponse)
                                            .toHaveBeenCalledWith(response, "cardEditSuccess");
                                    });
                                });
                        });

                        it("should NOT call add() on the card model", function () {
                            expect(cardModel.add).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
