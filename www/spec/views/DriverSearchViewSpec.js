define(["Squire", "globals", "utils", "backbone", "mustache", "models/UserModel", "text!tmpl/driver/search.html",
    "text!tmpl/driver/searchHeader.html", "jasmine-jquery"],
    function (Squire, globals, utils, Backbone, Mustache, UserModel, pageTemplate, searchHeaderTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            mockDriverSearchModel = {
                "filterFirstName"   : "Curly",
                "filterLastName"    : "Howard",
                "filterDriverId"    : null,
                "filterStatus"      : null,
                "filterDepartmentId": null
            },
            driverSearchModel = new Backbone.Model(),
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
                    driverIdLength: "4",
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
            userModel = UserModel.getInstance(),
            driverSearchView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);
        squire.mock("utils", utils);

        describe("A Driver Search View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverSearchView"],
                    function (DriverSearchView) {
                        //TODO - Fix - Loading fixtures causes phantomjs to hang
                        //loadFixtures("index.html");

                        driverSearchModel.set(mockDriverSearchModel);
                        userModel.initialize(mockUserModel);

                        driverSearchView =  new DriverSearchView({
                            model: driverSearchModel,
                            userModel: userModel
                        });

                        done();
                    });
            });

            it("is defined", function () {
                expect(driverSearchView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverSearchView instanceof Backbone.View).toBeTruthy();
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
                    spyOn(mockMustache, "parse").and.callThrough();
                    driverSearchView.initialize();
                });

                it("is defined", function () {
                    expect(driverSearchView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverSearchView.template);
                });

                it("should parse the headerTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverSearchView.headerTemplate);
                });

                it("should set userModel", function () {
                    expect(driverSearchView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(driverSearchView, "renderHeader").and.callFake(function () { });
                    spyOn(driverSearchView, "renderContent").and.callFake(function () { });

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
            });

            describe("has a renderHeader function that", function () {
                var actualHeader;

                beforeEach(function () {
                    actualHeader = driverSearchView.$el.find(":jqmData(role=header)");
                    spyOn(driverSearchView.$el, "find").and.returnValue(actualHeader);
                    spyOn(actualHeader, "html").and.callThrough();
                    spyOn(actualHeader, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();

                    driverSearchView.renderHeader();

                });

                it("is defined", function () {
                    expect(driverSearchView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the headerTemplate", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverSearchView.headerTemplate,
                        {
                            "permissions"   : userModel.get("permissions")
                        });
                });

                it("should call the html function on the header", function () {
                    var expectedContent = Mustache.render(searchHeaderTemplate,
                        {
                            "permissions": userModel.get("permissions")
                        });
                    expect(actualHeader.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the header", function () {
                    expect(actualHeader.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should include a link to the Driver Add page if the user has the MOBILE_DRIVER_ADD permission", function () {
                        driverSearchView.userModel.set("permissions", {"MOBILE_DRIVER_ADD": true});
                        driverSearchView.renderHeader();

                        expect(actualHeader[0]).toContainElement("a[href='#driverAdd']");
                    });

                    it("should NOT include a link to the Driver Add page if the user does NOT have the MOBILE_DRIVER_ADD permission", function () {
                        driverSearchView.userModel.set("permissions", {"MOBILE_DRIVER_ADD": false});
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
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(driverSearchView, "getConfiguration").and.callFake(function () { return mockConfiguration; });

                    driverSearchView.render();
                });

                it("is defined", function () {
                    expect(driverSearchView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSearchView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverSearchView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
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
                        spyOn(utils._, "size").and.callFake(function () { return 1; });
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

                        expectedConfiguration.filterFirstName.value = mockDriverSearchModel.filterFirstName;
                        expectedConfiguration.filterLastName.value = mockDriverSearchModel.filterLastName;
                        expectedConfiguration.filterDriverId.value = mockDriverSearchModel.filterDriverId;
                        expectedConfiguration.filterStatus.value = mockDriverSearchModel.filterStatus;
                        expectedConfiguration.filterDepartmentId.value = mockDriverSearchModel.filterDepartmentId;
                        expectedConfiguration.filterDepartmentId.enabled = false;
                        expectedConfiguration.filterDepartmentId.values = departmentListValues;

                        actualConfiguration = driverSearchView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when utils.size returns > 1", function () {
                    beforeEach(function () {
                        spyOn(utils._, "size").and.callFake(function () { return 2; });
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

                        // populate configuration details from the model
                        expectedConfiguration.filterFirstName.value = mockDriverSearchModel.filterFirstName;
                        expectedConfiguration.filterLastName.value = mockDriverSearchModel.filterLastName;
                        expectedConfiguration.filterDriverId.value = mockDriverSearchModel.filterDriverId;
                        expectedConfiguration.filterStatus.value = mockDriverSearchModel.filterStatus;
                        expectedConfiguration.filterDepartmentId.value = mockDriverSearchModel.filterDepartmentId;
                        expectedConfiguration.filterDepartmentId.enabled = true;
                        expectedConfiguration.filterDepartmentId.values = departmentListValues;

                        actualConfiguration = driverSearchView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(driverSearchModel, "set").and.callFake(function () { });
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

                it("should call set on the model", function () {
                    expect(driverSearchModel.set)
                        .toHaveBeenCalledWith("accountId", mockUserModel.selectedCompany.accountId);
                });

                it("should trigger searchSubmitted", function () {
                    expect(driverSearchView.trigger).toHaveBeenCalledWith("searchSubmitted");
                });
            });
        });
    });
