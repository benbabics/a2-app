define(["Squire", "backbone", "mustache", "globals", "utils", "models/PaymentModel", "models/UserModel",
        "text!tmpl/payment/paymentEdit.html", "text!tmpl/payment/paymentChangeDetails.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, PaymentModel, UserModel,
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
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
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

        describe("A Payment Edit View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "./";

            beforeEach(function (done) {
                squire.require(["views/PaymentEditView"], function (JasminePaymentEditView) {
                    var bankAccounts = new Backbone.Collection();

                    loadFixtures("index.html");

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

            it("looks like a Backbone View", function () {
                expect(paymentEditView instanceof Backbone.View).toBeTruthy();
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

                it("should set invoiceSummaryModel", function () {
                    expect(paymentEditView.invoiceSummaryModel).toEqual(invoiceSummaryModel);
                });

                it("should set userModel", function () {
                    expect(paymentEditView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    mockConfiguration = {
                        "payment": null
                    };

                beforeEach(function () {
                    mockConfiguration.payment = utils._.extend({}, utils.deepClone(globals.paymentEdit.configuration));

                    actualContent = paymentEditView.$el.find(":jqmData(role=content)");
                    spyOn(paymentEditView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(paymentEditView.$el, "trigger").and.callThrough();
                    spyOn(paymentEditView, "updateModelFromSummary").and.callFake(function () { });
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentEditView, "getConfiguration").and
                        .callFake(function () { return mockConfiguration; });
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

                it("should call the trigger function on the $el", function () {
                    expect(paymentEditView.$el.trigger).toHaveBeenCalledWith("create");
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

            describe("has a findBankAccount function that", function () {
                var mockBankAccountId = "25621354",
                    mockBankAccount = {
                        id: "134613456",
                        name: "UNASSIGNED",
                        defaultBank: true
                    },
                    bankAccounts,
                    actualValue;

                beforeEach(function () {
                    bankAccounts = userModel.get("selectedCompany").get("bankAccounts");
                    spyOn(bankAccounts, "findWhere").and.returnValue(mockBankAccount);

                    actualValue = paymentEditView.findBankAccount(mockBankAccountId);
                });

                it("is defined", function () {
                    expect(paymentEditView.findBankAccount).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.findBankAccount).toEqual(jasmine.any(Function));
                });

                it("should call findWhere on the bankAccounts collection", function () {
                    expect(bankAccounts.findWhere).toHaveBeenCalledWith({"id": mockBankAccountId});
                });

                it("should return the expected value", function () {
                    expect(actualValue).toEqual(mockBankAccount);
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

            describe("has a getEarlistPaymentDate function that", function () {
                var mockMomentAfterAdd = {},
                    mockMoment = {
                        day: function () { return 0; },
                        add: function () { return mockMomentAfterAdd; }
                    };

                it("is defined", function () {
                    expect(paymentEditView.getEarlistPaymentDate).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.getEarlistPaymentDate).toEqual(jasmine.any(Function));
                });

                describe("when the day is Sunday", function () {
                    var actualValue;

                    beforeEach(function () {
                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);
                        spyOn(mockMoment, "add").and.callThrough();
                        spyOn(mockMoment, "day").and.callFake(
                            function (dayToCheckFor) {
                                return dayToCheckFor === "Sunday";
                            }
                        );

                        actualValue = paymentEditView.getEarlistPaymentDate();
                    });

                    it("should call add on moment", function () {
                        expect(mockMoment.add).toHaveBeenCalledWith("days", 1);
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockMomentAfterAdd);
                    });
                });

                describe("when the day is Monday - Friday", function () {
                    var actualValue;

                    beforeEach(function () {
                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);
                        spyOn(mockMoment, "add").and.callThrough();
                        spyOn(mockMoment, "day").and.returnValue(false);

                        actualValue = paymentEditView.getEarlistPaymentDate();
                    });

                    it("should NOT call add on moment", function () {
                        expect(mockMoment.add).not.toHaveBeenCalled();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockMoment);
                    });
                });

                describe("when the day is Saturday", function () {
                    var actualValue;

                    beforeEach(function () {
                        spyOn(mockUtils, "moment").and.returnValue(mockMoment);
                        spyOn(mockMoment, "add").and.callThrough();
                        spyOn(mockMoment, "day").and.callFake(
                            function (dayToCheckFor) {
                                return dayToCheckFor === "Saturday";
                            }
                        );

                        actualValue = paymentEditView.getEarlistPaymentDate();
                    });

                    it("should call add on moment", function () {
                        expect(mockMoment.add).toHaveBeenCalledWith("days", 2);
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockMomentAfterAdd);
                    });
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

            describe("has a submitForm function that", function () {
                var mockEvent = {
                    preventDefault : function () { }
                };

                beforeEach(function () {
                    spyOn(mockEvent, "preventDefault").and.callThrough();
                    spyOn(paymentModel, "edit").and.callFake(function () { });
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
        });
    });
