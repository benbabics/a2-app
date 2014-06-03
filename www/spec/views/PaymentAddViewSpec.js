define(["Squire", "backbone", "mustache", "globals", "utils", "models/PaymentModel", "models/UserModel",
        "views/ValidationFormView", "text!tmpl/payment/paymentAdd.html", "text!tmpl/payment/paymentChangeDetails.html",
        "jasmine-jquery"],
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
                "scheduledDate"     : "5/8/2014",
                "amount"            : 24356.56
            },
            paymentModel = new PaymentModel(),
            userModel = UserModel.getInstance(),
            paymentAddView,
            PaymentAddView;

        squire.mock("mustache", mockMustache);
        squire.mock("utils", mockUtils);
        squire.mock("backbone", Backbone);
        squire.mock("views/ValidationFormView", ValidationFormView);

        describe("A Payment Add View", function () {
            beforeEach(function (done) {
                squire.require(["views/PaymentAddView"], function (JasminePaymentAddView) {
                    var bankAccounts = new Backbone.Collection();

                    loadFixtures("../../../index.html");

                    invoiceSummaryModel.set(mockInvoiceSummaryModel);
                    paymentModel.initialize(mockPaymentModel);
                    userModel.parse(mockUserModel);

                    bankAccounts.set(mockUserModel.selectedCompany.bankAccounts);
                    userModel.get("selectedCompany").set("bankAccounts", bankAccounts);

                    PaymentAddView = JasminePaymentAddView;
                    paymentAddView = new PaymentAddView({
                        model              : paymentModel,
                        invoiceSummaryModel: invoiceSummaryModel,
                        userModel          : userModel
                    });

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentAddView).toBeDefined();
            });

            it("looks like a ValidationFormView", function () {
                expect(paymentAddView instanceof ValidationFormView).toBeTruthy();
            });

            describe("has events that", function () {
                it("should call submitForm when submitPaymentAdd-btn is clicked", function () {
                    expect(paymentAddView.events["click #submitPaymentAdd-btn"]).toEqual("submitForm");
                });

                it("should call submitForm when paymentAddForm is submitted", function () {
                    expect(paymentAddView.events["submit #paymentAddForm"]).toEqual("submitForm");
                });
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentAddView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(paymentAddView.el).toEqual("#paymentAdd");
                });

                it("should set el nodeName", function () {
                    expect(paymentAddView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(paymentAddView.template).toEqual(pageTemplate);
                });

                it("should set the addDetailsTemplate", function () {
                    expect(paymentAddView.addDetailsTemplate).toEqual(paymentChangeDetailsTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(paymentAddView.$el, "on").and.callFake(function () {});
                    spyOn(PaymentAddView.__super__, "initialize").and.callFake(function () {});
                    spyOn(mockUtils._, "bindAll").and.callFake(function () { });

                    paymentAddView.initialize();
                });

                it("is defined", function () {
                    expect(paymentAddView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super()", function () {
                    expect(PaymentAddView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the addDetailsTemplate", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(paymentAddView.addDetailsTemplate);
                });

                it("should call utils._.bindAll", function () {
                    expect(mockUtils._.bindAll)
                        .toHaveBeenCalledWith(paymentAddView, "handlePageBeforeShow", "savePayment");
                });

                it("should set invoiceSummaryModel", function () {
                    expect(paymentAddView.invoiceSummaryModel).toEqual(invoiceSummaryModel);
                });

                it("should call on() on $el", function () {
                    expect(paymentAddView.$el.on)
                        .toHaveBeenCalledWith("pagebeforeshow", paymentAddView.handlePageBeforeShow);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = utils._.extend({}, utils.deepClone(globals.paymentAdd.configuration));

                    actualContent = paymentAddView.$el.find(":jqmData(role=content)");
                    spyOn(paymentAddView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(paymentAddView, "resetModel").and.callFake(function () { });
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentAddView, "getConfiguration").and.returnValue(expectedConfiguration);
                    spyOn(paymentAddView, "setupDatepicker").and.callFake(function () { });
                    spyOn(paymentAddView, "formatRequiredFields").and.callThrough();

                    paymentAddView.render();
                });

                it("is defined", function () {
                    expect(paymentAddView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.render).toEqual(jasmine.any(Function));
                });

                it("should call resetModel", function () {
                    expect(paymentAddView.resetModel).toHaveBeenCalledWith();
                });

                it("should call getConfiguration", function () {
                    expect(paymentAddView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentAddView.template, expectedConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, expectedConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call setupDatepicker()", function () {
                    expect(paymentAddView.setupDatepicker).toHaveBeenCalledWith();
                });

                it("should call formatRequiredFields()", function () {
                    expect(paymentAddView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });

            describe("has a setupDatepicker function that", function () {
                var actualDatepicker,
                    minimumDate = utils.moment();

                beforeEach(function () {
                    actualDatepicker = paymentAddView.$el.find("#scheduledDate");

                    spyOn(paymentAddView, "getEarlistPaymentDate").and.returnValue(minimumDate);
                    spyOn(paymentAddView.$el, "find").and.returnValue(actualDatepicker);
                    spyOn(actualDatepicker, "date").and.callFake(function () {});

                    paymentAddView.setupDatepicker();
                });

                it("is defined", function () {
                    expect(paymentAddView.setupDatepicker).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.setupDatepicker).toEqual(jasmine.any(Function));
                });

                it("should call getEarlistPaymentDate", function () {
                    expect(paymentAddView.getEarlistPaymentDate).toHaveBeenCalledWith();
                });

                it("should call find of $el", function () {
                    expect(paymentAddView.$el.find).toHaveBeenCalledWith("#scheduledDate");
                });

                it("should call date on the datepicker", function () {
                    expect(actualDatepicker.date).toHaveBeenCalledWith({
                        minDate: minimumDate.toDate(),
                        beforeShowDay: utils.$.datepicker.noWeekends
                    });
                });
            });

            describe("has a getConfiguration function that", function () {
                var defaultPaymentDate = utils.moment(),
                    actualConfiguration;

                beforeEach(function () {
                    spyOn(paymentAddView, "getEarlistPaymentDate").and.returnValue(defaultPaymentDate);

                    actualConfiguration = paymentAddView.getConfiguration();
                });

                it("is defined", function () {
                    expect(paymentAddView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.getConfiguration).toEqual(jasmine.any(Function));
                });

                it("should call getEarlistPaymentDate()", function () {
                    expect(paymentAddView.getEarlistPaymentDate).toHaveBeenCalledWith();
                });

                it("should return the expected result", function () {
                    var expectedConfiguration,
                        bankAccountListValues = [];

                    expectedConfiguration = utils._.extend({}, utils.deepClone(globals.paymentAdd.configuration));

                    utils._.each(mockUserModel.selectedCompany.bankAccounts, function (bankAccount) {
                        bankAccountListValues.push({
                            "id"      : bankAccount.id,
                            "name"    : bankAccount.name,
                            "selected": bankAccount.defaultBank
                        });
                    });

                    expectedConfiguration.scheduledDate.value = mockPaymentModel.scheduledDate;
                    expectedConfiguration.scheduledDate.minValue = defaultPaymentDate.toDate();
                    expectedConfiguration.amount.value = mockPaymentModel.amount;

                    expectedConfiguration.bankAccount.enabled = bankAccountListValues.length > 1;
                    expectedConfiguration.bankAccount.values = bankAccountListValues;

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has a getAddDetailsConfiguration function that", function () {
                it("is defined", function () {
                    expect(paymentAddView.getAddDetailsConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.getAddDetailsConfiguration).toEqual(jasmine.any(Function));
                });

                it("should return the expected result", function () {
                    var expectedConfiguration = {
                            "message": null,
                            "payment": null
                        },
                        actualConfiguration,
                        addPaymentResponse = {
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

                    expectedConfiguration.message = addPaymentResponse.message;

                    expectedConfiguration.payment = utils._.extend({},
                        utils.deepClone(globals.paymentChangedDetails.configuration));

                    expectedConfiguration.payment.scheduledDate.value = addPaymentResponse.scheduledDate;
                    expectedConfiguration.payment.amount.value = utils.formatCurrency(addPaymentResponse.amount);
                    expectedConfiguration.payment.bankAccountName.value = addPaymentResponse.bankAccount.name;
                    expectedConfiguration.payment.confirmationNumber.value = addPaymentResponse.confirmationNumber;

                    actualConfiguration = paymentAddView.getAddDetailsConfiguration(addPaymentResponse);

                    expect(actualConfiguration).toEqual(expectedConfiguration);
                });
            });

            describe("has an resetModel function that", function () {
                var defaultBankAccount,
                    defaultPaymentDate;

                beforeEach(function () {
                    defaultBankAccount = userModel.get("selectedCompany").get("bankAccounts").at(0);
                    defaultPaymentDate = utils.moment();

                    spyOn(paymentAddView, "getEarlistPaymentDate").and.returnValue(defaultPaymentDate);
                    spyOn(paymentAddView, "findDefaultBankAccount").and.returnValue(defaultBankAccount);
                    spyOn(paymentAddView.model, "set").and.callFake(function () {});

                    paymentAddView.resetModel();
                });

                it("is defined", function () {
                    expect(paymentAddView.resetModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.resetModel).toEqual(jasmine.any(Function));
                });

                it("should set paymentDueDate on the model", function () {
                    expect(paymentAddView.model.set)
                        .toHaveBeenCalledWith("paymentDueDate", mockInvoiceSummaryModel.paymentDueDate);
                });

                it("should set minimumPaymentDue on the model", function () {
                    expect(paymentAddView.model.set)
                        .toHaveBeenCalledWith("minimumPaymentDue", mockInvoiceSummaryModel.minimumPaymentDue);
                });

                it("should set amount on the model", function () {
                    expect(paymentAddView.model.set)
                        .toHaveBeenCalledWith("amount", mockInvoiceSummaryModel.minimumPaymentDue);
                });

                it("should call getEarlistPaymentDate", function () {
                    expect(paymentAddView.getEarlistPaymentDate).toHaveBeenCalledWith();
                });

                it("should set scheduledDate on the model", function () {
                    expect(paymentAddView.model.set)
                        .toHaveBeenCalledWith("scheduledDate", defaultPaymentDate.format("MM/DD/YYYY"));
                });

                it("should call findDefaultBankAccount", function () {
                    expect(paymentAddView.findDefaultBankAccount).toHaveBeenCalledWith();
                });

                it("should set bankAccount on the model", function () {
                    expect(paymentAddView.model.set).toHaveBeenCalledWith("bankAccount", defaultBankAccount);
                });
            });

            describe("has a pageBeforeShow function that", function () {
                beforeEach(function () {
                    spyOn(paymentAddView, "resetForm").and.callFake(function () { });

                    paymentAddView.pageBeforeShow();
                });

                it("is defined", function () {
                    expect(paymentAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.submitForm).toEqual(jasmine.any(Function));
                });

                it("should call resetForm", function () {
                    expect(paymentAddView.resetForm).toHaveBeenCalledWith();
                });
            });

            describe("has a handlePageBeforeShow function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(paymentAddView, "pageBeforeShow").and.callFake(function () { });

                    paymentAddView.handlePageBeforeShow(mockEvent);
                });

                it("is defined", function () {
                    expect(paymentAddView.handlePageBeforeShow).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.handlePageBeforeShow).toEqual(jasmine.any(Function));
                });

                it("should call pageBeforeShow", function () {
                    expect(paymentAddView.pageBeforeShow).toHaveBeenCalledWith();
                });
            });

            describe("has a handleInputChanged function that", function () {
                it("is defined", function () {
                    expect(paymentAddView.handleInputChanged).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.handleInputChanged).toEqual(jasmine.any(Function));
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
                        spyOn(paymentAddView, "findBankAccount").and.returnValue(mockBankAccount);
                        spyOn(paymentAddView, "updateAttribute").and.callFake(function () {});

                        paymentAddView.handleInputChanged(mockEvent);
                    });

                    it("should call findBankAccount", function () {
                        expect(paymentAddView.findBankAccount).toHaveBeenCalledWith(mockEvent.target.value);
                    });

                    it("should call updateAttribute", function () {
                        expect(paymentAddView.updateAttribute).toHaveBeenCalledWith("bankAccount", mockBankAccount);
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
                        spyOn(paymentAddView, "findBankAccount").and.returnValue();
                        spyOn(PaymentAddView.__super__, "handleInputChanged").and.callThrough();

                        paymentAddView.handleInputChanged(mockEvent);
                    });

                    it("should NOT call findBankAccount", function () {
                        expect(paymentAddView.findBankAccount).not.toHaveBeenCalled();
                    });

                    it("should call updateAttribute on super", function () {
                        expect(PaymentAddView.__super__.handleInputChanged).toHaveBeenCalledWith(mockEvent);
                    });
                });
            });

            describe("has a savePayment function that", function () {
                beforeEach(function () {
                    spyOn(paymentModel, "add").and.callFake(function () { });
                    paymentAddView.savePayment();
                });

                it("is defined", function () {
                    expect(paymentAddView.savePayment).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.savePayment).toEqual(jasmine.any(Function));
                });

                describe("when calling add() on the model", function () {
                    var mockAddDetailsConfiguration = utils._.extend({},
                        utils.deepClone(globals.paymentChangedDetails.configuration));

                    it("should send 1 argument", function () {
                        expect(paymentModel.add).toHaveBeenCalled();
                        expect(paymentModel.add.calls.mostRecent().args.length).toEqual(1);
                    });

                    describe("sends as the first argument the options object with a success callback that",
                        function () {
                            var response = {},
                                model,
                                options,
                                mockMustacheRenderReturnValue = "Render return value";

                            beforeEach(function () {
                                spyOn(mockMustache, "render").and.returnValue(mockMustacheRenderReturnValue);
                                spyOn(paymentAddView, "getAddDetailsConfiguration").and
                                    .returnValue(mockAddDetailsConfiguration);
                                spyOn(paymentAddView, "trigger").and.callFake(function () { });

                                options = paymentModel.add.calls.mostRecent().args[0];
                                options.success.call(paymentAddView, model, response);
                            });

                            it("should call getAddDetailsConfiguration", function () {
                                expect(paymentAddView.getAddDetailsConfiguration).toHaveBeenCalledWith(response);
                            });

                            it("should call Mustache.render() on the addDetailsTemplate", function () {
                                expect(mockMustache.render).toHaveBeenCalledWith(paymentAddView.addDetailsTemplate,
                                                                                 mockAddDetailsConfiguration);
                            });

                            it("should trigger paymentAddSuccess", function () {
                                expect(paymentAddView.trigger)
                                    .toHaveBeenCalledWith("paymentAddSuccess", mockMustacheRenderReturnValue);
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

                    paymentAddView.submitForm(mockEvent);
                });

                it("is defined", function () {
                    expect(paymentAddView.submitForm).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentAddView.submitForm).toEqual(jasmine.any(Function));
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
                        spyOn(paymentAddView, "handleValidationError").and.callFake(function () {});
                        spyOn(paymentModel, "validateWarnings").and.returnValue();
                        spyOn(paymentAddView, "handleValidationWarning").and.callFake(function () {});
                        spyOn(paymentAddView, "savePayment").and.callFake(function () { });

                        paymentAddView.submitForm(mockEvent);
                    });

                    it("should call validate on the PaymentModel", function () {
                        expect(paymentModel.validate).toHaveBeenCalledWith();
                    });

                    it("should call handleValidationError", function () {
                        expect(paymentAddView.handleValidationError).toHaveBeenCalledWith(paymentModel, mockErrors);
                    });

                    it("should NOT call validateWarnings on the PaymentModel", function () {
                        expect(paymentModel.validateWarnings).not.toHaveBeenCalled();
                    });

                    it("should NOT call handleValidationWarning", function () {
                        expect(paymentAddView.handleValidationWarning).not.toHaveBeenCalled();
                    });

                    it("should NOT call savePayment", function () {
                        expect(paymentAddView.savePayment).not.toHaveBeenCalled();
                    });
                });

                describe("when validate does NOT return errors", function () {
                    beforeEach(function () {
                        spyOn(paymentModel, "validate").and.returnValue();
                        spyOn(paymentAddView, "handleValidationError").and.callFake(function () {});
                    });

                    describe("when validateWarnings returns warnings", function () {
                        var mockWarnings = [
                                {
                                    warning: "asdfgasdf"
                                }
                            ];

                        beforeEach(function () {
                            spyOn(paymentModel, "validateWarnings").and.returnValue(mockWarnings);
                            spyOn(paymentAddView, "handleValidationWarning").and.callFake(function () {});
                            spyOn(paymentAddView, "savePayment").and.callFake(function () { });

                            paymentAddView.submitForm(mockEvent);
                        });

                        it("should call validate on the PaymentModel", function () {
                            expect(paymentModel.validate).toHaveBeenCalledWith();
                        });

                        it("should NOT call handleValidationError", function () {
                            expect(paymentAddView.handleValidationError).not.toHaveBeenCalled();
                        });

                        it("should call validateWarnings on the PaymentModel", function () {
                            expect(paymentModel.validateWarnings).toHaveBeenCalled();
                        });

                        it("should call handleValidationWarning", function () {
                            expect(paymentAddView.handleValidationWarning).
                                toHaveBeenCalledWith(paymentModel, mockWarnings, paymentAddView.savePayment);
                        });

                        it("should NOT call savePayment", function () {
                            expect(paymentAddView.savePayment).not.toHaveBeenCalled();
                        });
                    });

                    describe("when validateWarnings does NOT return warnings", function () {
                        beforeEach(function () {
                            spyOn(paymentModel, "validateWarnings").and.returnValue();
                            spyOn(paymentAddView, "handleValidationWarning").and.callFake(function () {});
                            spyOn(paymentAddView, "savePayment").and.callFake(function () { });

                            paymentAddView.submitForm(mockEvent);
                        });

                        it("should call validate on the PaymentModel", function () {
                            expect(paymentModel.validate).toHaveBeenCalledWith();
                        });

                        it("should NOT call handleValidationError", function () {
                            expect(paymentAddView.handleValidationError).not.toHaveBeenCalled();
                        });

                        it("should call validateWarnings on the PaymentModel", function () {
                            expect(paymentModel.validateWarnings).toHaveBeenCalled();
                        });

                        it("should NOT call handleValidationWarning", function () {
                            expect(paymentAddView.handleValidationWarning).not.toHaveBeenCalled();
                        });

                        it("should call savePayment", function () {
                            expect(paymentAddView.savePayment).toHaveBeenCalledWith();
                        });
                    });
                });
            });
        });
    });
