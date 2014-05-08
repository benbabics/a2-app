define(["Squire", "backbone", "globals", "models/UserModel"],
    function (Squire, Backbone, globals, UserModel) {

        "use strict";

        var squire = new Squire(),
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                hasMultipleAccounts: false,
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
                    driverIdLength: "4",
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
                    }
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ]
            },
            userModel = UserModel.getInstance(),
            invoiceSummaryModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/UserModel", UserModel);

        describe("An Invoice Summary Model", function () {
            beforeEach(function (done) {
                squire.require(["models/InvoiceSummaryModel"], function (InvoiceSummaryModel) {
                    userModel.initialize(mockUserModel);
                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    invoiceSummaryModel = new InvoiceSummaryModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(invoiceSummaryModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(invoiceSummaryModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a defaults function that", function () {
                it("is defined", function () {
                    expect(invoiceSummaryModel.defaults).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryModel.defaults).toEqual(jasmine.any(Function));
                });

                it("should set invoiceId to default", function () {
                    expect(invoiceSummaryModel.defaults().invoiceId).toBeNull();
                });

                it("should set accountNumber to default", function () {
                    expect(invoiceSummaryModel.defaults().accountNumber).toBeNull();
                });

                it("should set availableCredit to default", function () {
                    expect(invoiceSummaryModel.defaults().availableCredit).toBeNull();
                });

                it("should set currentBalance to default", function () {
                    expect(invoiceSummaryModel.defaults().currentBalance).toBeNull();
                });

                it("should set currentBalanceAsOf to default", function () {
                    expect(invoiceSummaryModel.defaults().currentBalanceAsOf).toBeNull();
                });

                it("should set paymentDueDate to default", function () {
                    expect(invoiceSummaryModel.defaults().paymentDueDate).toBeNull();
                });

                it("should set minimumPaymentDue to default", function () {
                    expect(invoiceSummaryModel.defaults().minimumPaymentDue).toBeNull();
                });

                it("should set invoiceNumber to default", function () {
                    expect(invoiceSummaryModel.defaults().invoiceNumber).toBeNull();
                });

                it("should set closingDate to default", function () {
                    expect(invoiceSummaryModel.defaults().closingDate).toBeNull();
                });
            });

            describe("has a urlRoot function that", function () {
                it("is defined", function () {
                    expect(invoiceSummaryModel.urlRoot).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryModel.urlRoot).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL +
                            "/" +
                            mockUserModel.selectedCompany.accountId +
                            globals.WEBSERVICE.INVOICE_SUMMARY_PATH,
                        actualResult = invoiceSummaryModel.urlRoot();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(invoiceSummaryModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(invoiceSummaryModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        invoiceSummaryModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(invoiceSummaryModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        invoiceSummaryModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(invoiceSummaryModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "invoiceId"         : "Invoice Id",
                        "accountNumber"     : "Account Number",
                        "availableCredit"   : 23456134.45,
                        "currentBalance"    : 2345245.64,
                        "currentBalanceAsOf": "Current Balance As Of",
                        "paymentDueDate"    : "Payment Due Date",
                        "minimumPaymentDue" : 345.45,
                        "invoiceNumber"     : "Invoice Number",
                        "closingDate"       : "Closing Date"
                    };

                    beforeEach(function () {
                        invoiceSummaryModel.initialize(options);
                    });

                    it("should call set 9 times", function () {
                        expect(invoiceSummaryModel.set.calls.count()).toEqual(9);
                    });

                    it("should set invoiceId", function () {
                        expect(invoiceSummaryModel.set).toHaveBeenCalledWith("invoiceId", options.invoiceId);
                    });

                    it("should set accountNumber", function () {
                        expect(invoiceSummaryModel.set).toHaveBeenCalledWith("accountNumber", options.accountNumber);
                    });

                    it("should set availableCredit", function () {
                        expect(invoiceSummaryModel.set)
                            .toHaveBeenCalledWith("availableCredit", options.availableCredit);
                    });

                    it("should set currentBalance", function () {
                        expect(invoiceSummaryModel.set).toHaveBeenCalledWith("currentBalance", options.currentBalance);
                    });

                    it("should set currentBalanceAsOf", function () {
                        expect(invoiceSummaryModel.set)
                            .toHaveBeenCalledWith("currentBalanceAsOf", options.currentBalanceAsOf);
                    });

                    it("should set paymentDueDate", function () {
                        expect(invoiceSummaryModel.set).toHaveBeenCalledWith("paymentDueDate", options.paymentDueDate);
                    });

                    it("should set minimumPaymentDue", function () {
                        expect(invoiceSummaryModel.set)
                            .toHaveBeenCalledWith("minimumPaymentDue", options.minimumPaymentDue);
                    });

                    it("should set invoiceNumber", function () {
                        expect(invoiceSummaryModel.set).toHaveBeenCalledWith("invoiceNumber", options.invoiceNumber);
                    });

                    it("should set closingDate", function () {
                        expect(invoiceSummaryModel.set).toHaveBeenCalledWith("closingDate", options.closingDate);
                    });
                });
            });
        });
    });
