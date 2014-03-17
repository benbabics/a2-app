define(["backbone", "Squire", "mustache", "globals", "utils", "text!tmpl/driver/driver.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockDriverModel = {
                "driverId"  : null,
                "firstName" : null,
                "middleName": null,
                "lastName"  : null,
                "status"    : null,
                "statusDate": null,
                "department": {
                    id: "134613456",
                    name: "UNASSIGNED",
                    visible: true
                }
            },
            driverModel = new Backbone.Model(),
            driverView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);

        describe("A Driver View", function () {
            var jasmineAsync = new AsyncSpec(this);

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/DriverView"], function (DriverView) {
                    loadFixtures("index.html");

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
                    spyOn(mockMustache, "parse").andCallThrough();

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
                beforeEach(function () {
                    spyOn(mockMustache, "render").andCallThrough();

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
                    expect(mockMustache.render.mostRecentCall.args.length).toEqual(2);
                    expect(mockMustache.render.mostRecentCall.args[0]).toEqual(driverView.template);
                    expect(mockMustache.render.mostRecentCall.args[1]).toEqual(driverModel.toJSON());
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = driverView.$el;

                    expectedContent = Mustache.render(pageTemplate, driverModel.toJSON());

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
