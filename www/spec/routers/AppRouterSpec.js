define(["utils", "Squire", "backbone"],
    function (utils, Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            appRouter,
            mockUtils = utils,
            mockBackbone = Backbone;

        squire.mock("backbone", mockBackbone);
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
                it("should set about to showAbout", function () {
                    expect(appRouter.routes.about).toEqual("showAbout");
                });

                it("should set contactUs to showContactUs", function () {
                    expect(appRouter.routes.contactUs).toEqual("showContactUs");
                });

                it("should set info to showInfo", function () {
                    expect(appRouter.routes.info).toEqual("showInfo");
                });

                it("should set termsAndConditions to showTermsAndConditions", function () {
                    expect(appRouter.routes.termsAndConditions).toEqual("showTermsAndConditions");
                });

                it("should set an empty string to root", function () {
                    expect(appRouter.routes[""]).toEqual("root");
                });
            });

            describe("has a showAbout function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallFake(function () { });

                    appRouter.showAbout();
                });

                it("is defined", function () {
                    expect(appRouter.showAbout).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showAbout).toEqual(jasmine.any(Function));
                });

                it("should call changePage on utils", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual("#about");
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });

            describe("has a showContactUs function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallFake(function () { });

                    appRouter.showContactUs();
                });

                it("is defined", function () {
                    expect(appRouter.showContactUs).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showContactUs).toEqual(jasmine.any(Function));
                });

                it("should call changePage on utils", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual("#contactUs");
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });

            describe("has a showInfo function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallFake(function () { });

                    appRouter.showInfo();
                });

                it("is defined", function () {
                    expect(appRouter.showInfo).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showInfo).toEqual(jasmine.any(Function));
                });

                it("should call changePage on utils", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual("#info");
                    expect(mockUtils.changePage.mostRecentCall.args[1]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[2]).toBeNull();
                    expect(mockUtils.changePage.mostRecentCall.args[3]).toBeTruthy();
                });
            });

            describe("has a showTermsAndConditions function that", function () {
                beforeEach(function () {
                    spyOn(mockUtils, "changePage").andCallFake(function () { });

                    appRouter.showTermsAndConditions();
                });

                it("is defined", function () {
                    expect(appRouter.showTermsAndConditions).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showTermsAndConditions).toEqual(jasmine.any(Function));
                });

                it("should call changePage on utils", function () {
                    expect(mockUtils.changePage).toHaveBeenCalled();

                    expect(mockUtils.changePage.mostRecentCall.args.length).toEqual(4);
                    expect(mockUtils.changePage.mostRecentCall.args[0]).toEqual("#termsAndConditions");
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
