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
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/DriverSearchView"],
                    function (DriverSearchView) {
                        loadFixtures("index.html");

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
                    expect(driverSearchView.el).toBe("#driverSearch");
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
                    spyOn(mockMustache, "parse").andCallThrough();
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
                var mockConfiguration;

                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();
                    spyOn(driverSearchView, "getConfiguration").andCallFake(function () { return mockConfiguration; });
                    driverSearchView.render();
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

                it("sets the header content", function () {
                    var expectedContent = Mustache.render(searchHeaderTemplate,
                        {
                            "permissions": userModel.get("permissions")
                        }),
                        $header = driverSearchView.$el.find(":jqmData(role=header)");

                    expect($header[0]).toContainHtml(expectedContent);
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverSearchView.template, mockConfiguration);
                });

                it("sets content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration),
                        $content = driverSearchView.$el.find(":jqmData(role=content)");

                    expect($content[0]).toContainHtml(expectedContent);
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
                        spyOn(utils._, "size").andCallFake(function () { return 1; });
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            departmentListValues = [],
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverSearch.configuration));

                        utils._.each(mockUserModel.selectedCompany.departments, function (department, key, list) {
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
                        spyOn(utils._, "size").andCallFake(function () { return 2; });
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            departmentListValues = [],
                            actualConfiguration;

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverSearch.configuration));
                        departmentListValues.push(globals.driverSearch.constants.ALL);

                        utils._.each(mockUserModel.selectedCompany.departments, function (department, key, list) {
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
                    spyOn(mockEvent, "preventDefault").andCallThrough();
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
            });
        });
    });
