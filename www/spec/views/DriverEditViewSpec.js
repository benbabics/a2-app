define(["Squire", "backbone", "mustache", "globals", "utils", "models/DriverModel", "models/UserModel",
        "text!tmpl/driver/driverEdit.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, DriverModel, UserModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockMustache = Mustache,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "254624562",
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
                ],
                requiredFields: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = UserModel.getInstance(),
            driverReactivateModel = {
                initialize: function () {},
                save: function () {},
                toJSON: function () {}
            },
            driverTerminateModel = {
                initialize: function () {},
                save: function () {},
                toJSON: function () {}
            },
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
        squire.mock("facade", mockFacade);
        squire.mock("models/DriverReactivateModel", Squire.Helpers.returns(driverReactivateModel));
        squire.mock("models/DriverTerminateModel", Squire.Helpers.returns(driverTerminateModel));

        describe("A Driver Edit View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/DriverEditView"], function (JasmineDriverEditView) {
                    loadFixtures("index.html");

                    driverModel.initialize(mockDriverModel);
                    userModel.initialize(mockUserModel);

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
                var actualContent,
                    mockConfiguration;

                beforeEach(function () {
                    mockConfiguration = utils._.extend({}, utils.deepClone(globals.driverEdit.configuration));

                    actualContent = driverEditView.$el.find(":jqmData(role=content)");

                    spyOn(driverEditView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
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
                    expect(driverEditView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the driver is terminated", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "driver": null,
                                "permissions": null
                            },
                            actualConfiguration,
                            driverModelJSON;

                        driverModel.set("status", globals.driverEdit.constants.STATUS_TERMINATED);

                        driverModelJSON = driverModel.toJSON();

                        expectedConfiguration.driver = utils._.extend({},
                            utils.deepClone(globals.driverEdit.configuration));
                        expectedConfiguration.driver.driverName.value = driverModelJSON.lastName + ", " +
                            driverModelJSON.firstName + " " + driverModelJSON.middleName;
                        expectedConfiguration.driver.driverId.value = driverModelJSON.driverId;
                        expectedConfiguration.driver.driverStatus.value = driverModelJSON.status;
                        expectedConfiguration.driver.driverStatusDate.value = driverModelJSON.statusDate;
                        if (driverModelJSON.department) {
                            expectedConfiguration.driver.driverDepartment.value = driverModelJSON.department.name;
                        }
                        expectedConfiguration.driver.submitButton.label = globals.driverEdit.constants.BUTTON_ACTIVATE;
                        expectedConfiguration.permissions = userModel.get("permissions");

                        actualConfiguration = driverEditView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the driver is active", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "driver": null,
                                "permissions": null
                            },
                            actualConfiguration,
                            driverModelJSON;

                        driverModel.set("status", globals.driverEdit.constants.STATUS_ACTIVE);

                        driverModelJSON = driverModel.toJSON();

                        expectedConfiguration.driver = utils._.extend({},
                            utils.deepClone(globals.driverEdit.configuration));
                        expectedConfiguration.driver.driverName.value = driverModelJSON.lastName + ", " +
                            driverModelJSON.firstName + " " + driverModelJSON.middleName;
                        expectedConfiguration.driver.driverId.value = driverModelJSON.driverId;
                        expectedConfiguration.driver.driverStatus.value = driverModelJSON.status;
                        expectedConfiguration.driver.driverStatusDate.value = driverModelJSON.statusDate;
                        if (driverModelJSON.department) {
                            expectedConfiguration.driver.driverDepartment.value = driverModelJSON.department.name;
                        }
                        expectedConfiguration.driver.submitButton.label = globals.driverEdit.constants.BUTTON_TERMINATE;
                        expectedConfiguration.permissions = userModel.get("permissions");

                        actualConfiguration = driverEditView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a reactivateDriver function that", function () {
                beforeEach(function () {
                    spyOn(driverReactivateModel, "initialize").and.callThrough();
                    spyOn(driverReactivateModel, "save").and.callThrough();
                    spyOn(driverReactivateModel, "toJSON").and
                        .returnValue({"accountId": "2354625", "driverId": "1234"});

                    driverEditView.reactivateDriver();
                });

                it("is defined", function () {
                    expect(driverEditView.reactivateDriver).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.reactivateDriver).toEqual(jasmine.any(Function));
                });

                it("should call initialize on the DriverReactivateModel", function () {
                    var expectedOptions = utils._.extend({}, driverEditView.model.toJSON(), {
                        "accountId": driverEditView.userModel.get("selectedCompany").get("accountId")
                    });

                    expect(driverReactivateModel.initialize).toHaveBeenCalledWith(expectedOptions);
                });

                describe("when calling save() on the driver activate model", function () {
                    it("should send the model as the first argument", function () {
                        expect(driverReactivateModel.save).toHaveBeenCalled();
                        expect(driverReactivateModel.save.calls.mostRecent().args.length).toEqual(2);
                        expect(driverReactivateModel.save.calls.mostRecent().args[0])
                            .toEqual(driverReactivateModel.toJSON());
                    });

                    describe("sends as the second argument the options object with a success callback that",
                        function () {
                            var response = {},
                                model,
                                options;

                            beforeEach(function () {
                                spyOn(driverEditView, "trigger").and.callFake(function () { });

                                options = driverReactivateModel.save.calls.mostRecent().args[1];
                                options.success.call(driverEditView, model, response);
                            });

                            it("should trigger contactUsSuccess", function () {
                                expect(driverEditView.trigger).toHaveBeenCalled();
                                expect(driverEditView.trigger.calls.mostRecent().args.length).toEqual(2);
                                expect(driverEditView.trigger.calls.mostRecent().args[0])
                                    .toEqual("reactivateDriverSuccess");
                                expect(driverEditView.trigger.calls.mostRecent().args[1]).toEqual(response);
                            });
                        }
                    );
                });
            });

            describe("has a terminateDriver function that", function () {
                beforeEach(function () {
                    spyOn(driverTerminateModel, "initialize").and.callThrough();
                    spyOn(driverTerminateModel, "save").and.callThrough();
                    spyOn(driverTerminateModel, "toJSON").and
                        .returnValue({"accountId": "2354625", "driverId": "1234"});

                    driverEditView.terminateDriver();
                });

                it("is defined", function () {
                    expect(driverEditView.terminateDriver).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.terminateDriver).toEqual(jasmine.any(Function));
                });

                it("should call initialize on the DriverReactivateModel", function () {
                    var expectedOptions = utils._.extend({}, driverEditView.model.toJSON(), {
                        "accountId": driverEditView.userModel.get("selectedCompany").get("accountId")
                    });

                    expect(driverTerminateModel.initialize).toHaveBeenCalledWith(expectedOptions);
                });

                describe("when calling save() on the driver terminate model", function () {
                    it("should send the model as the first argument", function () {
                        expect(driverTerminateModel.save).toHaveBeenCalled();
                        expect(driverTerminateModel.save.calls.mostRecent().args.length).toEqual(2);
                        expect(driverTerminateModel.save.calls.mostRecent().args[0])
                            .toEqual(driverTerminateModel.toJSON());
                    });

                    describe("sends as the second argument the options object with a success callback that",
                        function () {
                            var response = {},
                                model,
                                options;

                            beforeEach(function () {
                                spyOn(driverEditView, "trigger").and.callFake(function () { });

                                options = driverTerminateModel.save.calls.mostRecent().args[1];
                                options.success.call(driverEditView, model, response);
                            });

                            it("should trigger contactUsSuccess", function () {
                                expect(driverEditView.trigger).toHaveBeenCalled();
                                expect(driverEditView.trigger.calls.mostRecent().args.length).toEqual(2);
                                expect(driverEditView.trigger.calls.mostRecent().args[0])
                                    .toEqual("terminateDriverSuccess");
                                expect(driverEditView.trigger.calls.mostRecent().args[1]).toEqual(response);
                            });
                        }
                    );
                });
            });

            describe("has a confirmTerminateDriver function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    driverEditView.confirmTerminateDriver();
                });

                it("is defined", function () {
                    expect(driverEditView.confirmTerminateDriver).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.confirmTerminateDriver).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.driverTerminate.constants.CONFIRMATION_TITLE);
                    expect(appAlertOptions.message)
                        .toEqual(globals.driverTerminate.constants.CONFIRMATION_MESSAGE);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.driverTerminate.constants.OK_BTN_TEXT);
                    expect(appAlertOptions.primaryBtnHandler).toEqual(jasmine.any(Function));
                    expect(appAlertOptions.secondaryBtnLabel)
                        .toEqual(globals.driverTerminate.constants.CANCEL_BTN_TEXT);
                });

                describe("sends as the primaryBtnHandler argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(driverEditView, "terminateDriver").and.callFake(function () { });

                        options.primaryBtnHandler.call(driverEditView);
                    });

                    it("should call terminateDriver", function () {
                        expect(driverEditView.terminateDriver).toHaveBeenCalledWith();
                    });
                });
            });

            describe("has a changeStatus function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(driverEditView, "reactivateDriver").and.callFake(function () {});
                    spyOn(driverEditView, "confirmTerminateDriver").and.callFake(function () {});
                });

                it("is defined", function () {
                    expect(driverEditView.changeStatus).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverEditView.changeStatus).toEqual(jasmine.any(Function));
                });

                describe("when driver is terminated", function () {
                    beforeEach(function () {
                        driverModel.set("status", globals.driverEdit.constants.STATUS_TERMINATED);

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

                    it("should call reactivateDriver", function () {
                        expect(driverEditView.reactivateDriver).toHaveBeenCalledWith();
                    });

                    it("should NOT call confirmTerminateDriver", function () {
                        expect(driverEditView.confirmTerminateDriver).not.toHaveBeenCalledWith();
                    });
                });

                describe("when driver is active", function () {
                    beforeEach(function () {
                        driverModel.set("status", globals.driverEdit.constants.STATUS_ACTIVE);

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

                    it("should NOT call reactivateDriver", function () {
                        expect(driverEditView.reactivateDriver).not.toHaveBeenCalledWith();
                    });

                    it("should call confirmTerminateDriver", function () {
                        expect(driverEditView.confirmTerminateDriver).toHaveBeenCalledWith();
                    });
                });
            });
        });
    });
