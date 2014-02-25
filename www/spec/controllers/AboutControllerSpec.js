define(["utils", "backbone", "Squire"],
    function (utils, Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            mockAppModel = {
                "buildVersion"   : "Mock Build Version",
                "platform"       : "Mock Platform",
                "platformVersion": "Mock Platform Version"
            },
            appModel = new Backbone.Model(),
            AppModel = {
                getInstance: function () { }
            },
            mockAboutView = {
                $el: "#about",
                constructor: function () { }
            },
            aboutController;

        squire.mock("utils", mockUtils);
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

                describe("when initializing the AboutView", function () {
                    beforeEach(function () {
                        spyOn(aboutController, "constructor").andCallThrough();
                    });

                    it("should set the aboutView variable to a new AboutView object", function () {
                        expect(aboutController.aboutView).toEqual(mockAboutView);
                    });

                    xit('should send in the AppModel as the model argument', function () {
                        expect(mockAboutView.constructor).toHaveBeenCalled();
                        expect(mockAboutView.constructor).toHaveBeenCalledWith({
                            model: AppModel.getInstance()
                        });

                        // TODO: this isn't working, need to figure out how to test
                    });
                });
            });

            describe("has a navigate function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallFake(function () { });

                    aboutController.navigate();
                });

                it("is defined", function () {
                    expect(aboutController.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(aboutController.navigate).toEqual(jasmine.any(Function));
                });

                it("should call changePage on utils", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual(mockAboutView.$el);
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });
        });
    });
