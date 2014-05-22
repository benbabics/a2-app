define(["utils", "globals", "Squire", "models/PaymentModel", "models/UserModel"],
    function (utils, globals, Squire, PaymentModel, UserModel) {
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
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
            },
            userModel = UserModel.getInstance(),
            PaymentCollection,
            paymentCollection;

        squire.mock("models/PaymentModel", PaymentModel);
        squire.mock("models/UserModel", UserModel);

        describe("A Payment Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/PaymentCollection"], function (JasminePaymentCollection) {
                    userModel.initialize(mockUserModel);

                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    PaymentCollection = JasminePaymentCollection;
                    paymentCollection = new PaymentCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(paymentCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(paymentCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(paymentCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should model to PaymentModel", function () {
                    expect(paymentCollection.model).toEqual(PaymentModel);
                });

                it("should default pageNumber", function () {
                    expect(paymentCollection.pageNumber).toEqual(globals.paymentSearch.constants.DEFAULT_PAGE_NUMBER);
                });

                it("should default pageSize", function () {
                    expect(paymentCollection.pageSize).toEqual(globals.paymentSearch.constants.DEFAULT_PAGE_SIZE);
                });
            });

            describe("has a url function that", function () {
                it("is defined", function () {
                    expect(paymentCollection.url).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentCollection.url).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL +
                            "/" +
                            mockUserModel.selectedCompany.accountId +
                            globals.WEBSERVICE.PAYMENTS_PATH,
                        actualResult = paymentCollection.url();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has a fetch function that", function () {
                beforeEach(function () {
                    paymentCollection.pageSize = 13465;
                    paymentCollection.totalResults = 13461546;

                    spyOn(PaymentCollection.__super__, "fetch").and.callFake(function () { });

                    paymentCollection.fetch();
                });

                it("is defined", function () {
                    expect(paymentCollection.fetch).toBeDefined();
                });

                it("is a function", function () {
                    expect(paymentCollection.fetch).toEqual(jasmine.any(Function));
                });

                it("should call super", function () {
                    var expectedOptions = {};
                    expectedOptions.pageSize = paymentCollection.pageSize;
                    expectedOptions.pageNumber = paymentCollection.pageNumber;

                    expect(PaymentCollection.__super__.fetch).toHaveBeenCalledWith(expectedOptions);
                });
            });
        });
    });
