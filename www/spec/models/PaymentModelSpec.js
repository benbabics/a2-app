define(["Squire", "utils", "globals", "backbone", "models/UserModel"],
    function (Squire, utils, globals, Backbone, UserModel) {

        "use strict";

        var squire = new Squire(),
            mockDataResponse = {
                successFlag: false,
                message: {
                    type: "",
                    text: ""
                }
            },
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
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
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
                    userModel.parse(mockUserModel);
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

                it("should set paymentDueDate to default", function () {
                    expect(paymentModel.defaults().paymentDueDate).toBeNull();
                });

                it("should set minimumPaymentDue to default", function () {
                    expect(paymentModel.defaults().minimumPaymentDue).toBeNull();
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

            describe("has property validation that", function () {
                describe("has a validation configuration for the scheduledDate field that", function () {
                    it("has 3 validation rules", function () {
                        expect(paymentModel.validation.scheduledDate.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(paymentModel.validation.scheduledDate[0].required).toBeTruthy();
                        });

                        it("should set the error message", function () {
                            expect(paymentModel.validation.scheduledDate[0].msg)
                                .toEqual(globals.payment.constants.ERROR_SCHEDULED_DATE_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        it("should set the pattern", function () {
                            expect(paymentModel.validation.scheduledDate[1].pattern)
                                .toEqual(globals.APP.DATE_PATTERN);
                        });

                        it("should set the error message", function () {
                            expect(paymentModel.validation.scheduledDate[1].msg)
                                .toEqual(globals.payment.constants.ERROR_SCHEDULED_DATE_MUST_BE_A_DATE);
                        });
                    });

                    describe("the third validation rule", function () {
                        describe("should have a fn function that", function () {
                            var today = utils.moment().startOf("day").format("MM/DD/YYYY"),
                                yesterday = utils.moment().add("days", -1).format("MM/DD/YYYY"),
                                tomorrow = utils.moment().add("days", 1).format("MM/DD/YYYY"),
                                dayAfterTomorrow = utils.moment().add("days", 2).format("MM/DD/YYYY");

                            it("is defined", function () {
                                expect(paymentModel.validation.scheduledDate[2].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(paymentModel.validation.scheduledDate[2].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual value is before today", function () {
                                it("should return the expected result", function () {
                                    expect(paymentModel.validation.scheduledDate[2].fn
                                        .call(paymentModel, yesterday))
                                        .toEqual(globals.payment.constants.ERROR_SCHEDULED_DATE_BEFORE_TODAY);
                                });
                            });

                            describe("when the actual value is today and before the payment due date", function () {
                                it("should return the expected result", function () {
                                    paymentModel.set("paymentDueDate", tomorrow);

                                    expect(paymentModel.validation.scheduledDate[2].fn
                                        .call(paymentModel, today)).toBeUndefined();
                                });
                            });

                            describe("when the actual value is today and equal to the payment due date", function () {
                                it("should return the expected result", function () {
                                    paymentModel.set("paymentDueDate", today);

                                    expect(paymentModel.validation.scheduledDate[2].fn
                                        .call(paymentModel, today)).toBeUndefined();
                                });
                            });

                            describe("when the actual value is today and after the payment due date", function () {
                                it("should return the expected result", function () {
                                    paymentModel.set("paymentDueDate", yesterday);

                                    expect(paymentModel.validation.scheduledDate[2].fn
                                        .call(paymentModel, today)).toBeUndefined();
                                });
                            });

                            describe("when the actual value after today and before the payment due date", function () {
                                it("should return the expected result", function () {
                                    paymentModel.set("paymentDueDate", dayAfterTomorrow);

                                    expect(paymentModel.validation.scheduledDate[2].fn
                                        .call(paymentModel, tomorrow)).toBeUndefined();
                                });
                            });

                            describe("when the actual value after today and equal to payment due date", function () {
                                it("should return the expected result", function () {
                                    paymentModel.set("paymentDueDate", tomorrow);

                                    expect(paymentModel.validation.scheduledDate[2].fn
                                        .call(paymentModel, tomorrow)).toBeUndefined();
                                });
                            });

                            describe("when the actual value after today and after the payment due date", function () {
                                it("should return the expected result", function () {
                                    paymentModel.set("paymentDueDate", today);

                                    expect(paymentModel.validation.scheduledDate[2].fn.call(paymentModel, tomorrow))
                                        .toEqual(globals.payment.constants.ERROR_SCHEDULED_DATE_AFTER_DUE_DATE);
                                });
                            });
                        });
                    });
                });

                describe("has a validation configuration for the amount field that", function () {
                    it("has 3 validation rules", function () {
                        expect(paymentModel.validation.amount.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(paymentModel.validation.amount[0].required).toBeTruthy();
                        });

                        it("should set the error message", function () {
                            expect(paymentModel.validation.amount[0].msg)
                                .toEqual(globals.payment.constants.ERROR_AMOUNT_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        it("should set the pattern", function () {
                            expect(paymentModel.validation.amount[1].pattern)
                                .toEqual(globals.APP.NUMBER_PATTERN);
                        });

                        it("should set the error message", function () {
                            expect(paymentModel.validation.amount[1].msg)
                                .toEqual(globals.payment.constants.ERROR_AMOUNT_MUST_BE_NUMERIC);
                        });
                    });

                    describe("the third validation rule", function () {
                        var minimumPaymentDue = 234.56;

                        beforeEach(function () {
                            paymentModel.set("minimumPaymentDue", minimumPaymentDue);
                        });

                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(paymentModel.validation.amount[2].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(paymentModel.validation.amount[2].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual value is greater than the minimum payment due", function () {
                                it("should return the expected result", function () {
                                    expect(paymentModel.validation.amount[2].fn
                                        .call(paymentModel, minimumPaymentDue + 1)).toBeUndefined();
                                });
                            });

                            describe("when the actual value is equal to the minimum payment due", function () {
                                it("should return the expected result", function () {
                                    expect(paymentModel.validation.amount[2].fn
                                        .call(paymentModel, minimumPaymentDue)).toBeUndefined();
                                });
                            });

                            describe("when the actual value is less than to the minimum payment due", function () {
                                it("should return the expected result", function () {
                                    var actualValue = paymentModel.validation.amount[2].fn
                                        .call(paymentModel, minimumPaymentDue - 1);

                                    expect(actualValue)
                                        .toEqual(globals.payment.constants.ERROR_AMOUNT_LESS_THAN_PAYMENT_DUE);
                                });
                            });
                        });
                    });
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
                        "confirmationNumber": "13451dvfgwdrfg23456",
                        "paymentDueDate"    : "5/14/2014",
                        "minimumPaymentDue" : 234.45
                    };

                    beforeEach(function () {
                        paymentModel.initialize(options);
                    });

                    it("should call set 8 times", function () {
                        expect(paymentModel.set.calls.count()).toEqual(8);
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

                    it("should set paymentDueDate", function () {
                        expect(paymentModel.set).toHaveBeenCalledWith("paymentDueDate", options.paymentDueDate);
                    });

                    it("should set minimumPaymentDue", function () {
                        expect(paymentModel.set).toHaveBeenCalledWith("minimumPaymentDue", options.minimumPaymentDue);
                    });
                });
            });

            describe("has a sync function that", function () {
                var options = {
                    success: function () {}
                };

                beforeEach(function () {
                    spyOn(PaymentModel.__super__, "sync").and.callFake(function () {
                        var deferred = utils.Deferred();

                        deferred.resolve(mockDataResponse);
                        return deferred.promise();
                    });
                });

                it("is defined", function () {
                    expect(paymentModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentModel.sync).toEqual(jasmine.any(Function));
                });

                describe("when the method is create", function () {
                    it("should call sync on super", function () {
                        paymentModel.sync("create", paymentModel.toJSON(), options);

                        expect(PaymentModel.__super__.sync)
                            .toHaveBeenCalledWith("create", paymentModel.toJSON(), options);
                    });
                });

                describe("when the method is read", function () {
                    it("should call sync on super", function () {
                        paymentModel.sync("read", paymentModel.toJSON(), options);

                        expect(PaymentModel.__super__.sync)
                            .toHaveBeenCalledWith("read", paymentModel.toJSON(), options);
                    });
                });

                describe("when the method is patch", function () {
                    it("should call sync on super", function () {
                        var expectedOptions = utils._.extend({type: "POST"}, utils.deepClone(options));

                        paymentModel.sync("patch", paymentModel.toJSON(), options);

                        expect(PaymentModel.__super__.sync)
                            .toHaveBeenCalledWith("patch", paymentModel.toJSON(), expectedOptions);
                    });
                });

                describe("when the method is update", function () {
                    it("should call sync on super", function () {
                        paymentModel.sync("update", paymentModel.toJSON(), options);

                        expect(PaymentModel.__super__.sync)
                            .toHaveBeenCalledWith("update", paymentModel.toJSON(), options);
                    });
                });

                describe("when the method is delete", function () {
                    it("should call sync on super", function () {
                        paymentModel.sync("delete", paymentModel.toJSON(), options);

                        expect(PaymentModel.__super__.sync)
                            .toHaveBeenCalledWith("delete", paymentModel.toJSON(), options);
                    });
                });
            });

            describe("has an add function that", function () {
                var mockUrlRoot = "mock url root",
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
                    options = {
                        success: function () {}
                    };

                beforeEach(function () {
                    spyOn(paymentModel, "set").and.callThrough();
                    spyOn(paymentModel, "save").and.callFake(function () {});
                    spyOn(paymentModel, "urlRoot").and.returnValue(mockUrlRoot);

                    paymentModel.initialize(mockPaymentModel);
                    paymentModel.url = null;
                    paymentModel.add(options);
                });

                it("is defined", function () {
                    expect(paymentModel.add).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentModel.add).toEqual(jasmine.any(Function));
                });

                it("should set id", function () {
                    expect(paymentModel.set).toHaveBeenCalledWith("id", 1);
                });

                it("should set url", function () {
                    expect(paymentModel.url).toEqual(mockUrlRoot);
                });

                it("should call save", function () {
                    var expectedOptions = utils._.extend({patch: true}, utils.deepClone(options)),
                        expectedAttributes = {
                            "scheduledDate": mockPaymentModel.scheduledDate,
                            "amount"       : mockPaymentModel.amount,
                            "bankAccountId": mockPaymentModel.bankAccount.id
                        };

                    expect(paymentModel.save).toHaveBeenCalledWith(expectedAttributes, expectedOptions);
                });
            });

            describe("has an edit function that", function () {
                var mockPaymentModel = {
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
                    options = {
                        success: function () {}
                    };

                beforeEach(function () {
                    spyOn(paymentModel, "save").and.callFake(function () {});

                    paymentModel.initialize(mockPaymentModel);
                    paymentModel.edit(options);
                });

                it("is defined", function () {
                    expect(paymentModel.edit).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentModel.edit).toEqual(jasmine.any(Function));
                });

                it("should call save", function () {
                    var expectedOptions = utils._.extend({patch: true}, utils.deepClone(options)),
                        expectedAttributes = {
                            "scheduledDate": mockPaymentModel.scheduledDate,
                            "amount"       : mockPaymentModel.amount,
                            "bankAccountId": mockPaymentModel.bankAccount.id
                        };

                    expect(paymentModel.save).toHaveBeenCalledWith(expectedAttributes, expectedOptions);
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
