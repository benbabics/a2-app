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
            beforeEach(function (done) {
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
                it("should set 'cardDetails(/)(:id)' to showCardDetails", function () {
                    expect(appRouter.routes["cardDetails(/)(:id)"]).toEqual("showCardDetails");
                });

                it("should set 'cardSearch' to showCardSearch", function () {
                    expect(appRouter.routes.cardSearch).toEqual("showCardSearch");
                });

                it("should set 'contactUs' to showContactUs", function () {
                    expect(appRouter.routes.contactUs).toEqual("showContactUs");
                });

                it("should set 'driverAdd' to showDriverAdd", function () {
                    expect(appRouter.routes.driverAdd).toEqual("showDriverAdd");
                });

                it("should set 'driverSearch' to showDriverSearch", function () {
                    expect(appRouter.routes.driverSearch).toEqual("showDriverSearch");
                });

                it("should set 'driverDetails(/)(:id)' to showDriverDetails", function () {
                    expect(appRouter.routes["driverDetails(/)(:id)"]).toEqual("showDriverDetails");
                });

                it("should set '*page' to changePage", function () {
                    expect(appRouter.routes["*page"]).toEqual("changePage");
                });

                it("should set an empty string to root", function () {
                    expect(appRouter.routes[""]).toEqual("root");
                });
            });

            describe("has a showCardDetails function that", function () {
                var mockCardNumber = "1234";

                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showCardDetails(mockCardNumber);
                });

                it("is defined", function () {
                    expect(appRouter.showCardDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showCardDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("card");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigateCardDetails");
                    expect(mockFacade.publish.calls.mostRecent().args[2]).toEqual(mockCardNumber);
                });
            });

            describe("has a showCardSearch function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showCardSearch();
                });

                it("is defined", function () {
                    expect(appRouter.showCardSearch).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showCardSearch).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(2);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("card");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigateSearch");
                });
            });

            describe("has a showContactUs function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

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

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(2);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("contactUs");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigate");
                });
            });

            describe("has a showDriverAdd function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showDriverAdd();
                });

                it("is defined", function () {
                    expect(appRouter.showDriverAdd).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showDriverAdd).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(2);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("driver");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigateAdd");
                });
            });

            describe("has a showDriverSearch function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showDriverSearch();
                });

                it("is defined", function () {
                    expect(appRouter.showDriverSearch).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showDriverSearch).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(2);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("driver");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigateSearch");
                });
            });

            describe("has a showDriverDetails function that", function () {
                var mockDriverId = "123";

                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showDriverDetails(mockDriverId);
                });

                it("is defined", function () {
                    expect(appRouter.showDriverDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showDriverDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("driver");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("navigateDriverDetails");
                    expect(mockFacade.publish.calls.mostRecent().args[2]).toEqual(mockDriverId);
                });
            });

            describe("has a changePage function that", function () {
                var pageRequested = "pageRequested";

                beforeEach(function () {
                    spyOn(mockUtils, "changePage").and.callFake(function () { });

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

                    expect(mockUtils.changePage.calls.mostRecent().args.length).toEqual(4);
                    expect(mockUtils.changePage.calls.mostRecent().args[0]).toEqual("#" + pageRequested);
                    expect(mockUtils.changePage.calls.mostRecent().args[1]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[2]).toBeNull();
                    expect(mockUtils.changePage.calls.mostRecent().args[3]).toBeTruthy();
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
                    spyOn(mockBackbone.history, "start").and.callFake(function () { });
                    appRouter.start();

                    expect(mockBackbone.history.start).toHaveBeenCalled();
                });
            });
        });

        return "App Router";
    });
