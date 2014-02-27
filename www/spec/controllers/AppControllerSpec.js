define(["backbone", "Squire"],
    function (Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            mockAppModel = {
                "buildVersion": "1.1.1"
            },
            appModel = new Backbone.Model(),
            AppModel = {
                getInstance: function () { }
            },
            mockRouter = {
                start: function () { },
                navigate: function () { }
            },
            mockAppView = {
                $el: "",
                constructor: function () { },
                initialize: function () { },
                render: function () { }
            },
            appController;

        squire.mock("models/AppModel", AppModel);
        squire.mock("routers/AppRouter", Squire.Helpers.returns(mockRouter));
        squire.mock("views/AppView", Squire.Helpers.returns(mockAppView));

        describe("An App Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/AppController"], function (AppController) {
                    appModel.set(mockAppModel);
                    spyOn(AppModel, "getInstance").andCallFake(function () { return appModel; });

                    appController = AppController;

                    done();
                });
            });

            it("is defined", function () {
                expect(appController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(appController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    appController.init();
                });

                it("is defined", function () {
                    expect(appController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.init).toEqual(jasmine.any(Function));
                });

                describe("when initializing the AppRouter", function () {
                    it("should set the appRouter variable to a new AppRouter object", function () {
                        expect(appController.appRouter).toEqual(mockRouter);
                    });
                });

                describe("when initializing the AppModel", function () {
                    it("should set the appModel variable to the AppModel instance", function () {
                        expect(appController.appModel).toEqual(appModel);
                    });
                });

                describe("when initializing the AppView", function () {
                    beforeEach(function () {
                        spyOn(mockAppView, "constructor").andCallThrough();
                    });

                    it("should set the appView variable to a new AppView object", function () {
                        expect(appController.appView).toEqual(mockAppView);
                    });

                    xit("should send in the correct parameters to the constructor", function () {
                        expect(mockAppView.constructor).toHaveBeenCalled();
                        expect(mockAppView.constructor).toHaveBeenCalledWith({
                            model: appModel,
                            el   : document.body
                        });

                        // TODO: this is not working, need to figure out how to test
                    });
                });
            });

            describe("has a ready function that", function () {
                beforeEach(function () {
                    spyOn(mockRouter, "start").andCallThrough();
                    spyOn(mockRouter, "navigate").andCallFake(function () { });
                    spyOn(mockAppView, "render").andCallThrough();
                    spyOn(window, "setTimeout").andCallThrough();

                    appController.init();
                    appController.ready();
                });

                it("is defined", function () {
                    expect(appController.ready).toBeDefined();
                });

                it("is a function", function () {
                    expect(appController.ready).toEqual(jasmine.any(Function));
                });

                it("should call the appRouter start function", function () {
                    expect(mockRouter.start).toHaveBeenCalled();

                    expect(mockRouter.start.mostRecentCall.args.length).toEqual(0);
                });

                it("should call the appView render function", function () {
                    expect(mockAppView.render).toHaveBeenCalled();

                    expect(mockAppView.render.mostRecentCall.args.length).toEqual(0);
                });

                it("should call the window setTimeout function", function () {
                    expect(window.setTimeout).toHaveBeenCalled();

                    expect(window.setTimeout.mostRecentCall.args.length).toEqual(2);
                    expect(window.setTimeout.mostRecentCall.args[0]).toEqual(jasmine.any(Function));
                    expect(window.setTimeout.mostRecentCall.args[1]).toEqual(2000);
                });

                describe("calling the window setTimeout callback parameter", function () {
                    it("should call the navigator.splashscreen.hide function", function () {
                        var callback = window.setTimeout.mostRecentCall.args[0];

                        spyOn(navigator.splashscreen, "hide").andCallFake(function () {});

                        callback.apply();

                        expect(navigator.splashscreen.hide).toHaveBeenCalled();

                        expect(navigator.splashscreen.hide.mostRecentCall.args.length).toEqual(0);
                    });
                });
            });
        });
    });
