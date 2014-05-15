define(["utils", "globals", "Squire", "models/BankAccountModel", "models/UserModel"],
    function (utils, globals, Squire, BankAccountModel, UserModel) {
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
            BankAccountCollection,
            bankAccountCollection;

        squire.mock("models/BankAccountModel", BankAccountModel);
        squire.mock("models/UserModel", UserModel);

        describe("A Bank Account Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/BankAccountCollection"], function (JasmineBankAccountCollection) {
                    userModel.initialize(mockUserModel);

                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    BankAccountCollection = JasmineBankAccountCollection;
                    bankAccountCollection = new BankAccountCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(bankAccountCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(bankAccountCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(bankAccountCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(bankAccountCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to BankAccountModel", function () {
                    expect(bankAccountCollection.model).toEqual(BankAccountModel);
                });
            });

            describe("has a fetch function that", function () {
                var mockOptions = {
                    "accountId"  : "157257276"
                };

                beforeEach(function () {
                    spyOn(BankAccountCollection.__super__, "fetch").and.callFake(function () { });

                    bankAccountCollection.fetch(mockOptions);
                });

                it("is defined", function () {
                    expect(bankAccountCollection.fetch).toBeDefined();
                });

                it("is a function", function () {
                    expect(bankAccountCollection.fetch).toEqual(jasmine.any(Function));
                });

                it("should set url", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL + "/" + mockOptions.accountId +
                        globals.WEBSERVICE.BANK_ACCOUNTS_PATH;
                    expect(bankAccountCollection.url).toEqual(expectedResult);
                });

                it("should call super", function () {
                    expect(BankAccountCollection.__super__.fetch).toHaveBeenCalledWith({});
                });
            });
        });
    });
