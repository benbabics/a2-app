define(["Squire", "backbone", "mustache", "globals", "utils", "models/UserModel", "views/BaseView",
        "text!tmpl/payment/paymentDetail.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, UserModel, BaseView, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockMustache = Mustache,
            mockBankAccountModel = {
                "id"            : "3465",
                "name"          : "Bank Name",
                "defaultBank"   : false
            },
            bankAccountModel = new Backbone.Model(),
            mockPaymentModel = {
                "id"                : "13451345",
                "scheduledDate"     : "5/8/2014",
                "amount"            : 24356.56,
                "status"            : "Status",
                "confirmationNumber": "13451dvfgwdrfg23456"
            },
            paymentModel = new Backbone.Model(),
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
                    departments: [
                        {
                            id: "134613456",
                            name: "UNASSIGNED",
                            visible: true
                        },
                        {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            visible: false
                        }
                    ],
                    requiredFields: [
                        "REQUIRED_FIELD_1",
                        "REQUIRED_FIELD_2",
                        "REQUIRED_FIELD_3"
                    ],
                    settings: {
                        cardSettings: {
                            customVehicleIdMaxLength: 17,
                            licensePlateNumberMaxLength: 10,
                            licensePlateStateFixedLength: 2,
                            vehicleDescriptionMaxLength: 17,
                            vinFixedLength: 17
                        },
                        driverSettings: {
                            idFixedLength: 4,
                            firstNameMaxLength: 11,
                            middleNameMaxLength: 1,
                            lastNameMaxLength: 12
                        }
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
            },
            userModel = UserModel.getInstance(),
            paymentDetailView,
            PaymentDetailView;

        squire.mock("mustache", mockMustache);
        squire.mock("backbone", Backbone);
        squire.mock("facade", mockFacade);
        squire.mock("views/BaseView", BaseView);

        describe("A Payment Detail View", function () {
            beforeEach(function (done) {
                squire.require(["views/PaymentDetailView"], function (JasminePaymentDetailView) {
                    loadFixtures("../../../index.html");

                    bankAccountModel.set(mockBankAccountModel);
                    paymentModel.set(mockPaymentModel);
                    paymentModel.set("bankAccount", bankAccountModel);
                    userModel.initialize(mockUserModel);

                    PaymentDetailView = JasminePaymentDetailView;
                    paymentDetailView = new PaymentDetailView({
                        model    : paymentModel,
                        userModel: userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentDetailView).toBeDefined();
            });

            it("looks like a BaseView", function () {
                expect(paymentDetailView instanceof BaseView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call handleEditPaymentClick when submitEditPayment-btn is clicked", function () {
                    expect(paymentDetailView.events["click #submitEditPayment-btn"]).toEqual("handleEditPaymentClick");
                });

                it("should call handleCancelPaymentClick when submitCancelPayment-btn is clicked", function () {
                    expect(paymentDetailView.events["click #submitCancelPayment-btn"])
                        .toEqual("handleCancelPaymentClick");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentDetailView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(paymentDetailView.el).toEqual("#paymentDetails");
                });

                it("should set el nodeName", function () {
                    expect(paymentDetailView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(paymentDetailView.template).toEqual(pageTemplate);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    mockConfiguration;

                beforeEach(function () {
                    mockConfiguration = {
                        "payment"    : utils._.extend({}, utils.deepClone(globals.paymentDetails.configuration)),
                        "permissions": userModel.get("selectedCompany").get("permissions")
                    };

                    actualContent = paymentDetailView.$el.find(":jqmData(role=content)");

                    spyOn(paymentDetailView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(paymentDetailView.$el, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentDetailView, "getConfiguration").and
                        .callFake(function () { return mockConfiguration; });

                    paymentDetailView.render();
                });

                it("is defined", function () {
                    expect(paymentDetailView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration", function () {
                    expect(paymentDetailView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentDetailView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the $el", function () {
                    expect(paymentDetailView.$el.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should contain content if the model is set", function () {
                        paymentDetailView.render();

                        expect(actualContent[0]).not.toBeEmpty();
                    });

                    it("should NOT contain any content if the model is not set", function () {
                        mockConfiguration.payment = null;

                        paymentDetailView.render();

                        expect(actualContent[0]).toBeEmpty();
                    });

                    describe("when the user has the MOBILE_PAYMENT_MAKE permission", function () {
                        beforeEach(function () {
                            userModel.get("selectedCompany").set("permissions", {"MOBILE_PAYMENT_MAKE": true});
                            mockConfiguration.permissions = userModel.get("selectedCompany").get("permissions");
                        });

                        it("should include a button to edit payment when it's configured to be visible",
                            function () {
                                mockConfiguration.payment.editButton.visible = true;
                                paymentDetailView.render();

                                expect(actualContent[0]).toContainElement("button[id='submitEditPayment-btn']");
                            });

                        it("should NOT include a button to edit payment when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.payment.editButton.visible = false;
                                paymentDetailView.render();

                                expect(actualContent[0]).not.toContainElement("button[id='submitEditPayment-btn']");
                            });

                        it("should include a button to cancel payment when it's configured to be visible",
                            function () {
                                mockConfiguration.payment.cancelButton.visible = true;
                                paymentDetailView.render();

                                expect(actualContent[0]).toContainElement("button[id='submitCancelPayment-btn']");
                            });

                        it("should NOT include a button to cancel payment when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.payment.cancelButton.visible = false;
                                paymentDetailView.render();

                                expect(actualContent[0]).not.toContainElement("button[id='submitCancelPayment-btn']");
                            });
                    });

                    describe("when the user does NOT have the MOBILE_PAYMENT_MAKE permission", function () {
                        beforeEach(function () {
                            userModel.get("selectedCompany").set("permissions", {"MOBILE_PAYMENT_MAKE": false});
                            mockConfiguration.permissions = userModel.get("selectedCompany").get("permissions");
                        });

                        it("should NOT include a button to edit payment when it's configured to be visible",
                            function () {
                                mockConfiguration.payment.editButton.visible = true;
                                paymentDetailView.render();

                                expect(actualContent[0]).not.toContainElement("button[id='submitEditPayment-btn']");
                            });

                        it("should NOT include a button to edit payment when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.payment.editButton.visible = false;
                                paymentDetailView.render();

                                expect(actualContent[0]).not.toContainElement("button[id='submitEditPayment-btn']");
                            });

                        it("should NOT include a button to cancel payment when it's configured to be visible",
                            function () {
                                mockConfiguration.payment.cancelButton.visible = true;
                                paymentDetailView.render();

                                expect(actualContent[0]).not.toContainElement("button[id='submitCancelPayment-btn']");
                            });

                        it("should NOT include a button to cancel payment when it's NOT configured to be visible",
                            function () {
                                mockConfiguration.payment.cancelButton.visible = false;
                                paymentDetailView.render();

                                expect(actualContent[0]).not.toContainElement("button[id='submitCancelPayment-btn']");
                            });
                    });
                });
            });
            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(paymentDetailView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when model is null", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "payment"    : null,
                                "permissions": null
                            },
                            actualConfiguration;

                        expectedConfiguration.permissions = userModel.get("selectedCompany").get("permissions");
                        paymentDetailView.model = null;

                        actualConfiguration = paymentDetailView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the card status is 'SCHEDULED'", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "payment"    : null,
                                "permissions": null
                            },
                            actualConfiguration,
                            paymentModelJSON;

                        paymentModel.set("status", globals.payment.constants.STATUS_SCHEDULED);

                        paymentModelJSON = paymentModel.toJSON();

                        expectedConfiguration.payment = utils._
                            .extend({}, utils.deepClone(globals.paymentDetails.configuration));

                        // populate configuration details
                        expectedConfiguration.payment.scheduledDate.value = paymentModelJSON.scheduledDate;
                        expectedConfiguration.payment.amount.value = utils.formatCurrency(paymentModelJSON.amount);
                        if (paymentModelJSON.bankAccount) {
                            expectedConfiguration.payment.bankAccountName.value = paymentModelJSON.bankAccount.name;
                        }
                        expectedConfiguration.payment.status.value = paymentModelJSON.status;
                        expectedConfiguration.payment.confirmationNumber.value = paymentModelJSON.confirmationNumber;

                        expectedConfiguration.payment.editButton.visible = true;
                        expectedConfiguration.payment.cancelButton.visible = true;

                        expectedConfiguration.permissions = userModel.get("selectedCompany").get("permissions");

                        actualConfiguration = paymentDetailView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the card status is NOT 'SCHEDULED'", function () {
                    it("should return the expected result", function () {
                        var expectedConfiguration = {
                                "payment"    : null,
                                "permissions": null
                            },
                            actualConfiguration,
                            paymentModelJSON;

                        paymentModel.set("status", "PENDING");

                        paymentModelJSON = paymentModel.toJSON();

                        expectedConfiguration.payment = utils._
                            .extend({}, utils.deepClone(globals.paymentDetails.configuration));

                        // populate configuration details
                        expectedConfiguration.payment.scheduledDate.value = paymentModelJSON.scheduledDate;
                        expectedConfiguration.payment.amount.value = utils.formatCurrency(paymentModelJSON.amount);
                        if (paymentModelJSON.bankAccount) {
                            expectedConfiguration.payment.bankAccountName.value = paymentModelJSON.bankAccount.name;
                        }
                        expectedConfiguration.payment.status.value = paymentModelJSON.status;
                        expectedConfiguration.payment.confirmationNumber.value = paymentModelJSON.confirmationNumber;

                        expectedConfiguration.payment.editButton.visible = false;
                        expectedConfiguration.payment.cancelButton.visible = false;

                        expectedConfiguration.permissions = userModel.get("selectedCompany").get("permissions");

                        actualConfiguration = paymentDetailView.getConfiguration();

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });

            describe("has a cancelPayment function that", function () {
                var eventToTrigger = "mock event";

                beforeEach(function () {
                    spyOn(paymentDetailView.model, "destroy").and.callFake(function () {});

                    paymentDetailView.cancelPayment(eventToTrigger);
                });

                it("is defined", function () {
                    expect(paymentDetailView.cancelPayment).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.cancelPayment).toEqual(jasmine.any(Function));
                });

                describe("when calling destroy() on the payment model", function () {
                    it("should send 1 argument", function () {
                        expect(paymentDetailView.model.destroy).toHaveBeenCalled();
                        expect(paymentDetailView.model.destroy.calls.mostRecent().args.length).toEqual(1);
                    });

                    describe("sends as the first argument the options object with a success callback that",
                        function () {
                            var response = {
                                    message: "Response Message"
                                },
                                model,
                                options;

                            beforeEach(function () {
                                spyOn(paymentDetailView, "trigger").and.callFake(function () { });

                                options = paymentDetailView.model.destroy.calls.mostRecent().args[0];
                                options.success.call(paymentDetailView, model, response);
                            });

                            it("should call trigger", function () {
                                expect(paymentDetailView.trigger)
                                    .toHaveBeenCalledWith(eventToTrigger, response.message);
                            });
                        });
                });
            });

            describe("has a handleCancelPaymentClick function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(mockFacade, "publish").and.callThrough();

                    paymentDetailView.handleCancelPaymentClick(mockEvent);
                });

                it("is defined", function () {
                    expect(paymentDetailView.handleCancelPaymentClick).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.handleCancelPaymentClick).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call publish on the facade", function () {
                    var appAlertOptions;

                    expect(mockFacade.publish).toHaveBeenCalled();

                    expect(mockFacade.publish.calls.mostRecent().args.length).toEqual(3);
                    expect(mockFacade.publish.calls.mostRecent().args[0]).toEqual("app");
                    expect(mockFacade.publish.calls.mostRecent().args[1]).toEqual("alert");

                    appAlertOptions = mockFacade.publish.calls.mostRecent().args[2];
                    expect(appAlertOptions.title).toEqual(globals.paymentCancel.constants.CONFIRMATION_TITLE);
                    expect(appAlertOptions.message).toEqual(globals.paymentCancel.constants.CONFIRMATION_MESSAGE);
                    expect(appAlertOptions.primaryBtnLabel).toEqual(globals.paymentCancel.constants.OK_BTN_TEXT);
                    expect(appAlertOptions.primaryBtnHandler).toEqual(jasmine.any(Function));
                    expect(appAlertOptions.secondaryBtnLabel).toEqual(globals.paymentCancel.constants.CANCEL_BTN_TEXT);
                });

                describe("sends as the primaryBtnHandler argument a callback that", function () {
                    var options;

                    beforeEach(function () {
                        options = mockFacade.publish.calls.mostRecent().args[2];

                        spyOn(paymentDetailView, "cancelPayment").and.callFake(function () { });

                        options.primaryBtnHandler.call(paymentDetailView);
                    });

                    it("should call cancelPayment", function () {
                        expect(paymentDetailView.cancelPayment).toHaveBeenCalledWith("cancelPaymentSuccess");
                    });
                });
            });

            describe("has a handleEditPaymentClick function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(mockFacade, "publish").and.callFake(function () {});

                    paymentDetailView.handleEditPaymentClick(mockEvent);
                });

                it("is defined", function () {
                    expect(paymentDetailView.handleEditPaymentClick).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentDetailView.handleEditPaymentClick).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                it("should call publish on the facade", function () {
                    expect(mockFacade.publish)
                        .toHaveBeenCalledWith("invoice", "navigatePaymentEdit", mockPaymentModel.id);
                });
            });
        });
    });
