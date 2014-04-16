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
                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    cardModel.initialize(mockCardModel);
                    userModel.initialize(mockUserModel);

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

                    actualContent = cardAddView.$el.find(":jqmData(role=content)");
                    spyOn(cardAddView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
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
            });

            describe("has an resetForm function that", function () {
                var mockDepartment = {
                    id: "134613456",
                    name: "UNASSIGNED",
                    visible: true
                };

                beforeEach(function () {
                    spyOn(CardAddView.__super__, "resetForm").and.callFake(function () {});
                    spyOn(cardAddView, "findDefaultDepartment").and.returnValue(mockDepartment);
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

                it("should call set on the model", function () {
                    expect(cardAddView.model.set).toHaveBeenCalledWith("department", mockDepartment);
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(cardAddView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardAddView.getConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration = {
                            card: {},
                            requiredFields: {}
                        },
                        actualConfiguration;

                    expectedConfiguration.card = utils._.extend({}, utils.deepClone(globals.cardAdd.configuration));

                    expectedConfiguration.requiredFields = userModel.get("selectedCompany").get("requiredFields");

                    actualConfiguration = cardAddView.getConfiguration();

                    expect(actualConfiguration).toEqual(expectedConfiguration);
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
        });
    });
