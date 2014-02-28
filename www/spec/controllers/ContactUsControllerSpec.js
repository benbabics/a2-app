define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            contactUsController;

        describe("A Login Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/ContactUsController"], function (ContactUsController) {
                    contactUsController = ContactUsController;
                    contactUsController.init();

                    done();
                });
            });

            it("is defined", function () {
                expect(contactUsController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(contactUsController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(contactUsController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsController.init).toEqual(jasmine.any(Function));
                });
            });
        });
    });