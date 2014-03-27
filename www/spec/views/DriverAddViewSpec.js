define(["Squire", "backbone", "mustache", "globals", "utils", "models/DriverAddModel", "models/UserModel",
        "text!tmpl/driver/driverAdd.html", "text!tmpl/driver/driverAddDetails.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, DriverAddModel, UserModel, pageTemplate,
              driverAddDetailsTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "254624562",
                    wexAccountNumber: "5764309",
                    driverIdLength: "256",
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
                ]
            },
            mockDriverAddModel = {
                driverId     : "13465134561",
                firstName    : "First Name",
                middleInitial: "X",
                lastName     : "Last Name",
                departmentId : "52v4612345"
            },
            driverAddModel = new DriverAddModel(),
            userModel = UserModel.getInstance(),
            driverAddView,
            DriverAddView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);

        describe("A Driver Add View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverAddView"], function (JasmineDriverAddView) {
                    loadFixtures("index.html");

                    driverAddModel.initialize(mockDriverAddModel);
                    userModel.initialize(mockUserModel);

                    DriverAddView = JasmineDriverAddView;
                    driverAddView = new DriverAddView({
                        model: driverAddModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(driverAddView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverAddView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when ssubmitDriverAdd-btn is clicked", function () {
                    expect(driverAddView.events["click #submitDriverAdd-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when driverAddForm is submitted", function () {
                    expect(driverAddView.events["submit #driverAddForm"]).toEqual("submitForm");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverAddView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(driverAddView.el).toEqual("#driverAdd");
                });

                it("should set el nodeName", function () {
                    expect(driverAddView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(driverAddView.template).toEqual(pageTemplate);
                });

                it("should set the addDetailsTemplate", function () {
                    expect(driverAddView.addDetailsTemplate).toEqual(driverAddDetailsTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(DriverAddView.__super__, "initialize").and.callFake(function () {});

                    driverAddView.initialize();
                });

                it("is defined", function () {
                    expect(driverAddView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(DriverAddView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the addDetailsTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverAddView.addDetailsTemplate);
                });

                it("should set userModel", function () {
                    expect(driverAddView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = {
                        "driver"        : utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                        "requiredFields": driverAddView.userModel.get("selectedCompany").get("requiredFields")
                    };

                    actualContent = driverAddView.$el.find(":jqmData(role=content)");
                    spyOn(driverAddView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(driverAddView, "getConfiguration").and.callFake(function() { return expectedConfiguration; });
                    spyOn(driverAddView, "updateValidationRules").and.callThrough();
                    spyOn(driverAddView, "formatRequiredFields").and.callThrough();

                    driverAddView.render();
                });

                it("is defined", function () {
                    expect(driverAddView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration", function () {
                    expect(driverAddView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.argsFor(0).length).toEqual(2);
                    expect(mockMustache.render.calls.argsFor(0)[0]).toEqual(driverAddView.template);
                    expect(mockMustache.render.calls.argsFor(0)[1]).toEqual(expectedConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, expectedConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call updateValidationRules()", function () {
                    expect(driverAddView.updateValidationRules).toHaveBeenCalledWith();
                });

                it("should call formatRequiredFields()", function () {
                    expect(driverAddView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should include a driverId field if the user's company does have the DRIVER_ID required field", function () {
                        driverAddView.userModel.get("selectedCompany").set("requiredFields", {"DRIVER_ID": true});

                        expectedConfiguration = {
                            "driver"        : utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                            "requiredFields": driverAddView.userModel.get("selectedCompany").get("requiredFields")
                        };

                        driverAddView.render();

                        expect(actualContent[0]).toContainElement("input[id='driverId']");
                    });

                    it("should NOT include a driverId field if the user's company does NOT have the DRIVER_ID required field", function () {
                        driverAddView.userModel.get("selectedCompany").set("requiredFields", {"DRIVER_ID": false});

                        expectedConfiguration = {
                            "driver"        : utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                            "requiredFields": driverAddView.userModel.get("selectedCompany").get("requiredFields")
                        };

                        driverAddView.render();

                        expect(actualContent[0]).not.toContainElement("input[id='driverId']");
                    });
                });
            });

            describe("has an updateValidationRules function that", function () {
                beforeEach(function () {
                    driverAddView.updateValidationRules();
                });

                it("is defined", function () {
                    expect(driverAddView.updateValidationRules).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.updateValidationRules).toEqual(jasmine.any(Function));
                });

                it("should set the driverId required flag", function () {
                    expect(driverAddView.model.validation.driverId[0].required)
                        .toEqual(userModel.get("selectedCompany").get("requiredFields").DRIVER_ID);
                });

                it("should set the valid driverId length", function () {
                    expect(driverAddView.model.validation.driverId[2].length)
                        .toEqual(mockUserModel.selectedCompany.driverIdLength);
                });

                it("should set the valid driverId length error message", function () {
                    var expectedValue = Mustache.render(globals.driverAdd.constants.ERROR_DRIVER_ID_INVALID_LENGTH, {
                        "driverIdLength": mockUserModel.selectedCompany.driverIdLength
                    });

                    expect(driverAddView.model.validation.driverId[2].msg).toEqual(expectedValue);
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(driverAddView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.getConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration = {
                            driver: {},
                            requiredFields: {}
                        },
                        departmentListValues = [],
                        actualConfiguration;

                    expectedConfiguration.driver = utils._.extend({}, utils.deepClone(globals.driverAdd.configuration));

                    utils._.each(mockUserModel.selectedCompany.departments, function (department) {
                        if (department.visible === true) {
                            departmentListValues.push({
                                "id": department.id,
                                "name": department.name,
                                "selected": department.name === globals.driverAdd.constants.DEFAULT_DEPARTMENT_NAME
                            });
                        }
                    });

                    expectedConfiguration.requiredFields = userModel.get("selectedCompany").get("requiredFields");

                    expectedConfiguration.driver.firstName.value = mockDriverAddModel.firstName;
                    expectedConfiguration.driver.middleInitial.value = mockDriverAddModel.middleInitial;
                    expectedConfiguration.driver.lastName.value = mockDriverAddModel.lastName;
                    expectedConfiguration.driver.driverId.maxLength = mockUserModel.selectedCompany.driverIdLength;
                    expectedConfiguration.driver.driverId.value = mockDriverAddModel.driverId;
                    expectedConfiguration.driver.departmentId.enabled = false;
                    expectedConfiguration.driver.departmentId.values = departmentListValues;

                    expectedConfiguration.driver.driverId.placeholder =
                        Mustache.render(globals.driverAdd.constants.DRIVER_ID_PLACEHOLDER_FORMAT, {
                            "driverIdLength": mockUserModel.selectedCompany.driverIdLength
                        });

                    actualConfiguration = driverAddView.getConfiguration();

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has a getAddDetailsConfiguration function that", function () {
                it("is defined", function () {
                    expect(driverAddView.getAddDetailsConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.getAddDetailsConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration = {
                            "message": null,
                            "driver": null
                        },
                        actualConfiguration,
                        addDriverResponse = {
                            "message": "Mock Message",
                            "data": {
                                "driverId"  : "354t25ty",
                                "firstName" : "Homer",
                                "middleName": "B",
                                "lastName"  : "Simpson",
                                "status"    : "Active",
                                "statusDate": "3/20/2014",
                                "department": {
                                    id: "134613456",
                                    name: "UNASSIGNED",
                                    visible: true
                                }
                            }
                        };

                    expectedConfiguration.message = addDriverResponse.message;

                    expectedConfiguration.driver = utils._.extend({},
                        utils.deepClone(globals.driverAddedDetails.configuration));
                    expectedConfiguration.driver.driverName.value = addDriverResponse.data.lastName + ", " +
                        addDriverResponse.data.firstName + " " + addDriverResponse.data.middleName;
                    expectedConfiguration.driver.driverId.value = addDriverResponse.data.driverId;
                    expectedConfiguration.driver.driverStatus.value = addDriverResponse.data.status;
                    expectedConfiguration.driver.driverStatusDate.value = addDriverResponse.data.statusDate;
                    if (addDriverResponse.data.department) {
                        expectedConfiguration.driver.driverDepartment.value = addDriverResponse.data.department.name;
                    }

                    actualConfiguration = driverAddView.getAddDetailsConfiguration(addDriverResponse);

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has a findDefaultDepartmentId function that", function () {
                it("is defined", function () {
                    expect(driverAddView.findDefaultDepartmentId).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.findDefaultDepartmentId).toEqual(jasmine.any(Function));
                });

                describe("when 'UNASSIGNED' is first in the department list", function () {
                    var mockDepartments = [
                        {
                            id: "134613456",
                            name: "UNASSIGNED",
                            visible: true
                        },
                        {
                            id: "245725472",
                            name: "UNAfdhgsdfhawhSSIGNED",
                            visible: true
                        },
                        {
                            id: "356836582",
                            name: "dhadfh",
                            visible: true
                        },
                        {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            visible: false
                        }
                    ];

                    beforeEach(function () {
                        userModel.get("selectedCompany").setDepartments(mockDepartments);
                    });

                    it("should return the expected result", function () {
                        var expectedValue = mockDepartments[0].id,
                            actualValue = driverAddView.findDefaultDepartmentId();

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when 'UNASSIGNED' is last in the department list", function () {
                    var mockDepartments = [
                        {
                            id: "134613456",
                            name: "afgadfg",
                            visible: true
                        },
                        {
                            id: "245725472",
                            name: "UNAfdhgsdfhawhSSIGNED",
                            visible: true
                        },
                        {
                            id: "356836582",
                            name: "dhadfh",
                            visible: true
                        },
                        {
                            id: "2456724567",
                            name: "UNASSIGNED",
                            visible: true
                        }
                    ];

                    beforeEach(function () {
                        userModel.get("selectedCompany").setDepartments(mockDepartments);
                    });

                    it("should return the expected result", function () {
                        var expectedValue = mockDepartments[3].id,
                            actualValue = driverAddView.findDefaultDepartmentId();

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when 'UNASSIGNED' is in the department list but not visible", function () {
                    var mockDepartments = [
                        {
                            id: "134613456",
                            name: "afgadfg",
                            visible: true
                        },
                        {
                            id: "245725472",
                            name: "UNAfdhgsdfhawhSSIGNED",
                            visible: true
                        },
                        {
                            id: "356836582",
                            name: "UNASSIGNED",
                            visible: false
                        },
                        {
                            id: "2456724567",
                            name: "sghsghwsgh",
                            visible: true
                        }
                    ];

                    beforeEach(function () {
                        userModel.get("selectedCompany").setDepartments(mockDepartments);
                    });

                    it("should return the expected result", function () {
                        var actualValue = driverAddView.findDefaultDepartmentId();

                        expect(actualValue).toBeNull();
                    });
                });

                describe("when 'UNASSIGNED' is NOT in the department list", function () {
                    var mockDepartments = [
                        {
                            id: "134613456",
                            name: "afgadfg",
                            visible: true
                        },
                        {
                            id: "245725472",
                            name: "UNAfdhgsdfhawhSSIGNED",
                            visible: true
                        },
                        {
                            id: "356836582",
                            name: "dhadfh",
                            visible: true
                        },
                        {
                            id: "2456724567",
                            name: "sghsghwsgh",
                            visible: true
                        }
                    ];

                    beforeEach(function () {
                        userModel.get("selectedCompany").setDepartments(mockDepartments);
                    });

                    it("should return the expected result", function () {
                        var actualValue = driverAddView.findDefaultDepartmentId();

                        expect(actualValue).toBeNull();
                    });
                });

                describe("when 'the department list is empty", function () {
                    var mockDepartments = [];

                    beforeEach(function () {
                        userModel.get("selectedCompany").setDepartments(mockDepartments);
                    });

                    it("should return the expected result", function () {
                        var actualValue = driverAddView.findDefaultDepartmentId();

                        expect(actualValue).toBeNull();
                    });
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                        preventDefault : function () { }
                    };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(driverAddModel, "set").and.callFake(function () { });
                    spyOn(driverAddModel, "save").and.callFake(function () { });
                    driverAddView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(driverAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call set on the model", function () {
                    expect(driverAddModel.set)
                        .toHaveBeenCalledWith("accountId", mockUserModel.selectedCompany.accountId);
                });

                describe("when calling save() on the model", function () {
                    var mockAddDetailsConfiguration = utils._.extend({},
                            utils.deepClone(globals.driverAddedDetails.configuration)),
                        mockDefaultDepartmentId = "23546256";

                    it("should send the model as the first argument", function () {
                        expect(driverAddModel.save).toHaveBeenCalled();
                        expect(driverAddModel.save.calls.mostRecent().args.length).toEqual(2);
                        expect(driverAddModel.save.calls.mostRecent().args[0]).toEqual(driverAddModel.toJSON());
                    });

                    describe("sends as the second argument the options object with a success callback that",
                        function () {
                            var response = {},
                                model,
                                options,
                                mockMustacheRenderReturnValue = "Render return value";

                            beforeEach(function () {
                                spyOn(mockMustache, "render").and.returnValue(mockMustacheRenderReturnValue);
                                spyOn(driverAddView, "getAddDetailsConfiguration").and
                                    .returnValue(mockAddDetailsConfiguration);
                                spyOn(driverAddView, "trigger").and.callFake(function () { });
                                spyOn(driverAddView, "resetForm").and.callFake(function () { });
                                spyOn(driverAddView, "findDefaultDepartmentId").and
                                    .returnValue(mockDefaultDepartmentId);

                                options = driverAddModel.save.calls.mostRecent().args[1];
                                options.success.call(driverAddView, model, response);
                            });

                            it("should call getAddDetailsConfiguration", function () {
                                expect(driverAddView.getAddDetailsConfiguration).toHaveBeenCalledWith(response);
                            });

                            it("should call Mustache.render() on the addDetailsTemplate", function () {
                                expect(mockMustache.render).toHaveBeenCalled();
                                expect(mockMustache.render.calls.argsFor(0).length).toEqual(2);
                                expect(mockMustache.render.calls.argsFor(0)[0])
                                    .toEqual(driverAddView.addDetailsTemplate);
                                expect(mockMustache.render.calls.argsFor(0)[1]).toEqual(mockAddDetailsConfiguration);
                            });

                            it("should trigger driverAddSuccess", function () {
                                expect(driverAddView.trigger).toHaveBeenCalled();
                                expect(driverAddView.trigger.calls.mostRecent().args.length).toEqual(2);
                                expect(driverAddView.trigger.calls.mostRecent().args[0]).toEqual("driverAddSuccess");
                                expect(driverAddView.trigger.calls.mostRecent().args[1])
                                    .toEqual(mockMustacheRenderReturnValue);
                            });

                            it("should call resetForm", function () {
                                expect(driverAddView.resetForm).toHaveBeenCalledWith();
                            });

                            it("should call findDefaultDepartmentId", function () {
                                expect(driverAddView.findDefaultDepartmentId).toHaveBeenCalledWith();
                            });

                            it("should call set on the Driver Add Model", function () {
                                expect(driverAddModel.set)
                                    .toHaveBeenCalledWith("departmentId", mockDefaultDepartmentId);
                            });
                        }
                    );
                });
            });
        });
    });
