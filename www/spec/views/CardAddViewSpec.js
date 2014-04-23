define(["Squire", "backbone", "mustache", "globals", "utils", "models/CardModel", "models/UserModel",
        "text!tmpl/card/cardAdd.html", "jasmine-jquery"],
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
            cardAddView,
            CardAddView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);

        describe("A Card Add View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/CardAddView"], function (JasmineCardAddView) {
                    var authorizationProfiles;

                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    cardModel.initialize(mockCardModel);
                    userModel.initialize(mockUserModel);
                    authorizationProfiles = new Backbone.Collection();
                    userModel.get("selectedCompany").set("authorizationProfiles", authorizationProfiles);

                    CardAddView = JasmineCardAddView;
                    cardAddView = new CardAddView({
                        model: cardModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(cardAddView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(cardAddView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitCardAdd-btn is clicked", function () {
                    expect(cardAddView.events["click #submitCardAdd-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when cardAddForm is submitted", function () {
                    expect(cardAddView.events["submit #cardAddForm"]).toEqual("submitForm");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardAddView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(cardAddView.el).toEqual("#cardAdd");
                });

                it("should set el nodeName", function () {
                    expect(cardAddView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(cardAddView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(cardAddView.$el, "on").and.callFake(function () {});
                    spyOn(CardAddView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    cardAddView.initialize();
                });

                it("is defined", function () {
                    expect(cardAddView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(CardAddView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(cardAddView, "handlePageBeforeShow");
                });

                it("should set userModel", function () {
                    expect(cardAddView.userModel).toEqual(userModel);
                });

                it("should call on() on $el", function () {
                    expect(cardAddView.$el.on)
                        .toHaveBeenCalledWith("pagebeforeshow", cardAddView.handlePageBeforeShow);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = {
                        "card"          : utils._.extend({}, utils.deepClone(globals.cardAdd.configuration)),
                        "requiredFields": cardAddView.userModel.get("selectedCompany").get("requiredFields")
                    };
                    expectedConfiguration.card.ableToAddCard = true;

                    actualContent = cardAddView.$el.find(":jqmData(role=content)");
                    spyOn(cardAddView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(cardAddView, "resetModel").and.callFake(function () { });
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(cardAddView, "getConfiguration").and.callFake(function () { return expectedConfiguration; });
                    spyOn(cardAddView, "formatRequiredFields").and.callThrough();

                    cardAddView.render();
                });

                it("is defined", function () {
                    expect(cardAddView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.render).toEqual(jasmine.any(Function));
                });

                it("should call resetModel", function () {
                    expect(cardAddView.resetModel).toHaveBeenCalledWith();
                });

                it("should call getConfiguration", function () {
                    expect(cardAddView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.argsFor(0).length).toEqual(2);
                    expect(mockMustache.render.calls.argsFor(0)[0]).toEqual(cardAddView.template);
                    expect(mockMustache.render.calls.argsFor(0)[1]).toEqual(expectedConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, expectedConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(cardAddView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    describe("when able to add card", function () {
                        beforeEach(function () {
                            expectedConfiguration.card.ableToAddCard = true;
                            expectedConfiguration.card.unableToAddCardMessage = "Should not include this";

                            cardAddView.render();
                        });

                        it("should NOT include an unable to add card message", function () {
                            expect(actualContent[0]).not
                                .toContainText(expectedConfiguration.card.unableToAddCardMessage);
                        });

                        it("should include a cardAddForm", function () {
                            expect(actualContent[0]).toContainElement("form[id='cardAddForm']");
                        });
                    });

                    describe("when NOT able to add card", function () {
                        beforeEach(function () {
                            expectedConfiguration.card.ableToAddCard = false;
                            expectedConfiguration.card.unableToAddCardMessage = "Unable to add card";

                            cardAddView.render();
                        });

                        it("should include an unable to add card message", function () {
                            expect(actualContent[0]).toContainText(expectedConfiguration.card.unableToAddCardMessage);
                        });

                        it("should NOT include a cardAddForm", function () {
                            expect(actualContent[0]).not.toContainElement("form[id='cardAddForm']");
                        });
                    });
                });
            });

            describe("has an resetForm function that", function () {
                var mockDepartment = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    },
                    mockAuthorizationProfileModel = {
                        id     : 2457624567,
                        name   : "Mock Name",
                        productRestriction: 2134
                    },
                    authorizationProfileModel;

                beforeEach(function () {
                    authorizationProfileModel = new Backbone.Model();
                    authorizationProfileModel.set(mockAuthorizationProfileModel);

                    spyOn(CardAddView.__super__, "resetForm").and.callFake(function () {});
                    spyOn(cardAddView, "findDefaultDepartment").and.returnValue(mockDepartment);
                    spyOn(cardAddView, "findDefaultAuthorizationProfile").and.returnValue(authorizationProfileModel);
                    spyOn(cardAddView.model, "set").and.callFake(function () {});

                    cardAddView.resetForm();
                });

                it("is defined", function () {
                    expect(cardAddView.resetForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.resetForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm on super", function () {
                    expect(CardAddView.__super__.resetForm).toHaveBeenCalledWith();
                });

                it("should call findDefaultDepartment", function () {
                    expect(cardAddView.findDefaultDepartment).toHaveBeenCalledWith();
                });

                it("should set department on the model", function () {
                    expect(cardAddView.model.set).toHaveBeenCalledWith("department", mockDepartment);
                });

                it("should call findDefaultAuthorizationProfile", function () {
                    expect(cardAddView.findDefaultAuthorizationProfile).toHaveBeenCalledWith();
                });

                it("should set authorizationProfileName on the model", function () {
                    expect(cardAddView.model.set)
                        .toHaveBeenCalledWith("authorizationProfileName", mockAuthorizationProfileModel.name);
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardAddView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the Company does NOT have any auth profiles", function () {
                    var emptyCollection = new Backbone.Collection(),
                        actualConfiguration;

                    beforeEach(function () {
                        userModel.get("selectedCompany").set("authorizationProfiles", emptyCollection);

                        actualConfiguration = cardAddView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                card: utils._.extend({}, utils.deepClone(globals.cardAdd.configuration)),
                                requiredFields: {}
                            };

                        expectedConfiguration.card.ableToAddCard = false;
                        expectedConfiguration.card.unableToAddCardMessage =
                            globals.cardAdd.constants.NO_AUTH_PROFILES_MESSAGE;

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

                        actualConfiguration = cardAddView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                card: utils._.extend({}, utils.deepClone(globals.cardAdd.configuration)),
                                requiredFields: {}
                            },
                            user = userModel.toJSON(),
                            authorizationProfileListValues = [],
                            departmentListValues = [],
                            stateListValues = [];

                        expectedConfiguration.card.ableToAddCard = true;

                        utils._.each(user.selectedCompany.authorizationProfiles, function (authorizationProfile) {
                            authorizationProfileListValues.push({
                                "id": authorizationProfile.name,
                                "name": authorizationProfile.name
                            });
                        });

                        utils._.each(user.selectedCompany.departments, function (department) {
                            if (department.visible === true) {
                                departmentListValues.push({
                                    "id": department.id,
                                    "name": department.name,
                                    "selected": department.name === globals.cardAdd.constants.DEFAULT_DEPARTMENT_NAME
                                });
                            }
                        });

                        stateListValues.push(globals.cardAdd.constants.SELECT_STATE);
                        utils._.each(globals.APP.constants.STATES, function (state) {
                            stateListValues.push(state);
                        });

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

            describe("has a findDefaultAuthorizationProfile function that", function () {
                var mockAuthorizationProfileModel = {
                        id     : 2457624567,
                        name   : "Mock Name",
                        productRestriction: 2134
                    },
                    authorizationProfiles;

                beforeEach(function () {
                    authorizationProfiles = userModel.get("selectedCompany").get("authorizationProfiles");
                    spyOn(authorizationProfiles, "at").and.returnValue(mockAuthorizationProfileModel);
                });

                it("is defined", function () {
                    expect(cardAddView.findDefaultAuthorizationProfile).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.findDefaultAuthorizationProfile).toEqual(jasmine.any(Function));
                });

                it("should call at on the departments collection", function () {
                    cardAddView.findDefaultAuthorizationProfile();

                    expect(authorizationProfiles.at).toHaveBeenCalledWith(0);
                });

                it("should return the expected value", function () {
                    var actualValue = cardAddView.findDefaultAuthorizationProfile();

                    expect(actualValue).toEqual(mockAuthorizationProfileModel);
                });
            });

            describe("has a findDefaultDepartment function that", function () {
                var mockDepartment = {
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
                    expect(cardAddView.findDefaultDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.findDefaultDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    cardAddView.findDefaultDepartment();

                    expect(departments.findWhere).toHaveBeenCalledWith(
                        {
                            "visible": true,
                            "name"   : globals.cardAdd.constants.DEFAULT_DEPARTMENT_NAME
                        }
                    );
                });

                it("should return the expected value", function () {
                    var actualValue = cardAddView.findDefaultDepartment();

                    expect(actualValue).toEqual(mockDepartment);
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
                    expect(cardAddView.findDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.findDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    cardAddView.findDepartment(mockDepartmentId);

                    expect(departments.findWhere).toHaveBeenCalledWith(
                        {
                            "visible": true,
                            "id": mockDepartmentId
                        }
                    );
                });

                it("should return the expected value", function () {
                    var actualValue = cardAddView.findDepartment(mockDepartmentId);

                    expect(actualValue).toEqual(mockDepartment);
                });
            });

            describe("has a pageBeforeShow function that", function () {
                beforeEach(function () {
                    spyOn(cardAddView, "resetForm").and.callFake(function () { });

                    cardAddView.pageBeforeShow();
                });

                it("is defined", function () {
                    expect(cardAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm", function () {
                    expect(cardAddView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a handlePageBeforeShow function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(cardAddView, "pageBeforeShow").and.callFake(function () { });

                    cardAddView.handlePageBeforeShow(mockEvent);
                });

                it("is defined", function () {
                    expect(cardAddView.handlePageBeforeShow).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.handlePageBeforeShow).toEqual(jasmine.any(Function));
                });

                it("should call pageBeforeShow", function () {
                    expect(cardAddView.pageBeforeShow).toHaveBeenCalledWith();
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(cardAddView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.handleInputChanged).toEqual(jasmine.any(Function));
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
                        spyOn(cardAddView, "findDepartment").and.returnValue(mockDepartment);
                        spyOn(cardAddView, "updateAttribute").and.callFake(function () {});

                        cardAddView.handleInputChanged(mockEvent);
                    });

                    it("should call findDepartment", function () {
                        expect(cardAddView.findDepartment).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(cardAddView.updateAttribute).toHaveBeenCalledWith("department", mockDepartment);
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

                        spyOn(CardAddView.__super__, "handleInputChanged").and.callThrough();
                        cardAddView.handleInputChanged(mockEvent);

                        expect(CardAddView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();

                    cardAddView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(cardAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                describe("when validate returns errors", function () {
                    var mockErrors = [
                            {
                                error: "asdfgasdf"
                            }
                        ];
                    beforeEach(function () {
                        spyOn(cardModel, "validate").and.returnValue(mockErrors);
                        spyOn(cardAddView, "handleValidationError").and.callFake(function () {});
                        spyOn(cardAddView, "trigger").and.callFake(function () {});

                        cardAddView.submitForm(mockEvent);
                    });

                    it("should call validate on the CardModel", function () {
                        expect(cardModel.validate).toHaveBeenCalledWith();
                    });

                    it("should call handleValidationError", function () {
                        expect(cardAddView.handleValidationError).toHaveBeenCalledWith(cardModel, mockErrors);
                    });

                    it("should NOT trigger cardAddSubmitted", function () {
                        expect(cardAddView.trigger).not.toHaveBeenCalled();
                    });
                });

                describe("when validate does NOT return errors", function () {
                    beforeEach(function () {
                        spyOn(cardModel, "validate").and.returnValue();
                        spyOn(cardAddView, "handleValidationError").and.callFake(function () {});
                        spyOn(cardAddView, "trigger").and.callFake(function () {});

                        cardAddView.submitForm(mockEvent);
                    });

                    it("should call validate on the CardModel", function () {
                        expect(cardModel.validate).toHaveBeenCalledWith();
                    });

                    it("should NOT call handleValidationError", function () {
                        expect(cardAddView.handleValidationError).not.toHaveBeenCalled();
                    });

                    it("should trigger cardAddSubmitted", function () {
                        expect(cardAddView.trigger).toHaveBeenCalledWith("cardAddSubmitted");
                    });
                });
            });
        });
    });
