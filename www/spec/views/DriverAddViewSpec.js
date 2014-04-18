define(["Squire", "backbone", "mustache", "globals", "utils", "models/DriverModel", "models/UserModel",
        "text!tmpl/driver/driverAdd.html", "text!tmpl/driver/driverAddDetails.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, DriverModel, UserModel, pageTemplate,
              driverAddDetailsTemplate) {

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
                            idFixedLength: 256,
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
            mockDriverModel = {
                id           : "13465134561",
                firstName    : "First Name",
                middleName   : "X",
                lastName     : "Last Name",
                department   : {
                    id       : "2456724567",
                    name     : "Dewey, Cheetum and Howe",
                    visible  : true
                }
            },
            driverModel = new DriverModel(),
            userModel = UserModel.getInstance(),
            driverAddView,
            DriverAddView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);

        describe("A Driver Add View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverAddView"], function (JasmineDriverAddView) {
                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    driverModel.initialize(mockDriverModel);
                    userModel.initialize(mockUserModel);

                    DriverAddView = JasmineDriverAddView;
                    driverAddView = new DriverAddView({
                        model: driverModel,
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
                it("should call submitForm when submitDriverAdd-btn is clicked", function () {
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
                    spyOn(driverAddView.$el, "on").and.callFake(function () {});
                    spyOn(DriverAddView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

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

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(driverAddView, "handlePageBeforeShow");
                });

                it("should parse the addDetailsTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverAddView.addDetailsTemplate);
                });

                it("should set userModel", function () {
                    expect(driverAddView.userModel).toEqual(userModel);
                });

                it("should call on() on $el", function () {
                    expect(driverAddView.$el.on)
                        .toHaveBeenCalledWith("pagebeforeshow", driverAddView.handlePageBeforeShow);
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
                    spyOn(driverAddView, "getConfiguration").and
                        .callFake(function () { return expectedConfiguration; });
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

                it("should call formatRequiredFields()", function () {
                    expect(driverAddView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should include a driverId field if the user's company does have the DRIVER_ID required field",
                        function () {
                            driverAddView.userModel.get("selectedCompany").set("requiredFields", {"DRIVER_ID": true});

                            expectedConfiguration = {
                                "driver"        : utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                                "requiredFields": driverAddView.userModel.get("selectedCompany").get("requiredFields")
                            };

                            driverAddView.render();

                            expect(actualContent[0]).toContainElement("input[id='id']");
                        });

                    it("should NOT include a driverId field if the user's company does NOT have the DRIVER_ID required field",
                        function () {
                            driverAddView.userModel.get("selectedCompany").set("requiredFields", {"DRIVER_ID": false});

                            expectedConfiguration = {
                                "driver"        : utils._.extend({}, utils.deepClone(globals.driverAdd.configuration)),
                                "requiredFields": driverAddView.userModel.get("selectedCompany").get("requiredFields")
                            };

                            driverAddView.render();

                            expect(actualContent[0]).not.toContainElement("input[id='id']");
                        });
                });
            });

            describe("has an resetForm function that", function () {
                var mockDepartment = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        visible: true
                    };

                beforeEach(function () {
                    spyOn(DriverAddView.__super__, "resetForm").and.callFake(function () {});
                    spyOn(driverAddView, "findDefaultDepartment").and.returnValue(mockDepartment);
                    spyOn(driverAddView.model, "set").and.callFake(function () {});

                    driverAddView.resetForm();
                });

                it("is defined", function () {
                    expect(driverAddView.resetForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.resetForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm on super", function () {
                    expect(DriverAddView.__super__.resetForm).toHaveBeenCalledWith();
                });

                it("should call findDefaultDepartment", function () {
                    expect(driverAddView.findDefaultDepartment).toHaveBeenCalledWith();
                });

                it("should call set on the model", function () {
                    expect(driverAddView.model.set).toHaveBeenCalledWith("department", mockDepartment);
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

                    expectedConfiguration.driver.firstName.value = mockDriverModel.firstName;
                    expectedConfiguration.driver.firstName.maxLength =
                        mockUserModel.selectedCompany.settings.driverSettings.firstNameMaxLength;

                    expectedConfiguration.driver.middleName.value = mockDriverModel.middleName;
                    expectedConfiguration.driver.middleName.maxLength =
                        mockUserModel.selectedCompany.settings.driverSettings.middleNameMaxLength;

                    expectedConfiguration.driver.lastName.value = mockDriverModel.lastName;
                    expectedConfiguration.driver.lastName.maxLength =
                        mockUserModel.selectedCompany.settings.driverSettings.lastNameMaxLength;

                    expectedConfiguration.driver.id.maxLength =
                        mockUserModel.selectedCompany.settings.driverSettings.idFixedLength;
                    expectedConfiguration.driver.id.value = mockDriverModel.id;
                    expectedConfiguration.driver.id.placeholder =
                        Mustache.render(globals.driver.constants.DRIVER_ID_PLACEHOLDER_FORMAT, {
                            "idFixedLength": mockUserModel.selectedCompany.settings.driverSettings.idFixedLength
                        });
                    expectedConfiguration.driver.departmentId.enabled = false;
                    expectedConfiguration.driver.departmentId.values = departmentListValues;

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
                                "id"        : "354t25ty",
                                "firstName" : "Homer",
                                "middleName": "B",
                                "lastName"  : "Simpson",
                                "status"    : "Active",
                                "statusDate": "3/20/2014",
                                "department": {
                                    id      : "134613456",
                                    name    : "UNASSIGNED",
                                    visible : true
                                }
                            }
                        };

                    expectedConfiguration.message = addDriverResponse.message;

                    expectedConfiguration.driver = utils._.extend({},
                        utils.deepClone(globals.driverAddedDetails.configuration));
                    expectedConfiguration.driver.driverName.value = addDriverResponse.data.lastName + ", " +
                        addDriverResponse.data.firstName + " " + addDriverResponse.data.middleName;
                    expectedConfiguration.driver.id.value = addDriverResponse.data.id;
                    expectedConfiguration.driver.status.value = addDriverResponse.data.status;
                    expectedConfiguration.driver.statusDate.value = addDriverResponse.data.statusDate;
                    if (addDriverResponse.data.department) {
                        expectedConfiguration.driver.department.value = addDriverResponse.data.department.name;
                    }

                    actualConfiguration = driverAddView.getAddDetailsConfiguration(addDriverResponse);

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
                    expect(driverAddView.findDefaultDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.findDefaultDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    driverAddView.findDefaultDepartment();

                    expect(departments.findWhere).toHaveBeenCalledWith(
                        {
                            "visible": true,
                            "name"   : globals.driverAdd.constants.DEFAULT_DEPARTMENT_NAME
                        }
                    );
                });

                it("should return the expected value", function () {
                    var actualValue = driverAddView.findDefaultDepartment();

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
                    expect(driverAddView.findDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.findDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    driverAddView.findDepartment(mockDepartmentId);

                    expect(departments.findWhere).toHaveBeenCalledWith(
                        {
                            "visible": true,
                            "id": mockDepartmentId
                        }
                    );
                });

                it("should return the expected value", function () {
                    var actualValue = driverAddView.findDepartment(mockDepartmentId);

                    expect(actualValue).toEqual(mockDepartment);
                });
            });

            describe("has a pageBeforeShow function that", function () {
                beforeEach(function () {
                    spyOn(driverAddView, "resetForm").and.callFake(function () { });

                    driverAddView.pageBeforeShow();
                });

                it("is defined", function () {
                    expect(driverAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm", function () {
                    expect(driverAddView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a handlePageBeforeShow function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(driverAddView, "pageBeforeShow").and.callFake(function () { });

                    driverAddView.handlePageBeforeShow(mockEvent);
                });

                it("is defined", function () {
                    expect(driverAddView.handlePageBeforeShow).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.handlePageBeforeShow).toEqual(jasmine.any(Function));
                });

                it("should call pageBeforeShow", function () {
                    expect(driverAddView.pageBeforeShow).toHaveBeenCalledWith();
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(driverAddView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddView.handleInputChanged).toEqual(jasmine.any(Function));
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
                        spyOn(driverAddView, "findDepartment").and.returnValue(mockDepartment);
                        spyOn(driverAddView, "updateAttribute").and.callFake(function () {});

                        driverAddView.handleInputChanged(mockEvent);
                    });

                    it("should call findDepartment", function () {
                        expect(driverAddView.findDepartment).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(driverAddView.updateAttribute).toHaveBeenCalledWith("department", mockDepartment);
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

                        spyOn(DriverAddView.__super__, "handleInputChanged").and.callThrough();
                        driverAddView.handleInputChanged(mockEvent);

                        expect(DriverAddView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                        preventDefault : function () { }
                    };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(driverModel, "add").and.callFake(function () { });
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

                describe("when calling add() on the model", function () {
                    var mockAddDetailsConfiguration = utils._.extend({},
                            utils.deepClone(globals.driverAddedDetails.configuration));

                    it("should send 1 argument", function () {
                        expect(driverModel.add).toHaveBeenCalled();
                        expect(driverModel.add.calls.mostRecent().args.length).toEqual(1);
                    });

                    describe("sends as the first argument the options object with a success callback that",
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

                                options = driverModel.add.calls.mostRecent().args[0];
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
                        });
                });
            });
        });
    });
