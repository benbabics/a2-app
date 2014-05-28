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
                it("should set 'cardAdd' to showCardAdd", function () {
                    expect(appRouter.routes.cardAdd).toEqual("showCardAdd");
                });

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

                it("should set 'hierarchyManager' to showHierarchyManager", function () {
                    expect(appRouter.routes.hierarchyManager).toEqual("showHierarchyManager");
                });

                it("should set 'invoiceSummary' to showInvoiceSummary", function () {
                    expect(appRouter.routes.invoiceSummary).toEqual("showInvoiceSummary");
                });

                it("should set 'paymentAdd' to showPaymentAdd", function () {
                    expect(appRouter.routes.paymentAdd).toEqual("showPaymentAdd");
                });

                it("should set 'paymentDetails(/)(:id)' to showPaymentDetails", function () {
                    expect(appRouter.routes["paymentDetails(/)(:id)"]).toEqual("showPaymentDetails");
                });

                it("should set 'paymentHistory' to showPaymentHistory", function () {
                    expect(appRouter.routes.paymentHistory).toEqual("showPaymentHistory");
                });

                it("should set '*page' to changePage", function () {
                    expect(appRouter.routes["*page"]).toEqual("changePage");
                });

                it("should set an empty string to root", function () {
                    expect(appRouter.routes[""]).toEqual("root");
                });
            });

            describe("has a showCardAdd function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showCardAdd();
                });

                it("is defined", function () {
                    expect(appRouter.showCardAdd).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showCardAdd).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("card", "navigateAdd");
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
                    expect(mockFacade.publish).toHaveBeenCalledWith("card", "navigateCardDetails", mockCardNumber);
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
                    expect(mockFacade.publish).toHaveBeenCalledWith("card", "navigateSearch");
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
                    expect(mockFacade.publish).toHaveBeenCalledWith("contactUs", "navigate");
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
                    expect(mockFacade.publish).toHaveBeenCalledWith("driver", "navigateAdd");
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
                    expect(mockFacade.publish).toHaveBeenCalledWith("driver", "navigateSearch");
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
                    expect(mockFacade.publish).toHaveBeenCalledWith("driver", "navigateDriverDetails", mockDriverId);
                });
            });

            describe("has a showHierarchyManager function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showHierarchyManager();
                });

                it("is defined", function () {
                    expect(appRouter.showHierarchyManager).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showHierarchyManager).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("hierarchy", "navigate");
                });
            });

            describe("has a showInvoiceSummary function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showInvoiceSummary();
                });

                it("is defined", function () {
                    expect(appRouter.showInvoiceSummary).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showInvoiceSummary).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("invoice", "navigateSummary");
                });
            });

            describe("has a showPaymentAdd function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showPaymentAdd();
                });

                it("is defined", function () {
                    expect(appRouter.showPaymentAdd).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showPaymentAdd).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("invoice", "navigatePaymentAdd");
                });
            });

            describe("has a showPaymentDetails function that", function () {
                var mockPaymentId = "123";

                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showPaymentDetails(mockPaymentId);
                });

                it("is defined", function () {
                    expect(appRouter.showPaymentDetails).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showPaymentDetails).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("invoice", "navigatePaymentDetails", mockPaymentId);
                });
            });

            describe("has a showPaymentHistory function that", function () {
                beforeEach(function () {
                    spyOn(mockFacade, "publish").and.callThrough();

                    appRouter.showPaymentHistory();
                });

                it("is defined", function () {
                    expect(appRouter.showPaymentHistory).toBeDefined();
                });

                it("is a function", function () {
                    expect(appRouter.showPaymentHistory).toEqual(jasmine.any(Function));
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish).toHaveBeenCalledWith("invoice", "navigatePaymentHistory");
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
