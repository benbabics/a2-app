define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            contactUsModel;

        describe("A Contact Us Model", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["models/ContactUsModel"], function (ContactUsModel) {
                    contactUsModel = new ContactUsModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(contactUsModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(contactUsModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set email to default", function () {
                    expect(contactUsModel.defaults.email).toBeNull();
                });

                it("should set subject to default", function () {
                    expect(contactUsModel.defaults.subject).toBeNull();
                });

                it("should set message to default", function () {
                    expect(contactUsModel.defaults.message).toBeNull();
                });
            });

            describe("has property validation that", function () {
            });

            describe("has an initialize function that", function () {
                it("is defined", function () {
                    expect(contactUsModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(contactUsModel.initialize).toEqual(jasmine.any(Function));
                });
            });
        });
    });
