define(["Squire", "backbone", "mustache", "globals", "utils", "models/DriverModel",
        "text!tmpl/driver/driverEdit.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, DriverModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUserModel = {
                "authenticated": "true",
                "email": "mobiledevelopment@wexinc.com"
            },
            userModel = new Backbone.Model(),
            mockDriverModel = {
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
            },
            driverModel = new DriverModel(),
            driverEditView,
            DriverEditView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);

        describe("A Driver Edit View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverEditView"], function (JasmineDriverEditView) {
                    loadFixtures("index.html");

                    driverModel.initialize(mockDriverModel);
                    userModel.set(mockUserModel);

                    DriverEditView = JasmineDriverEditView;
                    driverEditView = new DriverEditView({
                        model    : driverModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(driverEditView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverEditView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call changeStatus when submitChangeStatus-btn is clicked", function () {
                    expect(driverEditView.events["click #submitChangeStatus-btn"]).toEqual("changeStatus");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverEditView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(driverEditView.el).toEqual("#driverDetails");
                });

                it("should set el nodeName", function () {
                    expect(driverEditView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(driverEditView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(DriverEditView.__super__, "initialize").and.callFake(function () {});

                    driverEditView.initialize();
                });

                it("is defined", function () {
                    expect(driverEditView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(DriverEditView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverEditView.template);
                });

                it("should set userModel", function () {
                    expect(driverEditView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var mockConfiguration;

                beforeEach(function () {
                    mockConfiguration = utils._.extend({}, utils.deepClone(globals.driverEdit.configuration));

                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(driverEditView, "getConfiguration").and.callFake(function() { return mockConfiguration; });

                    driverEditView.render();
                });

                it("is defined", function () {
                    expect(driverEditView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration", function () {
                    expect(driverEditView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(driverEditView.template, mockConfiguration);
                });

                it("should set the content", function () {
                    var $content = driverEditView.$el.find(":jqmData(role=content)"),
                        expectedContent = Mustache.render(pageTemplate, mockConfiguration);

                    expect($content[0]).toContainHtml(expectedContent);
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(driverEditView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the driver is terminated", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            actualConfiguration,
                            driverModelJSON;

                        driverModel.set("status", globals.driverEdit.constants.STATUS_TERMINATED);

                        driverModelJSON = driverModel.toJSON();

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverEdit.configuration));
                        expectedConfiguration.driverName.value = driverModelJSON.lastName + ", " +
                            driverModelJSON.firstName + " " + driverModelJSON.middleName;
                        expectedConfiguration.driverId.value = driverModelJSON.driverId;
                        expectedConfiguration.driverStatus.value = driverModelJSON.status;
                        expectedConfiguration.driverStatusDate.value = driverModelJSON.statusDate;
                        if (driverModelJSON.department) {
                            expectedConfiguration.driverDepartment.value = driverModelJSON.department.name;
                        }
                        expectedConfiguration.submitButton.label = globals.driverEdit.constants.BUTTON_ACTIVATE;

                        actualConfiguration = driverEditView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the driver is active", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration,
                            actualConfiguration,
                            driverModelJSON;

                        driverModel.set("status", globals.driverEdit.constants.STATUS_ACTIVE);

                        driverModelJSON = driverModel.toJSON();

                        expectedConfiguration = utils._.extend({}, utils.deepClone(globals.driverEdit.configuration));
                        expectedConfiguration.driverName.value = driverModelJSON.lastName + ", " +
                            driverModelJSON.firstName + " " + driverModelJSON.middleName;
                        expectedConfiguration.driverId.value = driverModelJSON.driverId;
                        expectedConfiguration.driverStatus.value = driverModelJSON.status;
                        expectedConfiguration.driverStatusDate.value = driverModelJSON.statusDate;
                        if (driverModelJSON.department) {
                            expectedConfiguration.driverDepartment.value = driverModelJSON.department.name;
                        }
                        expectedConfiguration.submitButton.label = globals.driverEdit.constants.BUTTON_TERMINATE;

                        actualConfiguration = driverEditView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a changeStatus function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();

                    driverEditView.changeStatus(mockEvent);
                });

                it("is defined", function () {
                    expect(driverEditView.changeStatus).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.changeStatus).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });
            });
        });
    });
