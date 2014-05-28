define(["Squire", "globals", "utils", "backbone", "mustache", "models/UserModel", "views/FormView",
        "text!tmpl/driver/search.html", "text!tmpl/driver/searchHeader.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, UserModel, FormView, pageTemplate, searchHeaderTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockUtils = utils,
            mockDriverModel = {
                "firstName"   : "Curly",
                "lastName"    : "Howard",
                "id"          : null,
                "status"      : null,
                "department"  : null
            },
            driverModel = new Backbone.Model(),
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
            userModel = UserModel.getInstance(),
            DriverSearchView,
            driverSearchView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("views/FormView", FormView);
        squire.mock("models/UserModel", UserModel);

        describe("A Driver Search View", function () {
            beforeEach(function (done) {
                squire.require(["views/DriverSearchView"], function (JasmineDriverSearchView) {
                    loadFixtures("../../../index.html");

                    DriverSearchView = JasmineDriverSearchView;

                    driverModel.set(mockDriverModel);
                    userModel.parse(mockUserModel);

                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    driverSearchView =  new DriverSearchView({
                        model: driverModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(driverSearchView).toBeDefined();
            });

            it("looks like a FormView", function () {
                expect(driverSearchView instanceof FormView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitDriverSearch-btn is clicked", function () {
                    expect(driverSearchView.events["click #submitDriverSearch-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when driverSearchForm is submitted", function () {
                    expect(driverSearchView.events["submit #driverSearchForm"]).toEqual("submitForm");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverSearchView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(driverSearchView.el).toEqual("#driverSearch");
                });

                it("should set el nodeName", function () {
                    expect(driverSearchView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(driverSearchView.template).toEqual(pageTemplate);
                });

                it("should set the headerTemplate", function () {
                    expect(driverSearchView.headerTemplate).toEqual(searchHeaderTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(DriverSearchView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(driverSearchView.$el, "on").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    driverSearchView.initialize();
                });

                it("is defined", function () {
                    expect(driverSearchView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(DriverSearchView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(driverSearchView, "handlePageBeforeShow");
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverSearchView.headerTemplate);
                });

                it("should call on() on $el", function () {
                    expect(driverSearchView.$el.on)
                        .toHaveBeenCalledWith("pagebeforeshow", driverSearchView.handlePageBeforeShow);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(driverSearchView, "renderHeader").and.callFake(function () { });
                    spyOn(driverSearchView, "renderContent").and.callFake(function () { });
                    spyOn(driverSearchView.$el, "trigger").and.callThrough();

                    driverSearchView.render();
                });

                it("is defined", function () {
                    expect(driverSearchView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.render).toEqual(jasmine.any(Function));
                });

                it("should call renderHeader", function () {
                    expect(driverSearchView.renderHeader).toHaveBeenCalledWith();
                });

                it("should call renderContent", function () {
                    expect(driverSearchView.renderContent).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the $el", function () {
                    expect(driverSearchView.$el.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a renderHeader function that", function () {
                var actualHeader;

                beforeEach(function () {
                    actualHeader = driverSearchView.$el.find(":jqmData(role=header)");
                    spyOn(driverSearchView.$el, "find").and.returnValue(actualHeader);
                    spyOn(actualHeader, "html").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();

                    driverSearchView.renderHeader();

                });

                it("is defined", function () {
                    expect(driverSearchView.renderHeader).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.renderHeader).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverSearchView.headerTemplate,
                        {
                            "permissions"   : userModel.get("selectedCompany").get("permissions")
                        });
                });

                it("should call the html function on the header", function () {
                    var expectedContent = Mustache.render(searchHeaderTemplate,
                        {
                            "permissions": userModel.get("selectedCompany").get("permissions")
                        });
                    expect(actualHeader.html).toHaveBeenCalledWith(expectedContent);
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should include a link to the Driver Add page if the user has the MOBILE_DRIVER_ADD permission",
                        function () {
                            driverSearchView.userModel.get("selectedCompany")
                                .set("permissions", {"MOBILE_DRIVER_ADD": true});
                            driverSearchView.renderHeader();

                            expect(actualHeader[0]).toContainElement("a[href='#driverAdd']");
                        });

                    it("should NOT include a link to the Driver Add page if the user does NOT have the MOBILE_DRIVER_ADD permission",
                        function () {
                            driverSearchView.userModel.get("selectedCompany")
                                .set("permissions", {"MOBILE_DRIVER_ADD": false});
                            driverSearchView.renderHeader();

                            expect(actualHeader[0]).not.toContainElement("a[href='#driverAdd']");
                        });
                });
            });

            describe("has a renderContent function that", function () {
                var actualContent,
                    mockConfiguration = globals.driverSearch.configuration;

                beforeEach(function () {
                    actualContent = driverSearchView.$el.find(":jqmData(role=content)");

                    spyOn(driverSearchView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(driverSearchView, "getConfiguration").and.callFake(function () { return mockConfiguration; });

                    driverSearchView.renderContent();
                });

                it("is defined", function () {
                    expect(driverSearchView.renderContent).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.renderContent).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverSearchView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(driverSearchView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when utils.size returns 1", function () {
                    beforeEach(function () {
                        spyOn(mockUtils._, "size").and.callFake(function () { return 1; });
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            departmentListValues = [],
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverSearch.configuration));

                        utils._.each(mockUserModel.selectedCompany.departments, function (department) {
                            departmentListValues.push({
                                "id"  : department.id,
                                "name": department.name
                            });
                        });

                        expectedConfiguration.departmentId.enabled = false;
                        expectedConfiguration.departmentId.values = departmentListValues;

                        actualConfiguration = driverSearchView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when utils.size returns > 1", function () {
                    beforeEach(function () {
                        spyOn(mockUtils._, "size").and.callFake(function () { return 2; });
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            departmentListValues = [],
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverSearch.configuration));
                        departmentListValues.push(globals.driverSearch.constants.ALL);

                        utils._.each(mockUserModel.selectedCompany.departments, function (department) {
                            departmentListValues.push({
                                "id"  : department.id,
                                "name": department.name
                            });
                        });

                        expectedConfiguration.departmentId.enabled = true;
                        expectedConfiguration.departmentId.values = departmentListValues;

                        actualConfiguration = driverSearchView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
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
                    expect(driverSearchView.findDepartment).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.findDepartment).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the departments collection", function () {
                    driverSearchView.findDepartment(mockDepartmentId);

                    expect(departments.findWhere).toHaveBeenCalledWith({"id": mockDepartmentId});
                });

                it("should return the expected value", function () {
                    var actualValue = driverSearchView.findDepartment(mockDepartmentId);

                    expect(actualValue).toEqual(mockDepartment);
                });
            });

            describe("has a pageBeforeShow function that", function () {
                beforeEach(function () {
                    spyOn(driverSearchView, "resetForm").and.callFake(function () { });

                    driverSearchView.pageBeforeShow();
                });

                it("is defined", function () {
                    expect(driverSearchView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm", function () {
                    expect(driverSearchView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a handlePageBeforeShow function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(driverSearchView, "pageBeforeShow").and.callFake(function () { });

                    driverSearchView.handlePageBeforeShow(mockEvent);
                });

                it("is defined", function () {
                    expect(driverSearchView.handlePageBeforeShow).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.handlePageBeforeShow).toEqual(jasmine.any(Function));
                });

                it("should call pageBeforeShow", function () {
                    expect(driverSearchView.pageBeforeShow).toHaveBeenCalledWith();
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(driverSearchView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.handleInputChanged).toEqual(jasmine.any(Function));
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
                        spyOn(driverSearchView, "findDepartment").and.returnValue(mockDepartment);
                        spyOn(driverSearchView, "updateAttribute").and.callFake(function () {});

                        driverSearchView.handleInputChanged(mockEvent);
                    });

                    it("should call findDepartment", function () {
                        expect(driverSearchView.findDepartment).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(driverSearchView.updateAttribute).toHaveBeenCalledWith("department", mockDepartment);
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

                        spyOn(DriverSearchView.__super__, "handleInputChanged").and.callThrough();
                        driverSearchView.handleInputChanged(mockEvent);

                        expect(DriverSearchView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(driverSearchView, "trigger").and.callFake(function () { });

                    driverSearchView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(driverSearchView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should trigger searchSubmitted", function () {
                    expect(driverSearchView.trigger).toHaveBeenCalledWith("searchSubmitted");
                });
            });
        });
    });
