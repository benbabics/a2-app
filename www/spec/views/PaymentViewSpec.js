define(["backbone", "Squire", "mustache", "globals", "utils", "models/PaymentModel",
        "text!tmpl/payment/payment.html", "jasmine-jquery"],
    function (Backbone, Squire, Mustache, globals, utils, PaymentModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockPaymentModel = {
                "id"                : "13451345",
                "scheduledDate"     : "5/8/2014",
                "amount"            : 24356.56,
                "bankAccount"       : {
                    "id"            : "3465",
                    "name"          : "Bank Name",
                    "defaultBank"   : false
                },
                "status"            : "Status",
                "confirmationNumber": "13451dvfgwdrfg23456"
            },
            paymentModel = new PaymentModel(),
            PaymentView,
            paymentView;

        squire.mock("backbone", Backbone);
        squire.mock("mustache", mockMustache);

        describe("A Payment View", function () {
            beforeEach(function (done) {
                squire.require(["views/PaymentView"], function (JasminePaymentView) {
                    loadFixtures("../../../index.html");

                    paymentModel.initialize(mockPaymentModel);

                    PaymentView = JasminePaymentView;

                    paymentView = new PaymentView({
                        model: paymentModel
                    });

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
                var mockConfiguration;

                beforeEach(function () {
                    mockConfiguration = {
                        payment: utils._.extend({}, utils.deepClone(globals.paymentSearchResults.configuration))
                    };

                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentView, "getConfiguration").and.callFake(function () { return mockConfiguration; });

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
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentView.template, mockConfiguration);
                });

                it("sets content", function () {
                    var expectedContent,
                        actualContent = paymentView.$el;

                    expectedContent = Mustache.render(pageTemplate, mockConfiguration);

                    expect(actualContent[0]).toContainHtml(expectedContent);
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should contain a payment link if the model is set", function () {
                        paymentView.render();

                        expect(paymentView.$el[0]).toContainElement("a");
                    });

                    it("should NOT contain a payment link if the model is not set", function () {
                        mockConfiguration.payment = null;

                        paymentView.render();

                        expect(paymentView.$el[0]).not.toContainElement("a");
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(paymentView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    beforeEach(function () {
                        paymentView.model = null;
                    });

                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                payment : null
                            },
                            actualConfiguration;

                        actualConfiguration = paymentView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when model exists", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                payment: {}
                            },
                            actualConfiguration;

                        expectedConfiguration.payment = utils._.extend({},
                            utils.deepClone(globals.paymentSearchResults.configuration));

                        expectedConfiguration.payment.url.value =
                            globals.paymentSearchResults.constants.PAYMENT_DETAILS_BASE_URL + mockPaymentModel.id;

                        expectedConfiguration.payment.scheduledDate.value = mockPaymentModel.scheduledDate;
                        expectedConfiguration.payment.amount.value = utils.formatCurrency(mockPaymentModel.amount);
                        expectedConfiguration.payment.status.value = mockPaymentModel.status;
                        if (mockPaymentModel.bankAccount) {
                            expectedConfiguration.payment.bankAccountName.value = mockPaymentModel.bankAccount.name;
                        }

                        actualConfiguration = paymentView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });
        });
    });
