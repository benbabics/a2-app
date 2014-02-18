define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            appRouter,
            mockBackbone = Backbone;

        squire.mock("backbone", mockBackbone);

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
                it("should set an empty string to root", function () {
                    expect(appRouter.routes[""]).toEqual("root");
                });
            });

            describe("has a root function that", function () {
                it("is defined", function () {
                    expect(appRouter.root).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.root).toEqual(jasmine.any(Function));
                });

                // This function doesn't do anything
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
