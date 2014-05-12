define(["Squire", "utils", "globals", "backbone", "models/UserModel"],
    function (Squire, utils, globals, Backbone, UserModel) {

        "use strict";

        var squire = new Squire(),
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
                            customVehicleIdMaxLength: 5,
                            licensePlateNumberMaxLength: 7,
                            licensePlateStateFixedLength: 2,
                            vehicleDescriptionMaxLength: 6,
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
            PaymentModel,
            paymentModel;

        squire.mock("backbone", Backbone);
        squire.mock("utils", mockUtils);
        squire.mock("models/UserModel", UserModel);

        describe("A Payment Model", function () {
            beforeEach(function (done) {
                squire.require(["models/PaymentModel"], function (JasmineCompanyModel) {
                    userModel.initialize(mockUserModel);
                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    PaymentModel = JasmineCompanyModel;
                    paymentModel = new PaymentModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(paymentModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(paymentModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a defaults function that", function () {
                it("is defined", function () {
                    expect(paymentModel.defaults).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentModel.defaults).toEqual(jasmine.any(Function));
                });

                it("should set id to default", function () {
                    expect(paymentModel.defaults().id).toBeNull();
                });

                it("should set scheduledDate to default", function () {
                    expect(paymentModel.defaults().scheduledDate).toBeNull();
                });

                it("should set amount to default", function () {
                    expect(paymentModel.defaults().amount).toBeNull();
                });

                it("should set bankAccount to default", function () {
                    expect(paymentModel.defaults().bankAccount).toBeNull();
                });

                it("should set status to default", function () {
                    expect(paymentModel.defaults().status).toBeNull();
                });

                it("should set confirmationNumber to default", function () {
                    expect(paymentModel.defaults().confirmationNumber).toBeNull();
                });
            });

            describe("has a urlRoot function that", function () {
                it("is defined", function () {
                    expect(paymentModel.urlRoot).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentModel.urlRoot).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL +
                            "/" +
                            mockUserModel.selectedCompany.accountId +
                            globals.WEBSERVICE.PAYMENTS_PATH,
                        actualResult = paymentModel.urlRoot();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(paymentModel, "set").and.callThrough();
                    spyOn(paymentModel, "get").and.callThrough();
                });

                it("is defined", function () {
                    expect(paymentModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        paymentModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(paymentModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        paymentModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(paymentModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
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
                    };

                    beforeEach(function () {
                        paymentModel.initialize(options);
                    });

                    it("should call set 6 times", function () {
                        expect(paymentModel.set.calls.count()).toEqual(6);
                    });

                    it("should set id", function () {
                        expect(paymentModel.set).toHaveBeenCalledWith("id", options.id);
                    });

                    it("should set scheduledDate", function () {
                        expect(paymentModel.set).toHaveBeenCalledWith("scheduledDate", options.scheduledDate);
                    });

                    it("should set amount", function () {
                        expect(paymentModel.set).toHaveBeenCalledWith("amount", options.amount);
                    });

                    // TODO - Replace with something that verifies that a new BankAccountModel was created,
                    // the correct parameter was passed to the BankAccountModel.initialize function and then set
                    // to "bankAccount"
                    it("should set bankAccount", function () {
                        var actualBankAccount;

                        expect(paymentModel.set.calls.argsFor(3).length).toEqual(2);
                        expect(paymentModel.set.calls.argsFor(3)[0]).toEqual("bankAccount");

                        actualBankAccount = paymentModel.set.calls.argsFor(3)[1].toJSON();

                        expect(actualBankAccount.id).toEqual(options.bankAccount.id);
                        expect(actualBankAccount.name).toEqual(options.bankAccount.name);
                        expect(actualBankAccount.defaultBank).toEqual(options.bankAccount.defaultBank);
                    });

                    it("should set status", function () {
                        expect(paymentModel.set).toHaveBeenCalledWith("status", options.status);
                    });

                    it("should set confirmationNumber", function () {
                        expect(paymentModel.set).toHaveBeenCalledWith("confirmationNumber", options.confirmationNumber);
                    });
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(paymentModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when bankAccount does have a value", function () {
                    var bankAccount,
                        mockPaymentModel,
                        actualValue;

                    beforeEach(function () {
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
                        };
                        paymentModel.clear();
                        paymentModel.initialize(mockPaymentModel);
                        bankAccount = paymentModel.get("bankAccount");

                        spyOn(bankAccount, "toJSON").and.callThrough();
                        spyOn(PaymentModel.__super__, "toJSON").and.callThrough();

                        actualValue = paymentModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(PaymentModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on bankAccount", function () {
                        expect(bankAccount.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockPaymentModel);
                    });
                });

                describe("when bankAccount does NOT have a value", function () {
                    var mockPaymentModel,
                        actualValue;

                    beforeEach(function () {
                        mockPaymentModel = {
                            "id"                : "13451345",
                            "scheduledDate"     : "5/8/2014",
                            "amount"            : 24356.56,
                            "status"            : "Status",
                            "confirmationNumber": "13451dvfgwdrfg23456"
                        };
                        paymentModel.clear();
                        paymentModel.initialize(mockPaymentModel);

                        spyOn(PaymentModel.__super__, "toJSON").and.callThrough();

                        actualValue = paymentModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(PaymentModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockPaymentModel);
                    });
                });
            });
        });
    });
