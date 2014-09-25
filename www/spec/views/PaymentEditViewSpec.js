define(["Squire", "backbone", "mustache", "globals", "utils", "models/PaymentModel", "models/UserModel",
        "views/ValidationFormView", "text!tmpl/payment/paymentEdit.html",
        "text!tmpl/payment/paymentChangeDetails.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, PaymentModel, UserModel, ValidationFormView,
              pageTemplate, paymentChangeDetailsTemplate) {

        "use strict";

        var squire = new Squire(),
            mockMustache = Mustache,
            mockUtils = utils,
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
                    bankAccounts: [
                        {
                            id: "134613456",
                            name: "UNASSIGNED",
                            defaultBank: true
                        },
                        {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            defaultBank: false
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
            mockInvoiceSummaryModel = {
                "invoiceId"         : "14352456",
                "accountNumber"     : "adfrgw96fg",
                "availableCredit"   : 23456134.45,
                "currentBalance"    : 2345245.64,
                "currentBalanceAsOf": "Current Balance As Of 05/15/2014",
                "paymentDueDate"    : "05/17/2014",
                "minimumPaymentDue" : 345.45,
                "invoiceNumber"     : "q34v51",
                "closingDate"       : "05/31/2014"
            },
            invoiceSummaryModel = new Backbone.Model(),
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
                "confirmationNumber": "13451dvfgwdrfg23456",
                "paymentDueDate"    : "5/14/2014",
                "minimumPaymentDue" : 234.45
            },
            paymentModel = new PaymentModel(),
            userModel = UserModel.getInstance(),
            paymentEditView,
            PaymentEditView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);
        squire.mock("views/ValidationFormView", ValidationFormView);

        describe("A Payment Edit View", function () {
            beforeEach(function (done) {
                squire.require(["views/PaymentEditView"], function (JasminePaymentEditView) {
                    var bankAccounts = new Backbone.Collection();

                    loadFixtures("../../../index.html");

                    invoiceSummaryModel.set(mockInvoiceSummaryModel);
                    paymentModel.initialize(mockPaymentModel);
                    userModel.initialize(mockUserModel);

                    bankAccounts.set(mockUserModel.selectedCompany.bankAccounts);
                    userModel.get("selectedCompany").set("bankAccounts", bankAccounts);

                    PaymentEditView = JasminePaymentEditView;
                    paymentEditView = new PaymentEditView({
                        model              : paymentModel,
                        invoiceSummaryModel: invoiceSummaryModel,
                        userModel          : userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentEditView).toBeDefined();
            });

            it("looks like a ValidationFormView", function () {
                expect(paymentEditView instanceof ValidationFormView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitPaymentEdit-btn is clicked", function () {
                    expect(paymentEditView.events["click #submitPaymentEdit-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when paymentEditForm is submitted", function () {
                    expect(paymentEditView.events["submit #paymentEditForm"]).toEqual("submitForm");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentEditView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(paymentEditView.el).toEqual("#paymentEdit");
                });

                it("should set el nodeName", function () {
                    expect(paymentEditView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(paymentEditView.template).toEqual(pageTemplate);
                });

                it("should set the editDetailsTemplate", function () {
                    expect(paymentEditView.editDetailsTemplate).toEqual(paymentChangeDetailsTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(PaymentEditView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    paymentEditView.initialize();
                });

                it("is defined", function () {
                    expect(paymentEditView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(PaymentEditView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the editDetailsTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(paymentEditView.editDetailsTemplate);
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll).toHaveBeenCalledWith(paymentEditView, "savePayment");
                });

                it("should set invoiceSummaryModel", function () {
                    expect(paymentEditView.invoiceSummaryModel).toEqual(invoiceSummaryModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    mockConfiguration = {
                        "payment": null
                    };

                beforeEach(function () {
                    mockConfiguration.payment = utils._.extend({}, utils.deepClone(globals.paymentEdit.configuration));

                    actualContent = paymentEditView.$el.find(".ui-content");
                    spyOn(paymentEditView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(paymentEditView, "updateModelFromSummary").and.callFake(function () { });
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentEditView, "getConfiguration").and.returnValue(mockConfiguration);
                    spyOn(paymentEditView, "setupDatepicker").and.callFake(function () { });
                    spyOn(paymentEditView, "formatRequiredFields").and.callThrough();

                    paymentEditView.render();
                });

                it("is defined", function () {
                    expect(paymentEditView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.render).toEqual(jasmine.any(Function));
                });

                it("should call updateModelFromSummary", function () {
                    expect(paymentEditView.updateModelFromSummary).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentEditView.template, mockConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, mockConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call setupDatepicker()", function () {
                    expect(paymentEditView.setupDatepicker).toHaveBeenCalledWith();
                });

                it("should call formatRequiredFields()", function () {
                    expect(paymentEditView.formatRequiredFields).toHaveBeenCalledWith();
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    it("should contain content if the model is set", function () {
                        paymentEditView.render();

                        expect(actualContent[0]).not.toBeEmpty();
                    });

                    it("should NOT contain any content if the model is not set", function () {
                        mockConfiguration.payment = null;

                        paymentEditView.render();

                        expect(actualContent[0]).toBeEmpty();
                    });
                });
            });

            describe("has a setupDatepicker function that", function () {
                var actualDatepicker,
                    minimumDate = utils.moment();

                beforeEach(function () {
                    actualDatepicker = paymentEditView.$el.find("#scheduledDate");

                    spyOn(paymentEditView, "getEarlistPaymentDate").and.returnValue(minimumDate);
                    spyOn(paymentEditView.$el, "find").and.returnValue(actualDatepicker);
                    spyOn(actualDatepicker, "date").and.callFake(function () {});

                    paymentEditView.setupDatepicker();
                });

                it("is defined", function () {
                    expect(paymentEditView.setupDatepicker).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.setupDatepicker).toEqual(jasmine.any(Function));
                });

                it("should call getEarlistPaymentDate", function () {
                    expect(paymentEditView.getEarlistPaymentDate).toHaveBeenCalledWith();
                });

                it("should call find of $el", function () {
                    expect(paymentEditView.$el.find).toHaveBeenCalledWith("#scheduledDateEdit");
                });

                it("should call date on the datepicker", function () {
                    expect(actualDatepicker.date).toHaveBeenCalledWith({
                        minDate: minimumDate.toDate(),
                        beforeShowDay: utils.$.datepicker.noWeekends
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                var actualConfiguration;

                beforeEach(function () {
                    actualConfiguration = paymentEditView.getConfiguration();
                });

                it("is defined", function () {
                    expect(paymentEditView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.getConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration = {
                            "payment": null
                        },
                        bankAccountListValues = [];

                    expectedConfiguration.payment =
                        utils._.extend({}, utils.deepClone(globals.paymentEdit.configuration));

                    utils._.each(mockUserModel.selectedCompany.bankAccounts, function (bankAccount) {
                        bankAccountListValues.push({
                            "id"      : bankAccount.id,
                            "name"    : bankAccount.name,
                            "selected": bankAccount.id === mockPaymentModel.bankAccount.id
                        });
                    });

                    expectedConfiguration.payment.scheduledDate.value = mockPaymentModel.scheduledDate;
                    expectedConfiguration.payment.amount.value = mockPaymentModel.amount;

                    expectedConfiguration.payment.bankAccount.enabled = bankAccountListValues.length > 1;
                    expectedConfiguration.payment.bankAccount.values = bankAccountListValues;

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has a getEditDetailsConfiguration function that", function () {
                it("is defined", function () {
                    expect(paymentEditView.getEditDetailsConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.getEditDetailsConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration = {
                            "message": null,
                            "payment": null
                        },
                        actualConfiguration,
                        editPaymentResponse = {
                            "message"           : "Mock Message",
                            "scheduledDate"     : "05/15/2014",
                            "amount"            : 367.34,
                            "bankAccount"       : {
                                id              : "134613456",
                                name            : "UNASSIGNED",
                                defaultBank     : true
                            },
                            "confirmationNumber": "5b634b62567"
                        };

                    expectedConfiguration.message = editPaymentResponse.message;

                    expectedConfiguration.payment = utils._.extend({},
                        utils.deepClone(globals.paymentChangedDetails.configuration));

                    expectedConfiguration.payment.scheduledDate.value = editPaymentResponse.scheduledDate;
                    expectedConfiguration.payment.amount.value = utils.formatCurrency(editPaymentResponse.amount);
                    expectedConfiguration.payment.bankAccountName.value = editPaymentResponse.bankAccount.name;
                    expectedConfiguration.payment.confirmationNumber.value = editPaymentResponse.confirmationNumber;

                    actualConfiguration = paymentEditView.getEditDetailsConfiguration(editPaymentResponse);

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has an updateModelFromSummary function that", function () {
                beforeEach(function () {
                    spyOn(paymentEditView.model, "set").and.callFake(function () {});

                    paymentEditView.updateModelFromSummary();
                });

                it("is defined", function () {
                    expect(paymentEditView.updateModelFromSummary).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.updateModelFromSummary).toEqual(jasmine.any(Function));
                });

                it("should set paymentDueDate on the model", function () {
                    expect(paymentEditView.model.set)
                        .toHaveBeenCalledWith("paymentDueDate", mockInvoiceSummaryModel.paymentDueDate);
                });

                it("should set minimumPaymentDue on the model", function () {
                    expect(paymentEditView.model.set)
                        .toHaveBeenCalledWith("minimumPaymentDue", mockInvoiceSummaryModel.minimumPaymentDue);
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(paymentEditView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.handleInputChanged).toEqual(jasmine.any(Function));
                });

                describe("when the target name is bankAccount", function () {
                    var mockEvent = {
                            "target"    : {
                                "name"  : "bankAccount",
                                "value" : "mock bank account id"
                            }
                        },
                        mockBankAccount = {
                            id: "134613456",
                            name: "UNASSIGNED",
                            defaultBank: true
                        };

                    beforeEach(function () {
                        spyOn(paymentEditView, "findBankAccount").and.returnValue(mockBankAccount);
                        spyOn(paymentEditView, "updateAttribute").and.callFake(function () {});

                        paymentEditView.handleInputChanged(mockEvent);
                    });

                    it("should call findBankAccount", function () {
                        expect(paymentEditView.findBankAccount).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(paymentEditView.updateAttribute).toHaveBeenCalledWith("bankAccount", mockBankAccount);
                    });
                });

                describe("when the target name is NOT bankAccount", function () {
                    var mockEvent = {
                        "target"            : {
                            "name"  : "target_name",
                            "value" : "target_value"
                        }
                    };

                    beforeEach(function () {
                        spyOn(paymentEditView, "findBankAccount").and.returnValue();
                        spyOn(PaymentEditView.__super__, "handleInputChanged").and.callThrough();

                        paymentEditView.handleInputChanged(mockEvent);
                    });

                    it("should NOT call findBankAccount", function () {
                        expect(paymentEditView.findBankAccount).not.toHaveBeenCalled();
                    });

                    it("should call updateAttribute on super", function () {
                        expect(PaymentEditView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });

            describe("has a savePayment function that", function () {
                beforeEach(function () {
                    spyOn(paymentModel, "edit").and.callFake(function () { });
                    paymentEditView.savePayment();
                });

                it("is defined", function () {
                    expect(paymentEditView.savePayment).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.savePayment).toEqual(jasmine.any(Function));
                });

                describe("when calling edit() on the model", function () {
                    var mockEditDetailsConfiguration = utils._.extend({},
                        utils.deepClone(globals.paymentChangedDetails.configuration));

                    it("should send 1 argument", function () {
                        expect(paymentModel.edit).toHaveBeenCalled();
                        expect(paymentModel.edit.calls.mostRecent().args.length).toEqual(1);
                    });

                    describe("sends as the first argument the options object with a success callback that",
                        function () {
                            var response = {},
                                model,
                                options,
                                mockMustacheRenderReturnValue = "Render return value";

                            beforeEach(function () {
                                spyOn(mockMustache, "render").and.returnValue(mockMustacheRenderReturnValue);
                                spyOn(paymentEditView, "getEditDetailsConfiguration").and
                                    .returnValue(mockEditDetailsConfiguration);
                                spyOn(paymentEditView, "trigger").and.callFake(function () { });

                                options = paymentModel.edit.calls.mostRecent().args[0];
                                options.success.call(paymentEditView, model, response);
                            });

                            it("should call getEditDetailsConfiguration", function () {
                                expect(paymentEditView.getEditDetailsConfiguration).toHaveBeenCalledWith(response);
                            });

                            it("should call Mustache.render() on the editDetailsTemplate", function () {
                                expect(mockMustache.render).toHaveBeenCalledWith(paymentEditView.editDetailsTemplate,
                                    mockEditDetailsConfiguration);
                            });

                            it("should trigger paymentEditSuccess", function () {
                                expect(paymentEditView.trigger)
                                    .toHaveBeenCalledWith("paymentEditSuccess", mockMustacheRenderReturnValue);
                            });
                        });
                });
            });

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();

                    paymentEditView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(paymentEditView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call event.preventDefault", function () {
                    expect(mockEvent.preventDefault).toHaveBeenCalledWith();
                });

                describe("when validate returns errors", function () {
                    var mockErrors = [
                        {
                            error: "asdfgasdf"
                        }
                    ];

                    beforeEach(function () {
                        spyOn(paymentModel, "validate").and.returnValue(mockErrors);
                        spyOn(paymentEditView, "handleValidationError").and.callFake(function () {});
                        spyOn(paymentModel, "validateWarnings").and.returnValue();
                        spyOn(paymentEditView, "handleValidationWarning").and.callFake(function () {});
                        spyOn(paymentEditView, "savePayment").and.callFake(function () { });

                        paymentEditView.submitForm(mockEvent);
                    });

                    it("should call validate on the PaymentModel", function () {
                        expect(paymentModel.validate).toHaveBeenCalledWith();
                    });

                    it("should call handleValidationError", function () {
                        expect(paymentEditView.handleValidationError).toHaveBeenCalledWith(paymentModel, mockErrors);
                    });

                    it("should NOT call validateWarnings on the PaymentModel", function () {
                        expect(paymentModel.validateWarnings).not.toHaveBeenCalled();
                    });

                    it("should NOT call handleValidationWarning", function () {
                        expect(paymentEditView.handleValidationWarning).not.toHaveBeenCalled();
                    });

                    it("should NOT call savePayment", function () {
                        expect(paymentEditView.savePayment).not.toHaveBeenCalled();
                    });
                });

                describe("when validate does NOT return errors", function () {
                    beforeEach(function () {
                        spyOn(paymentModel, "validate").and.returnValue();
                        spyOn(paymentEditView, "handleValidationError").and.callFake(function () {});
                    });

                    describe("when validateWarnings returns warnings", function () {
                        var mockWarnings = [
                            {
                                warning: "asdfgasdf"
                            }
                        ];

                        beforeEach(function () {
                            spyOn(paymentModel, "validateWarnings").and.returnValue(mockWarnings);
                            spyOn(paymentEditView, "handleValidationWarning").and.callFake(function () {});
                            spyOn(paymentEditView, "savePayment").and.callFake(function () { });

                            paymentEditView.submitForm(mockEvent);
                        });

                        it("should call validate on the PaymentModel", function () {
                            expect(paymentModel.validate).toHaveBeenCalledWith();
                        });

                        it("should NOT call handleValidationError", function () {
                            expect(paymentEditView.handleValidationError).not.toHaveBeenCalled();
                        });

                        it("should call validateWarnings on the PaymentModel", function () {
                            expect(paymentModel.validateWarnings).toHaveBeenCalled();
                        });

                        it("should call handleValidationWarning", function () {
                            expect(paymentEditView.handleValidationWarning).
                                toHaveBeenCalledWith(paymentModel, mockWarnings, paymentEditView.savePayment);
                        });

                        it("should NOT call savePayment", function () {
                            expect(paymentEditView.savePayment).not.toHaveBeenCalled();
                        });
                    });

                    describe("when validateWarnings does NOT return warnings", function () {
                        beforeEach(function () {
                            spyOn(paymentModel, "validateWarnings").and.returnValue();
                            spyOn(paymentEditView, "handleValidationWarning").and.callFake(function () {});
                            spyOn(paymentEditView, "savePayment").and.callFake(function () { });

                            paymentEditView.submitForm(mockEvent);
                        });

                        it("should call validate on the PaymentModel", function () {
                            expect(paymentModel.validate).toHaveBeenCalledWith();
                        });

                        it("should NOT call handleValidationError", function () {
                            expect(paymentEditView.handleValidationError).not.toHaveBeenCalled();
                        });

                        it("should call validateWarnings on the PaymentModel", function () {
                            expect(paymentModel.validateWarnings).toHaveBeenCalled();
                        });

                        it("should NOT call handleValidationWarning", function () {
                            expect(paymentEditView.handleValidationWarning).not.toHaveBeenCalled();
                        });

                        it("should call savePayment", function () {
                            expect(paymentEditView.savePayment).toHaveBeenCalledWith();
                        });
                    });
                });
            });
        });
    });
