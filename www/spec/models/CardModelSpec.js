define(["Squire", "mustache", "globals", "utils", "models/UserModel", "backbone"],
    function (Squire, Mustache, globals, utils, UserModel, Backbone) {

        "use strict";

        var squire = new Squire(),
            mockDataResponse = {
                successFlag: false,
                message: {
                    type: "",
                    text: ""
                }
            },
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
            CardModel,
            cardModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/UserModel", UserModel);

        describe("A Card Model", function () {
            beforeEach(function (done) {
                squire.require(["models/CardModel"], function (JasmineCardModel) {
                    CardModel = JasmineCardModel;

                    userModel.initialize(mockUserModel);
                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    cardModel = new CardModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(cardModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(cardModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a defaults function that", function () {
                it("is defined", function () {
                    expect(cardModel.defaults).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardModel.defaults).toEqual(jasmine.any(Function));
                });

                it("should set idAttribute to default", function () {
                    expect(cardModel.defaults().idAttribute).toEqual("number");
                });

                it("should set id to default", function () {
                    expect(cardModel.defaults().id).toBeNull();
                });

                it("should set authorizationProfileName to default", function () {
                    expect(cardModel.defaults().authorizationProfileName).toBeNull();
                });

                it("should set status to default", function () {
                    expect(cardModel.defaults().status).toBeNull();
                });

                it("should set department to default", function () {
                    expect(cardModel.defaults().department).toBeNull();
                });

                it("should set customVehicleId to default", function () {
                    expect(cardModel.defaults().customVehicleId).toBeNull();
                });

                it("should set vehicleDescription to default", function () {
                    expect(cardModel.defaults().vehicleDescription).toBeNull();
                });

                it("should set licensePlateNumber to default", function () {
                    expect(cardModel.defaults().licensePlateNumber).toBeNull();
                });

                it("should set licensePlateState to default", function () {
                    expect(cardModel.defaults().licensePlateState).toBeNull();
                });

                it("should set vin to default", function () {
                    expect(cardModel.defaults().vin).toBeNull();
                });
            });

            describe("has a urlRoot function that", function () {
                it("is defined", function () {
                    expect(cardModel.urlRoot).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardModel.urlRoot).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL +
                            "/" +
                            mockUserModel.selectedCompany.accountId +
                            globals.WEBSERVICE.CARD_PATH,
                        actualResult = cardModel.urlRoot();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has property validation that", function () {
                describe("has a validation configuration for the customVehicleId field that", function () {
                    it("has 3 validation rules", function () {
                        expect(cardModel.validation.customVehicleId.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        describe("should have a required function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.customVehicleId[0].required).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.customVehicleId[0].required).toEqual(jasmine.any(Function));
                            });

                            it("should return true if the user's company does have the COMPANY_VEHICLE_NUMBER required field",
                                function () {
                                    userModel.get("selectedCompany")
                                        .set("requiredFields", {"COMPANY_VEHICLE_NUMBER": true});

                                    expect(cardModel.validation.customVehicleId[0].required()).toBeTruthy();
                                });

                            it("should return false if the user's company does NOT have the COMPANY_VEHICLE_NUMBER required field",
                                function () {
                                    userModel.get("selectedCompany")
                                        .set("requiredFields", {"COMPANY_VEHICLE_NUMBER": false});

                                    expect(cardModel.validation.customVehicleId[0].required()).toBeFalsy();
                                });
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.customVehicleId[0].msg)
                                .toEqual(globals.card.constants.ERROR_CUSTOMER_VEHICLE_ID_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.customVehicleId[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.customVehicleId[1].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual length is less than the max length", function () {
                                it("should return the expected result", function () {
                                    expect(cardModel.validation.customVehicleId[1].fn("1234")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is equal to the max length", function () {
                                it("should return the expected result", function () {
                                    expect(cardModel.validation.customVehicleId[1].fn("12345")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is greater than to the max length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(
                                                globals.card.constants.ERROR_CUSTOMER_VEHICLE_ID_INVALID_LENGTH,
                                                {"maxLength": mockUserModel.selectedCompany.settings.cardSettings.customVehicleIdMaxLength}
                                            ),
                                        actualValue = cardModel.validation.customVehicleId[1].fn("123456");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(cardModel.validation.customVehicleId[2].pattern)
                                .toEqual(globals.APP.ALPHANUMERIC_WITH_SPACE_PATTERN);
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.customVehicleId[2].msg)
                                .toEqual(globals.card.constants.ERROR_CUSTOMER_VEHICLE_ID_INVALID_CHARACTERS);
                        });
                    });
                });

                describe("has a validation configuration for the vehicleDescription field that", function () {
                    it("has 3 validation rules", function () {
                        expect(cardModel.validation.vehicleDescription.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        describe("should have a required function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.vehicleDescription[0].required).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.vehicleDescription[0].required).toEqual(jasmine.any(Function));
                            });

                            it("should return true if the user's company does have the VEHICLE_DESCRIPTION required field",
                                function () {
                                    userModel.get("selectedCompany")
                                        .set("requiredFields", {"VEHICLE_DESCRIPTION": true});

                                    expect(cardModel.validation.vehicleDescription[0].required()).toBeTruthy();
                                });

                            it("should return false if the user's company does NOT have the VEHICLE_DESCRIPTION required field",
                                function () {
                                    userModel.get("selectedCompany")
                                        .set("requiredFields", {"VEHICLE_DESCRIPTION": false});

                                    expect(cardModel.validation.vehicleDescription[0].required()).toBeFalsy();
                                });
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.vehicleDescription[0].msg)
                                .toEqual(globals.card.constants.ERROR_VEHICLE_DESCRIPTION_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.vehicleDescription[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.vehicleDescription[1].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual length is less than the max length", function () {
                                it("should return the expected result", function () {
                                    expect(cardModel.validation.vehicleDescription[1].fn("12345")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is equal to the max length", function () {
                                it("should return the expected result", function () {
                                    expect(cardModel.validation.vehicleDescription[1].fn("123456")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is greater than to the max length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(
                                                globals.card.constants.ERROR_VEHICLE_DESCRIPTION_INVALID_LENGTH,
                                                {"maxLength": mockUserModel.selectedCompany.settings.cardSettings.vehicleDescriptionMaxLength}
                                            ),
                                        actualValue = cardModel.validation.vehicleDescription[1].fn("1234567");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(cardModel.validation.vehicleDescription[2].pattern)
                                .toEqual(globals.APP.ALPHANUMERIC_WITH_SPACE_PATTERN);
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.vehicleDescription[2].msg)
                                .toEqual(globals.card.constants.ERROR_VEHICLE_DESCRIPTION_INVALID_CHARACTERS);
                        });
                    });
                });

                describe("has a validation configuration for the vin field that", function () {
                    it("has 3 validation rules", function () {
                        expect(cardModel.validation.vin.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        describe("should have a required function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.vin[0].required).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.vin[0].required).toEqual(jasmine.any(Function));
                            });

                            it("should return true if the user's company does have the VIN_NUMBER required field",
                                function () {
                                    userModel.get("selectedCompany").set("requiredFields", {"VIN_NUMBER": true});

                                    expect(cardModel.validation.vin[0].required()).toBeTruthy();
                                });

                            it("should return false if the user's company does NOT have the VIN_NUMBER required field",
                                function () {
                                    userModel.get("selectedCompany").set("requiredFields", {"VIN_NUMBER": false});

                                    expect(cardModel.validation.vin[0].required()).toBeFalsy();
                                });
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.vin[0].msg)
                                .toEqual(globals.card.constants.ERROR_VIN_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.vin[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.vin[1].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the value is the correct length", function () {
                                it("should return the expected result", function () {
                                    expect(cardModel.validation.vin[1].fn("12345678901234567")).toBeUndefined();
                                });
                            });

                            describe("when the value is NOT the correct length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(globals.card.constants.ERROR_VIN_INVALID_LENGTH,
                                                {"fixedLength": mockUserModel.selectedCompany.settings.cardSettings.vinFixedLength}),
                                        actualValue = cardModel.validation.vin[1].fn("123");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(cardModel.validation.vin[2].pattern).toEqual(globals.APP.ALPHANUMERIC_PATTERN);
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.vin[2].msg)
                                .toEqual(globals.card.constants.ERROR_VIN_INVALID_CHARACTERS);
                        });
                    });
                });

                describe("has a validation configuration for the licensePlateNumber field that", function () {
                    it("has 3 validation rules", function () {
                        expect(cardModel.validation.licensePlateNumber.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        describe("should have a required function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.licensePlateNumber[0].required).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.licensePlateNumber[0].required).toEqual(jasmine.any(Function));
                            });

                            it("should return true if the user's company does have the LICENSE_PLATE_NUMBER required field",
                                function () {
                                    userModel.get("selectedCompany")
                                        .set("requiredFields", {"LICENSE_PLATE_NUMBER": true});

                                    expect(cardModel.validation.licensePlateNumber[0].required()).toBeTruthy();
                                });

                            it("should return false if the user's company does NOT have the LICENSE_PLATE_NUMBER required field",
                                function () {
                                    userModel.get("selectedCompany")
                                        .set("requiredFields", {"LICENSE_PLATE_NUMBER": false});

                                    expect(cardModel.validation.licensePlateNumber[0].required()).toBeFalsy();
                                });
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.licensePlateNumber[0].msg)
                                .toEqual(globals.card.constants.ERROR_LICENSE_PLATE_NUMBER_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(cardModel.validation.licensePlateNumber[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(cardModel.validation.licensePlateNumber[1].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual length is less than the max length", function () {
                                it("should return the expected result", function () {
                                    expect(cardModel.validation.licensePlateNumber[1].fn("123456")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is equal to the max length", function () {
                                it("should return the expected result", function () {
                                    expect(cardModel.validation.licensePlateNumber[1].fn("1234567")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is greater than to the max length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(
                                                globals.card.constants.ERROR_LICENSE_PLATE_NUMBER_INVALID_LENGTH,
                                                {"maxLength": mockUserModel.selectedCompany.settings.cardSettings.licensePlateNumberMaxLength}
                                            ),
                                        actualValue = cardModel.validation.licensePlateNumber[1].fn("12345678");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(cardModel.validation.licensePlateNumber[2].pattern)
                                .toEqual(globals.APP.ALPHANUMERIC_WITH_SPACE_PATTERN);
                        });

                        it("should set the error message", function () {
                            expect(cardModel.validation.licensePlateNumber[2].msg)
                                .toEqual(globals.card.constants.ERROR_LICENSE_PLATE_NUMBER_INVALID_CHARACTERS);
                        });
                    });
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(CardModel.__super__, "initialize").and.callThrough();
                    spyOn(cardModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(cardModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        cardModel.initialize();
                    });

                    it("should call initialize on super", function () {
                        expect(CardModel.__super__.initialize).toHaveBeenCalledWith();
                    });

                    it("should NOT call set", function () {
                        expect(cardModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        cardModel.initialize(options);
                    });

                    it("should call initialize on super", function () {
                        expect(CardModel.__super__.initialize).toHaveBeenCalledWith(options);
                    });

                    it("should NOT call set", function () {
                        expect(cardModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            number: 13465,
                            authorizationProfileName: "Auth Profile",
                            status: "Active",
                            department: {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            },
                            customVehicleId: "Custom Vehicle Id",
                            vehicleDescription: "Vehicle Description",
                            licensePlateNumber: "1234567",
                            licensePlateState: "ME",
                            vin: "12345678901234567"
                        };

                    beforeEach(function () {
                        cardModel.initialize(options);
                    });

                    it("should call initialize on super", function () {
                        expect(CardModel.__super__.initialize).toHaveBeenCalledWith(options);
                    });

                    it("should call set 9 times", function () {
                        expect(cardModel.set.calls.count()).toEqual(9);
                    });

                    it("should set id", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("id", options.number);
                    });

                    it("should set authorizationProfileName", function () {
                        expect(cardModel.set)
                            .toHaveBeenCalledWith("authorizationProfileName", options.authorizationProfileName);
                    });

                    it("should set status", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("status", options.status);
                    });

                    // TODO - Replace with something that verifies that a new DepartmentModel was created, the correct
                    // parameter was passed to the DepartmentModel.initialize function and then set to "department"
                    it("should set department", function () {
                        var actualDepartment;

                        expect(cardModel.set.calls.argsFor(3).length).toEqual(2);
                        expect(cardModel.set.calls.argsFor(3)[0]).toEqual("department");

                        actualDepartment = cardModel.set.calls.argsFor(3)[1];

                        expect(actualDepartment.get("id")).toEqual(options.department.id);
                        expect(actualDepartment.get("name")).toEqual(options.department.name);
                        expect(actualDepartment.get("visible")).toEqual(options.department.visible);
                    });

                    it("should set customVehicleId", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("customVehicleId", options.customVehicleId);
                    });

                    it("should set vehicleDescription", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("vehicleDescription", options.vehicleDescription);
                    });

                    it("should set licensePlateNumber", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("licensePlateNumber", options.licensePlateNumber);
                    });

                    it("should set licensePlateState", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("licensePlateState", options.licensePlateState);
                    });

                    it("should set vin", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("vin", options.vin);
                    });
                });
            });

            describe("has a sync function that", function () {
                var options = {
                    success: function () {}
                };

                beforeEach(function () {
                    spyOn(CardModel.__super__, "sync").and.callFake(function () {
                        var deferred = utils.Deferred();

                        deferred.resolve(mockDataResponse);
                        return deferred.promise();
                    });
                });

                it("is defined", function () {
                    expect(cardModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardModel.sync).toEqual(jasmine.any(Function));
                });

                describe("when the method is create", function () {
                    it("should call sync on super", function () {
                        cardModel.sync("create", cardModel.toJSON(), options);

                        expect(CardModel.__super__.sync)
                            .toHaveBeenCalledWith("create", cardModel.toJSON(), options);
                    });
                });

                describe("when the method is read", function () {
                    it("should call sync on super", function () {
                        cardModel.sync("read", cardModel.toJSON(), options);

                        expect(CardModel.__super__.sync).toHaveBeenCalledWith("read", cardModel.toJSON(), options);
                    });
                });

                describe("when the method is patch", function () {
                    it("should call sync on super", function () {
                        var expectedOptions = utils._.extend({type: "POST"}, utils.deepClone(options));

                        cardModel.sync("patch", cardModel.toJSON(), options);

                        expect(CardModel.__super__.sync)
                            .toHaveBeenCalledWith("patch", cardModel.toJSON(), expectedOptions);
                    });
                });

                describe("when the method is update", function () {
                    it("should call sync on super", function () {
                        cardModel.sync("update", cardModel.toJSON(), options);

                        expect(CardModel.__super__.sync)
                            .toHaveBeenCalledWith("update", cardModel.toJSON(), options);
                    });
                });

                describe("when the method is delete", function () {
                    it("should call sync on super", function () {
                        cardModel.sync("delete", cardModel.toJSON(), options);

                        expect(CardModel.__super__.sync)
                            .toHaveBeenCalledWith("delete", cardModel.toJSON(), options);
                    });
                });
            });

            describe("has a terminate function that", function () {
                var mockUrlRoot = "mock url root",
                    mockCardNumber = 5678,
                    mockValues = {
                        "firstName"   : "Curly",
                        "middleName"  : "G",
                        "lastName"    : "Howard",
                        "id"          : 132456,
                        "status"      : "ACTIVE",
                        department : {
                            id: "2456724567",
                            name: "Dewey, Cheetum and Howe",
                            visible: true
                        }
                    },
                    options = {
                        success: function () {}
                    };

                beforeEach(function () {
                    cardModel.set("id", mockCardNumber);
                    spyOn(cardModel, "save").and.callFake(function () {});
                    spyOn(cardModel, "urlRoot").and.returnValue(mockUrlRoot);

                    cardModel.initialize(mockValues);
                    cardModel.terminate(options);
                });

                it("is defined", function () {
                    expect(cardModel.terminate).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardModel.terminate).toEqual(jasmine.any(Function));
                });

                it("should set url", function () {
                    var expectedValue = mockUrlRoot + "/" + mockCardNumber + globals.WEBSERVICE.CARDS.TERMINATE_PATH;
                    expect(cardModel.url).toEqual(expectedValue);
                });

                it("should call save", function () {
                    var expectedOptions = utils._.extend({patch: true}, utils.deepClone(options));

                    expect(cardModel.save).toHaveBeenCalledWith({}, expectedOptions);
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(cardModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when department does have a value", function () {
                    var department,
                        mockCard = {
                            number: 13465,
                            authorizationProfileName: "Auth Profile",
                            status: "Active",
                            department: {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            },
                            customVehicleId: "Custom Vehicle Id",
                            vehicleDescription: "Vehicle Description",
                            licensePlateNumber: "1234567",
                            licensePlateState: "ME",
                            vin: "12345678901234567"
                        };

                    beforeEach(function () {
                        cardModel.clear();
                        cardModel.initialize(mockCard);
                        department = cardModel.get("department");

                        spyOn(department, "toJSON").and.callThrough();
                        spyOn(CardModel.__super__, "toJSON").and.callThrough();

                        cardModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CardModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on department", function () {
                        expect(department.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        var actualValue = cardModel.toJSON(),
                            expectedValue = {
                                id: mockCard.number,
                                authorizationProfileName: mockCard.authorizationProfileName,
                                status: mockCard.status,
                                department: mockCard.department,
                                customVehicleId: mockCard.customVehicleId,
                                vehicleDescription: mockCard.vehicleDescription,
                                licensePlateNumber: mockCard.licensePlateNumber,
                                licensePlateState: mockCard.licensePlateState,
                                vin: mockCard.vin
                            };

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when department does NOT have a value", function () {
                    var mockCard = {
                            number: 13465,
                            authorizationProfileName: "Auth Profile",
                            status: "Active",
                            customVehicleId: "Custom Vehicle Id",
                            vehicleDescription: "Vehicle Description",
                            licensePlateNumber: "1234567",
                            licensePlateState: "ME",
                            vin: "12345678901234567"
                        };

                    beforeEach(function () {
                        cardModel.clear();
                        cardModel.initialize(mockCard);

                        spyOn(CardModel.__super__, "toJSON").and.callThrough();

                        cardModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CardModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        var actualValue = cardModel.toJSON(),
                            expectedValue = {
                                id: mockCard.number,
                                authorizationProfileName: mockCard.authorizationProfileName,
                                status: mockCard.status,
                                customVehicleId: mockCard.customVehicleId,
                                vehicleDescription: mockCard.vehicleDescription,
                                licensePlateNumber: mockCard.licensePlateNumber,
                                licensePlateState: mockCard.licensePlateState,
                                vin: mockCard.vin
                            };

                        expect(actualValue).toEqual(expectedValue);
                    });
                });
            });
        });
    });
