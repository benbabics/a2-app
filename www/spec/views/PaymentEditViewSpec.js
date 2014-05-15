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
                "scheduledDate"     : "5/8/2014",
                "amount"            : 24356.56
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
                var actualContent;

                beforeEach(function () {
                    actualContent = paymentEditView.$el.find(":jqmData(role=content)");
                    spyOn(paymentEditView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(paymentEditView, "resetModel").and.callFake(function () { });
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(paymentEditView, "formatRequiredFields").and.callThrough();

                    paymentEditView.render();
                });

                it("is defined", function () {
                    expect(paymentEditView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentEditView.render).toEqual(jasmine.any(Function));
                });

                it("should call resetModel", function () {
                    expect(paymentEditView.resetModel).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(paymentEditView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call formatRequiredFields()", function () {
                    expect(paymentEditView.formatRequiredFields).toHaveBeenCalledWith();
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });
        });
    });
