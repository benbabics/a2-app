define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockInvoiceController = {
                init: function () {}
            },
            invoiceSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/InvoiceController", mockInvoiceController);

        describe("An Invoice Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/invoice"], function (jasmineInvoiceSubscriber) {
                    invoiceSubscriber = jasmineInvoiceSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(invoiceSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalledWith("invoice", mockInvoiceController);
            });

            it("should call subscribe 1 time", function () {
                expect(mockSubscribe.calls.count()).toEqual(1);
            });

            it("should subscribe to navigateSummary", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigateSummary", "navigateSummary");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockInvoiceController, "init").and.callThrough();
                    invoiceSubscriber.init();
                });

                it("is defined", function () {
                    expect(invoiceSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockInvoiceController.init).toHaveBeenCalledWith();
                });
            });
        });
    });
