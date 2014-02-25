define(["backbone", "Squire"],
    function (Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            mockAppModel = {
                "buildVersion"   : "Mock Build Version",
                "deviceId"       : "Mock Device Id",
                "platform"       : "Mock Platform",
                "platformVersion": "Mock Platform Version"
            },
            appModel = new Backbone.Model(),
            AppModel = {
                getInstance: function () { }
            },
            mockAboutView = {
                $el: "#about",
                constructor: function () { },
                initialize: function () { }
            },
            aboutController;

        squire.mock("models/AppModel", AppModel);
        squire.mock("views/AboutView", Squire.Helpers.returns(mockAboutView));

        describe("An About Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/AboutController"], function (AboutController) {
                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").andCallFake(function () { return appModel; });

                    aboutController = AboutController;

                    done();
                });
            });

            it("is defined", function () {
                expect(aboutController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(aboutController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    aboutController.init();
                });

                it("is defined", function () {
                    expect(aboutController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutController.init).toEqual(jasmine.any(Function));
                });

                describe("when initializing the AppModel", function () {
                    it("should set the appModel variable to the AppModel instance", function () {
                        expect(aboutController.appModel).toEqual(appModel);
                    });
                });

                describe("when initializing the AboutView", function () {
                    beforeEach(function () {
                        spyOn(aboutController, "constructor").andCallThrough();
                    });

                    it("should set the aboutView variable to a new AboutView object", function () {
                        expect(aboutController.aboutView).toEqual(mockAboutView);
                    });
                });
            });
        });
    });
