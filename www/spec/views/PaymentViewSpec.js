define(["backbone", "Squire", "mustache", "globals", "utils",
        "text!tmpl/payment/payment.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            PaymentView,
            paymentView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);

        describe("A Payment View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/PaymentView"], function (JasminePaymentView) {
                    //TODO - Fix - Loading fixtures causes phantomjs to hang
                    if (window._phantom === undefined) {
                        loadFixtures("index.html");
                    }

                    PaymentView = JasminePaymentView;

                    paymentView = new PaymentView();

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(paymentView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el nodeName", function () {
                    expect(paymentView.el.nodeName).toEqual("LI");
                });

                it("should set the template", function () {
                    expect(paymentView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(PaymentView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockMustache, "parse").and.callThrough();

                    paymentView.initialize();
                });

                it("is defined", function () {
                    expect(paymentView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(PaymentView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(paymentView.template);
                });
            });

            describe("has a render function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "render").and.callThrough();

                    paymentView.initialize();
                    paymentView.render();
                });

                it("is defined", function () {
                    expect(paymentView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentView.template);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = paymentView.$el;

                    expectedContent = Mustache.render(pageTemplate);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });
            });
        });
    });
