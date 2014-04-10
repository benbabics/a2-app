define(["Squire", "mustache", "globals", "utils", "models/UserModel", "backbone"],
    function (Squire, Mustache, globals, utils, UserModel, Backbone) {

        "use strict";

        var squire = new Squire(),
            mockUserModel = {
                authenticated: true,
                firstName: "Beavis",
                email: "cornholio@bnbinc.com",
                selectedCompany: {
                    name: "Beavis and Butthead Inc",
                    accountId: "3673683",
                    wexAccountNumber: "5764309",
                    driverIdLength: 4,
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
                    ]
                },
                permissions: [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ],
                requiredFields: [
                    "REQUIRED_FIELD_1",
                    "REQUIRED_FIELD_2",
                    "REQUIRED_FIELD_3"
                ]
            },
            userModel = UserModel.getInstance(),
            CardModel,
            cardModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/UserModel", UserModel);

        describe("A Driver Model", function () {
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

                it("should set number to default", function () {
                    expect(cardModel.defaults().number).toBeNull();
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

                    it("should set number", function () {
                        expect(cardModel.set).toHaveBeenCalledWith("number", options.number);
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
                        var actualValue = cardModel.toJSON();

                        expect(actualValue).toEqual(mockCard);
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
                        var actualValue = cardModel.toJSON();

                        expect(actualValue).toEqual(mockCard);
                    });
                });
            });
        });
    });
