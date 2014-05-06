define(["utils", "backbone", "Squire"],
    function (utils, Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            invoiceController;

        describe("An Invoice Controller", function () {
            beforeEach(function (done) {
                squire.require(["controllers/InvoiceController"], function (InvoiceController) {
                    invoiceController = InvoiceController;

                    done();
                });
            });

            it("is defined", function () {
                expect(invoiceController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(invoiceController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(invoiceController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceController.init).toEqual(jasmine.any(Function));
                });
            });
        });
    });
