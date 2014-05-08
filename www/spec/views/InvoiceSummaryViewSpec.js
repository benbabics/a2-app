define(["Squire", "backbone", "mustache", "globals", "utils", "models/UserModel",
        "text!tmpl/invoice/summary.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, globals, utils, UserModel, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
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
                    shippingMethods: [
                        {
                            id: "134613456",
                            name: "UNASSIGNED",
                            "cost": 3,
                            "poBoxAllowed": true
                        },
                        {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            "cost": 567,
                            "poBoxAllowed": false
                        }
                    ],
                    defaultShippingAddress: {
                        "firstName"     : "First Name",
                        "lastName"      : "Last Name",
                        "companyName"   : "Company Name",
                        "addressLine1"  : "Address Line 1",
                        "addressLine2"  : "Address Line 2",
                        "city"          : "City",
                        "state"         : "State",
                        "postalCode"    : "Postal Code",
                        "countryCode"   : "Country Code",
                        "residence"     : true
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            mockInvoiceSummaryModel = {
                "invoiceId"         : "Invoice Id",
                "accountNumber"     : "Account Number",
                "availableCredit"   : 3245.56,
                "currentBalance"    : 357367.56,
                "currentBalanceAsOf": "Current Balance As Of Date",
                "paymentDueDate"    : "Payment Due Date",
                "minimumPaymentDue" : 234.45,
                "invoiceNumber"     : "Invoice Number",
                "closingDate"       : "Closing Date"
            },
            invoiceSummaryModel = new Backbone.Model(),
            mockMakePaymentAvailabilityModel = {
                "shouldDisplayDirectDebitEnabledMessage": false,
                "shouldDisplayBankAccountSetupMessage"  : false,
                "shouldDisplayOutstandingPaymentMessage": false,
                "makePaymentAllowed"                    : false
            },
            makePaymentAvailabilityModel = new Backbone.Model(),
            userModel = UserModel.getInstance(),
            InvoiceSummaryView,
            invoiceSummaryView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);

        describe("An Invoice Summary View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/InvoiceSummaryView"],
                    function (JasmineInvoiceSummaryView) {
                        //TODO - Fix - Loading fixtures causes phantomjs to hang
                        if (window._phantom === undefined) {
                            loadFixtures("index.html");
                        }

                        invoiceSummaryModel.set(mockInvoiceSummaryModel);
                        makePaymentAvailabilityModel.set(mockMakePaymentAvailabilityModel);
                        userModel.initialize(mockUserModel);

                        InvoiceSummaryView = JasmineInvoiceSummaryView;

                        invoiceSummaryView =  new InvoiceSummaryView({
                            model: invoiceSummaryModel,
                            makePaymentAvailabilityModel: makePaymentAvailabilityModel,
                            userModel: userModel
                        });

                        done();
                    });
            });

            it("is defined", function () {
                expect(invoiceSummaryView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(invoiceSummaryView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(invoiceSummaryView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(invoiceSummaryView.el).toEqual("#invoiceSummary");
                });

                it("should set el nodeName", function () {
                    expect(invoiceSummaryView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(invoiceSummaryView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(InvoiceSummaryView.__super__, "initialize").and.callThrough();

                    invoiceSummaryView.initialize();
                });

                it("is defined", function () {
                    expect(invoiceSummaryView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call initialize on super", function () {
                    expect(InvoiceSummaryView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(invoiceSummaryView.template);
                });

                it("should set makePaymentAvailabilityModel", function () {
                    expect(invoiceSummaryView.makePaymentAvailabilityModel).toEqual(makePaymentAvailabilityModel);
                });

                it("should set userModel", function () {
                    expect(invoiceSummaryView.userModel).toEqual(userModel);
                });
            });

            describe("has a render function that", function () {
                var actualContent,
                    expectedConfiguration;

                beforeEach(function () {
                    expectedConfiguration = {
                        "invoiceSummary": utils._.extend({}, utils.deepClone(globals.invoiceSummary.configuration)),
                        "permissions"   : userModel.get("permissions")
                    };

                    actualContent = invoiceSummaryView.$el.find(":jqmData(role=content)");
                    spyOn(invoiceSummaryView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    spyOn(invoiceSummaryView, "getConfiguration").and
                        .callFake(function () { return expectedConfiguration; });
                    invoiceSummaryView.render();
                });

                it("is defined", function () {
                    expect(invoiceSummaryView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryView.render).toEqual(jasmine.any(Function));
                });

                it("should call getConfiguration", function () {
                    expect(invoiceSummaryView.getConfiguration).toHaveBeenCalledWith();
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render)
                        .toHaveBeenCalledWith(invoiceSummaryView.template, expectedConfiguration);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate, expectedConfiguration);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });

                describe("when dynamically rendering the template based on the model data", function () {
                    describe("when the user has the MOBILE_PAYMENT_MAKE permission", function () {
                        beforeEach(function () {
                            invoiceSummaryView.userModel.set("permissions", {"MOBILE_PAYMENT_MAKE": true});
                        });

                        describe("when unableToMakePaymentMessage has a value", function () {
                            var unableToMakePaymentMessage = "Unable To Make Payment Message";

                            beforeEach(function () {
                                expectedConfiguration = {
                                    "invoiceSummary": utils._.extend({}, utils.deepClone(globals.invoiceSummary.configuration)),
                                    "permissions"   : userModel.get("permissions")
                                };
                                expectedConfiguration.invoiceSummary.makePaymentButton.visible = true;
                                expectedConfiguration.invoiceSummary.unableToMakePaymentMessage = unableToMakePaymentMessage;

                                invoiceSummaryView.render();
                            });

                            it("should include an unableToMakePaymentMessage", function () {
                                expect(actualContent[0]).toContainElement("div[id='unableToMakePaymentMessage']");
                            });

                            it("should include the unableToMakePaymentMessage text", function () {
                                expect(actualContent.find("div[id='unableToMakePaymentMessage']")).toContainText(unableToMakePaymentMessage);
                            });

                            it("should include a link to the Make Payment page", function () {
                                expect(actualContent[0]).toContainElement("a[href='#makePayment']");
                            });
                        });

                        describe("when unableToMakePaymentMessage does NOT have a value", function () {
                            beforeEach(function () {
                                expectedConfiguration = {
                                    "invoiceSummary": utils._.extend({}, utils.deepClone(globals.invoiceSummary.configuration)),
                                    "permissions"   : userModel.get("permissions")
                                };
                                expectedConfiguration.invoiceSummary.makePaymentButton.visible = true;
                                expectedConfiguration.invoiceSummary.unableToMakePaymentMessage = null;

                                invoiceSummaryView.render();
                            });

                            it("should NOT include an unableToMakePaymentMessage", function () {
                                expect(actualContent[0]).not.toContainElement("div[id='unableToMakePaymentMessage']");
                            });

                            it("should include a link to the Make Payment page", function () {
                                expect(actualContent[0]).toContainElement("a[href='#makePayment']");
                            });
                        });
                    });

                    it("should NOT include a link to the Make Payment page if the user does NOT have the MOBILE_PAYMENT_MAKE permission",
                        function () {
                            invoiceSummaryView.userModel.set("permissions", {"MOBILE_PAYMENT_MAKE": false});
                            expectedConfiguration = {
                                "invoiceSummary": utils._.extend({}, utils.deepClone(globals.invoiceSummary.configuration)),
                                "permissions"   : userModel.get("permissions")
                            };
                            expectedConfiguration.invoiceSummary.makePaymentButton.visible = true;

                            invoiceSummaryView.render();

                            expect(actualContent[0]).not.toContainElement("a[href='#makePayment']");
                        });
                });
            });

            describe("has a getConfiguration function that", function () {
                it("is defined", function () {
                    expect(invoiceSummaryView.getConfiguration).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryView.getConfiguration).toEqual(jasmine.any(Function));
                });

                describe("when the shouldDisplayDirectDebitEnabledMessage is true", function () {
                    var actualConfiguration;

                    beforeEach(function () {
                        makePaymentAvailabilityModel.set("shouldDisplayDirectDebitEnabledMessage", true);

                        actualConfiguration = invoiceSummaryView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var user = userModel.toJSON(),
                            expectedConfiguration = {
                                invoiceSummary: utils._.extend({},
                                    utils.deepClone(globals.invoiceSummary.configuration)),
                                "permissions" : user.permissions
                            };


                        expectedConfiguration.invoiceSummary.accountNumber.value =
                            mockInvoiceSummaryModel.accountNumber;

                        expectedConfiguration.invoiceSummary.availableCredit.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.availableCredit);

                        expectedConfiguration.invoiceSummary.currentBalance.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.currentBalance);

                        expectedConfiguration.invoiceSummary.currentBalance.asOfValue =
                            mockInvoiceSummaryModel.currentBalanceAsOf;

                        expectedConfiguration.invoiceSummary.paymentDueDate.value =
                            mockInvoiceSummaryModel.paymentDueDate;

                        expectedConfiguration.invoiceSummary.minimumPaymentDue.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.minimumPaymentDue);

                        expectedConfiguration.invoiceSummary.invoiceNumber.value =
                            mockInvoiceSummaryModel.invoiceNumber;

                        expectedConfiguration.invoiceSummary.closingDate.value =
                            mockInvoiceSummaryModel.closingDate;

                        expectedConfiguration.invoiceSummary.unableToMakePaymentMessage =
                            globals.invoiceSummary.constants.DIRECT_DEPOSIT_ENABLED;

                        expectedConfiguration.invoiceSummary.makePaymentButton.visible =
                            mockMakePaymentAvailabilityModel.makePaymentAllowed;

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the shouldDisplayDirectDebitEnabledMessage is true", function () {
                    var actualConfiguration;

                    beforeEach(function () {
                        makePaymentAvailabilityModel.set("shouldDisplayDirectDebitEnabledMessage", false);
                        makePaymentAvailabilityModel.set("shouldDisplayBankAccountSetupMessage", true);

                        actualConfiguration = invoiceSummaryView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var user = userModel.toJSON(),
                            expectedConfiguration = {
                                invoiceSummary: utils._.extend({},
                                    utils.deepClone(globals.invoiceSummary.configuration)),
                                "permissions" : user.permissions
                            };


                        expectedConfiguration.invoiceSummary.accountNumber.value =
                            mockInvoiceSummaryModel.accountNumber;

                        expectedConfiguration.invoiceSummary.availableCredit.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.availableCredit);

                        expectedConfiguration.invoiceSummary.currentBalance.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.currentBalance);

                        expectedConfiguration.invoiceSummary.currentBalance.asOfValue =
                            mockInvoiceSummaryModel.currentBalanceAsOf;

                        expectedConfiguration.invoiceSummary.paymentDueDate.value =
                            mockInvoiceSummaryModel.paymentDueDate;

                        expectedConfiguration.invoiceSummary.minimumPaymentDue.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.minimumPaymentDue);

                        expectedConfiguration.invoiceSummary.invoiceNumber.value =
                            mockInvoiceSummaryModel.invoiceNumber;

                        expectedConfiguration.invoiceSummary.closingDate.value =
                            mockInvoiceSummaryModel.closingDate;

                        expectedConfiguration.invoiceSummary.unableToMakePaymentMessage =
                            globals.invoiceSummary.constants.MUST_SET_UP_BANKS;

                        expectedConfiguration.invoiceSummary.makePaymentButton.visible =
                            mockMakePaymentAvailabilityModel.makePaymentAllowed;

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });

                describe("when the shouldDisplayOutstandingPaymentMessage is true", function () {
                    var actualConfiguration;

                    beforeEach(function () {
                        makePaymentAvailabilityModel.set("shouldDisplayDirectDebitEnabledMessage", false);
                        makePaymentAvailabilityModel.set("shouldDisplayOutstandingPaymentMessage", true);

                        actualConfiguration = invoiceSummaryView.getConfiguration();
                    });

                    it("should return the expected result", function () {
                        var user = userModel.toJSON(),
                            expectedConfiguration = {
                                invoiceSummary: utils._.extend({},
                                    utils.deepClone(globals.invoiceSummary.configuration)),
                                "permissions" : user.permissions
                            };


                        expectedConfiguration.invoiceSummary.accountNumber.value =
                            mockInvoiceSummaryModel.accountNumber;

                        expectedConfiguration.invoiceSummary.availableCredit.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.availableCredit);

                        expectedConfiguration.invoiceSummary.currentBalance.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.currentBalance);

                        expectedConfiguration.invoiceSummary.currentBalance.asOfValue =
                            mockInvoiceSummaryModel.currentBalanceAsOf;

                        expectedConfiguration.invoiceSummary.paymentDueDate.value =
                            mockInvoiceSummaryModel.paymentDueDate;

                        expectedConfiguration.invoiceSummary.minimumPaymentDue.value =
                            utils.formatCurrency(mockInvoiceSummaryModel.minimumPaymentDue);

                        expectedConfiguration.invoiceSummary.invoiceNumber.value =
                            mockInvoiceSummaryModel.invoiceNumber;

                        expectedConfiguration.invoiceSummary.closingDate.value =
                            mockInvoiceSummaryModel.closingDate;

                        expectedConfiguration.invoiceSummary.unableToMakePaymentMessage =
                            globals.invoiceSummary.constants.DIRECT_DEPOSIT_ENABLED;

                        expectedConfiguration.invoiceSummary.makePaymentButton.visible =
                            mockMakePaymentAvailabilityModel.makePaymentAllowed;

                        expect(actualConfiguration).toEqual(expectedConfiguration);
                    });
                });
            });
        });
    });
