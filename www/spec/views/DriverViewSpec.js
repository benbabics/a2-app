define(["backbone", "Squire", "mustache", "globals", "utils", "models/DriverModel",
        "text!tmpl/driver/driver.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, DriverModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockDriverModel = {
                "id"        : 35425,
                "firstName" : "Ben",
                "middleName": "D",
                "lastName"  : "Over",
                "status"    : "Active",
                "statusDate": "3/20/2014",
                "department": {
                    id: "134613456",
                    name: "UNASSIGNED",
                    visible: true
                }
            },
            driverModel = new DriverModel(),
            driverView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);

        describe("A Driver View", function () {
            beforeEach(function (done) {
                squire.require(["views/DriverView"], function (DriverView) {
                    loadFixtures("../../../index.html");

                    driverModel.initialize(mockDriverModel);

                    driverView = new DriverView({
                        model: driverModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(driverView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(driverView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el nodeName", function () {
                    expect(driverView.el.nodeName).toEqual("LI");
                });

                it("should set the template", function () {
                    expect(driverView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();

                    driverView.initialize();
                });

                it("is defined", function () {
                    expect(driverView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverView.initialize).toEqual(jasmine.any(Function));
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(driverView.template);
                });
            });

            describe("has a render function that", function () {
                var mockConfiguration = globals.driverSearchResults.configuration;

                beforeEach(function () {
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(driverView, "getConfiguration").and.callFake(function () { return mockConfiguration; });

                    driverView.initialize();
                    driverView.render();
                });

                it("is defined", function () {
                    expect(driverView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalled();
                    expect(mockMustache.render.calls.mostRecent().args.length).toEqual(2);
                    expect(mockMustache.render.calls.mostRecent().args[0]).toEqual(driverView.template);
                    expect(mockMustache.render.calls.mostRecent().args[1]).toEqual(mockConfiguration);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = driverView.$el;

                    expectedContent = Mustache.render(pageTemplate, mockConfiguration);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(driverView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    beforeEach(function () {
                        driverView.model = null;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "driver" : null
                            },
                            actualConfiguration;


                        actualConfiguration = driverView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when model exists", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                driver: {}
                            },
                            actualConfiguration;

                        expectedConfiguration.driver = utils._.extend({},
                            utils.deepClone(globals.driverSearchResults.configuration));

                        expectedConfiguration.driver.url.value =
                            globals.driverSearchResults.constants.DRIVER_DETAILS_BASE_URL + mockDriverModel.id;
                        expectedConfiguration.driver.driverName.value = mockDriverModel.lastName + ", " +
                                                                        mockDriverModel.firstName + " " +
                                                                        mockDriverModel.middleName;
                        expectedConfiguration.driver.id.value = mockDriverModel.id;
                        expectedConfiguration.driver.driverStatus.value = mockDriverModel.status;
                        if (mockDriverModel.department) {
                            expectedConfiguration.driver.driverDepartment.value = mockDriverModel.department.name;
                        }

                        actualConfiguration = driverView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });
        });
    });
