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
                    },
                    permissions: [
                        "PERMISSION_1",
                        "PERMISSION_2",
                        "PERMISSION_3"
                    ]
                }
            },
            userModel = UserModel.getInstance(),
            makePaymentAvailabilityModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/UserModel", UserModel);

        describe("A Make Payment Availability Model", function () {
            beforeEach(function (done) {
                squire.require(["models/MakePaymentAvailabilityModel"], function (MakePaymentAvailabilityModel) {
                    userModel.parse(mockUserModel);
                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    makePaymentAvailabilityModel = new MakePaymentAvailabilityModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(makePaymentAvailabilityModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(makePaymentAvailabilityModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a defaults function that", function () {
                it("is defined", function () {
                    expect(makePaymentAvailabilityModel.defaults).toBeDefined();
                });

                it("is a function", function () {
                    expect(makePaymentAvailabilityModel.defaults).toEqual(jasmine.any(Function));
                });

                it("should set shouldDisplayDirectDebitEnabledMessage to default", function () {
                    expect(makePaymentAvailabilityModel.defaults().shouldDisplayDirectDebitEnabledMessage).toBeFalsy();
                });

                it("should set shouldDisplayBankAccountSetupMessage to default", function () {
                    expect(makePaymentAvailabilityModel.defaults().shouldDisplayBankAccountSetupMessage).toBeFalsy();
                });

                it("should set shouldDisplayOutstandingPaymentMessage to default", function () {
                    expect(makePaymentAvailabilityModel.defaults().shouldDisplayOutstandingPaymentMessage).toBeFalsy();
                });

                it("should set makePaymentAllowed to default", function () {
                    expect(makePaymentAvailabilityModel.defaults().makePaymentAllowed).toBeFalsy();
                });
            });

            describe("has a urlRoot function that", function () {
                it("is defined", function () {
                    expect(makePaymentAvailabilityModel.urlRoot).toBeDefined();
                });

                it("is a function", function () {
                    expect(makePaymentAvailabilityModel.urlRoot).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL +
                            "/" +
                            mockUserModel.selectedCompany.accountId +
                            globals.WEBSERVICE.MAKE_PAYMENT_AVAILABILITY_PATH,
                        actualResult = makePaymentAvailabilityModel.urlRoot();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(makePaymentAvailabilityModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(makePaymentAvailabilityModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(makePaymentAvailabilityModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        makePaymentAvailabilityModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(makePaymentAvailabilityModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        makePaymentAvailabilityModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(makePaymentAvailabilityModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "shouldDisplayDirectDebitEnabledMessage": true,
                        "shouldDisplayBankAccountSetupMessage"  : true,
                        "shouldDisplayOutstandingPaymentMessage": true,
                        "makePaymentAllowed"                    : true
                    };

                    beforeEach(function () {
                        makePaymentAvailabilityModel.initialize(options);
                    });

                    it("should call set 4 times", function () {
                        expect(makePaymentAvailabilityModel.set.calls.count()).toEqual(4);
                    });

                    it("should set shouldDisplayDirectDebitEnabledMessage", function () {
                        expect(makePaymentAvailabilityModel.set)
                            .toHaveBeenCalledWith("shouldDisplayDirectDebitEnabledMessage",
                                                  options.shouldDisplayDirectDebitEnabledMessage);
                    });

                    it("should set shouldDisplayBankAccountSetupMessage", function () {
                        expect(makePaymentAvailabilityModel.set)
                            .toHaveBeenCalledWith("shouldDisplayBankAccountSetupMessage",
                                                  options.shouldDisplayBankAccountSetupMessage);
                    });

                    it("should set shouldDisplayOutstandingPaymentMessage", function () {
                        expect(makePaymentAvailabilityModel.set)
                            .toHaveBeenCalledWith("shouldDisplayOutstandingPaymentMessage",
                                                  options.shouldDisplayOutstandingPaymentMessage);
                    });

                    it("should set makePaymentAllowed", function () {
                        expect(makePaymentAvailabilityModel.set)
                            .toHaveBeenCalledWith("makePaymentAllowed", options.makePaymentAllowed);
                    });
                });
            });
        });
    });
