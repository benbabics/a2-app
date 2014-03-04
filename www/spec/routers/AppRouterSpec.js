define(["utils", "Squire", "backbone"],
    function (utils, Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            appRouter,
            mockUtils = utils,
            mockBackbone = Backbone;

        squire.mock("backbone", mockBackbone);
        squire.mock("facade", mockFacade);
        squire.mock("utils", mockUtils);

        describe("An AppRouter", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["routers/AppRouter"], function (AppRouter) {
                    appRouter = new AppRouter();
                    done();
                });
            });

            it("is defined", function () {
                expect(appRouter).toBeDefined();
            });

            it("looks like a Backbone router", function () {
                expect(appRouter instanceof Backbone.Router).toBeTruthy();
            });

            describe("has property routes that", function () {
                it("should set 'contactUs' to showContactUs", function () {
                    expect(appRouter.routes.contactUs).toEqual("showContactUs");
                });

                it("should set '*page' to changePage", function () {
                    expect(appRouter.routes["*page"]).toEqual("changePage");
                });

                it("should set an empty string to root", function () {
                    expect(appRouter.routes[""]).toEqual("root");
                });
            });

            describe("has a showContactUs function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").andCallThrough();

                    appRouter.showContactUs();
                });

                it("is defined", function () {
                    expect(appRouter.showContactUs).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showContactUs).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.mostRecentCall.args.length).toEqual(2);
                    expect(mockFacade.publish.mostRecentCall.args[0]).toEqual("contactUs");
                    expect(mockFacade.publish.mostRecentCall.args[1]).toEqual("navigate");
                });
            });

            describe("has a changePage function that", function () {
                var pageRequested = "pageRequested";

                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallFake(function () { });

                    appRouter.changePage(pageRequested);
                });

                it("is defined", function () {
                    expect(appRouter.changePage).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.changePage).toEqual(jasmine.any(Function));
                });

                it("should call changePage on utils", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual("#" + pageRequested);
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });

            describe("has a root function that", function () {
                it("is defined", function () {
                    expect(appRouter.root).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.root).toEqual(jasmine.any(Function));
                });

                // This function does not do anything
            });

            describe("has a start function that", function () {
                it("is defined", function () {
                    expect(appRouter.start).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.start).toEqual(jasmine.any(Function));
                });

                it("should call the Backbone.history start function", function () {
                    spyOn(mockBackbone.history, "start").andCallFake(function () { });
                    appRouter.start();

                    expect(mockBackbone.history.start).toHaveBeenCalled();
                });
            });
        });

        return "App Router";
    });
