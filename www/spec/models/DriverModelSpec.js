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
            DriverModel,
            driverModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/UserModel", UserModel);

        describe("A Driver Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverModel"], function (JasmineDriverModel) {
                    DriverModel = JasmineDriverModel;

                    userModel.initialize(mockUserModel);
                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    driverModel = new DriverModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(driverModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a defaults function that", function () {
                it("is defined", function () {
                    expect(driverModel.defaults).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.defaults).toEqual(jasmine.any(Function));
                });

                it("should set id to default", function () {
                    expect(driverModel.defaults().id).toBeNull();
                });

                it("should set firstName to default", function () {
                    expect(driverModel.defaults().firstName).toBeNull();
                });

                it("should set middleName to default", function () {
                    expect(driverModel.defaults().middleName).toBeNull();
                });

                it("should set lastName to default", function () {
                    expect(driverModel.defaults().lastName).toBeNull();
                });

                it("should set status to default", function () {
                    expect(driverModel.defaults().status).toBeNull();
                });

                it("should set statusDate to default", function () {
                    expect(driverModel.defaults().statusDate).toBeNull();
                });

                it("should set department to default", function () {
                    expect(driverModel.defaults().department).toBeNull();
                });

                it("should set formattedName to default", function () {
                    expect(driverModel.defaults().formattedName).toBeNull();
                });
            });

            describe("has a urlRoot function that", function () {
                it("is defined", function () {
                    expect(driverModel.urlRoot).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.urlRoot).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL +
                            "/" +
                            mockUserModel.selectedCompany.accountId +
                            globals.WEBSERVICE.DRIVER_PATH,
                        actualResult = driverModel.urlRoot();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has property validation that", function () {
                describe("has a validation configuration for the id field that", function () {
                    it("has 3 validation rules", function () {
                        expect(driverModel.validation.id.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        describe("should have a required function that", function () {
                            it("is defined", function () {
                                expect(driverModel.validation.id[0].required).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(driverModel.validation.id[0].required).toEqual(jasmine.any(Function));
                            });

                            it("should return true if the user's company does have the DRIVER_ID required field",
                                function () {
                                    userModel.get("selectedCompany").set("requiredFields", {"DRIVER_ID": true});

                                    expect(driverModel.validation.id[0].required()).toBeTruthy();
                                });

                            it("should return false if the user's company does NOT have the DRIVER_ID required field",
                                function () {
                                    userModel.get("selectedCompany").set("requiredFields", {"DRIVER_ID": false});

                                    expect(driverModel.validation.id[0].required()).toBeFalsy();
                                });
                        });

                        it("should set the error message", function () {
                            expect(driverModel.validation.id[0].msg)
                                .toEqual(globals.driver.constants.ERROR_DRIVER_ID_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(driverModel.validation.id[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(driverModel.validation.id[1].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the value is the correct length", function () {
                                it("should return the expected result", function () {
                                    expect(driverModel.validation.id[1].fn("1234")).toBeUndefined();
                                });
                            });

                            describe("when the value is NOT the correct length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(globals.driver.constants.ERROR_DRIVER_ID_INVALID_LENGTH,
                                                {"idFixedLength": mockUserModel.selectedCompany.settings.driverSettings.idFixedLength}),
                                        actualValue = driverModel.validation.id[1].fn("123");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(driverModel.validation.id[2].pattern).toEqual("digits");
                        });

                        it("should set the error message", function () {
                            expect(driverModel.validation.id[2].msg)
                                .toEqual(globals.driver.constants.ERROR_DRIVER_ID_INVALID_FORMAT);
                        });
                    });
                });

                describe("has a validation configuration for the firstName field that", function () {
                    it("has 3 validation rules", function () {
                        expect(driverModel.validation.firstName.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(driverModel.validation.firstName[0].required).toBeTruthy();
                        });

                        it("should set the error message", function () {
                            expect(driverModel.validation.firstName[0].msg)
                                .toEqual(globals.driver.constants.ERROR_FIRST_NAME_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(driverModel.validation.firstName[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(driverModel.validation.firstName[1].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual length is less than the max length", function () {
                                it("should return the expected result", function () {
                                    expect(driverModel.validation.firstName[1].fn("1234")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is equal to the max length", function () {
                                it("should return the expected result", function () {
                                    expect(driverModel.validation.firstName[1].fn("12345678901")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is greater than to the max length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(globals.driver.constants.ERROR_FIRST_NAME_INVALID_LENGTH,
                                                {"firstNameMaxLength": mockUserModel.selectedCompany.settings.driverSettings.firstNameMaxLength}),
                                        actualValue = driverModel.validation.firstName[1].fn("123456789012");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(driverModel.validation.firstName[2].pattern)
                                .toEqual(/^[A-Z\d`~&_\-+{}|:',.\/]+$/i);
                        });

                        it("should set the error message", function () {
                            expect(driverModel.validation.firstName[2].msg)
                                .toEqual(globals.driver.constants.ERROR_FIRST_NAME_INVALID_CHARACTERS);
                        });
                    });
                });

                describe("has a validation configuration for the middleName field that", function () {
                    it("has 2 validation rules", function () {
                        expect(driverModel.validation.middleName.length).toEqual(2);
                    });

                    describe("the first validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(driverModel.validation.middleName[0].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(driverModel.validation.middleName[0].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual length is less than the max length", function () {
                                it("should return the expected result", function () {
                                    expect(driverModel.validation.middleName[0].fn("")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is equal to the max length", function () {
                                it("should return the expected result", function () {
                                    expect(driverModel.validation.middleName[0].fn("1")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is greater than to the max length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(globals.driver.constants.ERROR_MIDDLE_NAME_INVALID_LENGTH,
                                                {"middleNameMaxLength": mockUserModel.selectedCompany.settings.driverSettings.middleNameMaxLength}),
                                        actualValue = driverModel.validation.middleName[0].fn("12");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the second validation rule", function () {
                        it("should set the field as NOT required", function () {
                            expect(driverModel.validation.middleName[1].required).toBeFalsy();
                        });

                        it("should set the pattern", function () {
                            expect(driverModel.validation.middleName[1].pattern).toEqual(/^[A-Z]+$/i);
                        });

                        it("should set the error message", function () {
                            expect(driverModel.validation.middleName[1].msg)
                                .toEqual(globals.driver.constants.ERROR_MIDDLE_NAME_INVALID_CHARACTERS);
                        });
                    });
                });

                describe("has a validation configuration for the lastName field that", function () {
                    it("has 3 validation rules", function () {
                        expect(driverModel.validation.lastName.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(driverModel.validation.lastName[0].required).toBeTruthy();
                        });

                        it("should set the error message", function () {
                            expect(driverModel.validation.lastName[0].msg)
                                .toEqual(globals.driver.constants.ERROR_LAST_NAME_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        describe("should have a fn function that", function () {
                            it("is defined", function () {
                                expect(driverModel.validation.lastName[1].fn).toBeDefined();
                            });

                            it("is a function", function () {
                                expect(driverModel.validation.lastName[1].fn).toEqual(jasmine.any(Function));
                            });

                            describe("when the actual length is less than the max length", function () {
                                it("should return the expected result", function () {
                                    expect(driverModel.validation.lastName[1].fn("1234")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is equal to the max length", function () {
                                it("should return the expected result", function () {
                                    expect(driverModel.validation.lastName[1].fn("123456789012")).toBeUndefined();
                                });
                            });

                            describe("when the actual length is greater than to the max length", function () {
                                it("should return the expected result", function () {
                                    var expectedValue =
                                            Mustache.render(globals.driver.constants.ERROR_LAST_NAME_INVALID_LENGTH,
                                                {"lastNameMaxLength": mockUserModel.selectedCompany.settings.driverSettings.lastNameMaxLength}),
                                        actualValue = driverModel.validation.lastName[1].fn("1234567890123");

                                    expect(actualValue).toEqual(expectedValue);
                                });
                            });
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(driverModel.validation.lastName[2].pattern)
                                .toEqual(/^[A-Z\d`~&_\-+{}|:',.\/]+$/i);
                        });

                        it("should set the error message", function () {
                            expect(driverModel.validation.lastName[2].msg)
                                .toEqual(globals.driver.constants.ERROR_LAST_NAME_INVALID_CHARACTERS);
                        });
                    });
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(DriverModel.__super__, "initialize").and.callThrough();
                    spyOn(driverModel, "set").and.callThrough();
                    spyOn(driverModel, "formatAttributes").and.callFake(function () {});
                });

                it("is defined", function () {
                    expect(driverModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        driverModel.initialize();
                    });

                    it("should call initialize on super", function () {
                        expect(DriverModel.__super__.initialize).toHaveBeenCalledWith();
                    });

                    it("should NOT call set", function () {
                        expect(driverModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        driverModel.initialize(options);
                    });

                    it("should call initialize on super", function () {
                        expect(DriverModel.__super__.initialize).toHaveBeenCalledWith(options);
                    });

                    it("should NOT call set", function () {
                        expect(driverModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            id: 13465134561,
                            firstName: "First Name",
                            middleName: "Middle Name",
                            lastName: "Last Name",
                            status: "Active",
                            statusDate: "3/14/2015",
                            department: {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            }
                        };

                    beforeEach(function () {
                        driverModel.initialize(options);
                    });

                    it("should call initialize on super", function () {
                        expect(DriverModel.__super__.initialize).toHaveBeenCalledWith(options);
                    });

                    it("should call set 7 times", function () {
                        expect(driverModel.set.calls.count()).toEqual(7);
                    });

                    it("should set id", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("id", options.id);
                    });

                    it("should set firstName", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set middleName", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("middleName", options.middleName);
                    });

                    it("should set lastName", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("lastName", options.lastName);
                    });

                    it("should set status", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("status", options.status);
                    });

                    it("should set statusDate", function () {
                        expect(driverModel.set).toHaveBeenCalledWith("statusDate", options.statusDate);
                    });

                    // TODO - Replace with something that verifies that a new DepartmentModel was created, the correct
                    // parameter was passed to the DepartmentModel.initialize function and then set to "department"
                    it("should set department", function () {
                        var actualDepartment;

                        expect(driverModel.set.calls.argsFor(6).length).toEqual(2);
                        expect(driverModel.set.calls.argsFor(6)[0]).toEqual("department");

                        actualDepartment = driverModel.set.calls.argsFor(6)[1];

                        expect(actualDepartment.get("id")).toEqual(options.department.id);
                        expect(actualDepartment.get("name")).toEqual(options.department.name);
                        expect(actualDepartment.get("visible")).toEqual(options.department.visible);
                    });
                });

                it("should call formatAttributes", function () {
                    driverModel.initialize();
                    expect(driverModel.formatAttributes).toHaveBeenCalledWith();
                });
            });

            describe("has a formatAttributes function that", function () {
                beforeEach(function () {
                    // re-initialize the model
                    driverModel.set(driverModel.defaults);

                    spyOn(driverModel, "set").and.callThrough();

                    driverModel.formatAttributes();
                });

                it("is defined", function () {
                    expect(driverModel.formatAttributes).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.formatAttributes).toEqual(jasmine.any(Function));
                });

                it("should call set 1 time", function () {
                    expect(driverModel.set.calls.count()).toEqual(1);
                });

                it("should set formattedName", function () {
                    expect(driverModel.set).toHaveBeenCalledWith("formattedName", jasmine.any(Function));
                });

                describe("when calling the callback function", function () {
                    var callback,
                        actualResult,
                        expectedResult,
                        first = "First",
                        middle = "Middle",
                        last = "Last";

                    beforeEach(function () {
                        driverModel.formatAttributes();
                        callback = driverModel.set.calls.mostRecent().args[1];
                    });

                    describe("when first, middle and last names all have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", last);

                            expectedResult = last + ", " + first + " " + middle;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first name does not have a value", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", last);

                            expectedResult = last;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when middle name does not have a value", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", last);

                            expectedResult = last + ", " + first;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when last name does not have a value", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", null);

                            expectedResult = first + " " + middle;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first and middle names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", last);

                            expectedResult = last;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first and last names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", middle);
                            driverModel.set("lastName", null);

                            expectedResult = "";
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when middle and last names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", first);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", null);

                            expectedResult = first;
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when first, middle and last names do not have values", function () {
                        it("should match expected result", function () {
                            driverModel.set("firstName", null);
                            driverModel.set("middleName", null);
                            driverModel.set("lastName", null);

                            expectedResult = "";
                            actualResult = callback.call(driverModel.toJSON());
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });
                });
            });

            describe("has a sync function that", function () {
                var options = {
                        success: function () {}
                    };

                beforeEach(function () {
                    spyOn(DriverModel.__super__, "sync").and.callFake(function () {
                        var deferred = utils.Deferred();

                        deferred.resolve(mockDataResponse);
                        return deferred.promise();
                    });
                });

                it("is defined", function () {
                    expect(driverModel.sync).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.sync).toEqual(jasmine.any(Function));
                });

                describe("when the method is create", function () {
                    it("should call sync on super", function () {
                        driverModel.sync("create", driverModel.toJSON(), options);

                        expect(DriverModel.__super__.sync)
                            .toHaveBeenCalledWith("create", driverModel.toJSON(), options);
                    });
                });

                describe("when the method is read", function () {
                    it("should call sync on super", function () {
                        driverModel.sync("read", driverModel.toJSON(), options);

                        expect(DriverModel.__super__.sync).toHaveBeenCalledWith("read", driverModel.toJSON(), options);
                    });
                });

                describe("when the method is patch", function () {
                    it("should call sync on super", function () {
                        var expectedOptions = utils._.extend({type: "POST"}, utils.deepClone(options));

                        driverModel.sync("patch", driverModel.toJSON(), options);

                        expect(DriverModel.__super__.sync)
                            .toHaveBeenCalledWith("patch", driverModel.toJSON(), expectedOptions);
                    });
                });

                describe("when the method is update", function () {
                    it("should call sync on super", function () {
                        driverModel.sync("update", driverModel.toJSON(), options);

                        expect(DriverModel.__super__.sync)
                            .toHaveBeenCalledWith("update", driverModel.toJSON(), options);
                    });
                });

                describe("when the method is delete", function () {
                    it("should call sync on super", function () {
                        driverModel.sync("delete", driverModel.toJSON(), options);

                        expect(DriverModel.__super__.sync)
                            .toHaveBeenCalledWith("delete", driverModel.toJSON(), options);
                    });
                });
            });

            describe("has an add function that", function () {
                var mockUrlRoot = "mock url root",
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
                    spyOn(driverModel, "save").and.callFake(function () {});
                    spyOn(driverModel, "urlRoot").and.returnValue(mockUrlRoot);

                    driverModel.initialize(mockValues);
                    driverModel.url = null;
                    driverModel.add(options);
                });

                it("is defined", function () {
                    expect(driverModel.add).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.add).toEqual(jasmine.any(Function));
                });

                it("should set url", function () {
                    expect(driverModel.url).toEqual(mockUrlRoot);
                });

                it("should call save", function () {
                    var expectedOptions = utils._.extend({patch: true}, utils.deepClone(options)),
                        expectedAttributes = {
                            "id"          : mockValues.id,
                            "firstName"   : mockValues.firstName,
                            "middleName"  : mockValues.middleName,
                            "lastName"    : mockValues.lastName,
                            "departmentId": mockValues.department.id
                        };

                    expect(driverModel.save).toHaveBeenCalledWith(expectedAttributes, expectedOptions);
                });
            });

            describe("has a changeStatus function that", function () {
                var mockDriverId = 13456134651,
                    updatedStatus = "mock status",
                    options = {
                        success: function () {}
                    };

                beforeEach(function () {
                    spyOn(driverModel, "save").and.callFake(function () {});

                    driverModel.set("id", mockDriverId);
                    driverModel.changeStatus(updatedStatus, options);
                });

                it("is defined", function () {
                    expect(driverModel.changeStatus).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.changeStatus).toEqual(jasmine.any(Function));
                });

                it("should call save", function () {
                    var expectedOptions = utils._.extend({patch: true}, utils.deepClone(options));

                    expect(driverModel.save).toHaveBeenCalledWith("status", updatedStatus, expectedOptions);
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(driverModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when department does have a value", function () {
                    var department,
                        mockDriver = {
                            id: 13465134561,
                            firstName: "First Name",
                            middleName: "Middle Name",
                            lastName: "Last Name",
                            status: "Active",
                            statusDate: "3/14/2015",
                            department: {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            }
                        };

                    beforeEach(function () {
                        spyOn(driverModel, "formatAttributes").and.callFake(function () {});
                        driverModel.clear();
                        driverModel.initialize(mockDriver);
                        department = driverModel.get("department");

                        spyOn(department, "toJSON").and.callThrough();
                        spyOn(DriverModel.__super__, "toJSON").and.callThrough();

                        driverModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(DriverModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on department", function () {
                        expect(department.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        var expectedValue = mockDriver,
                            actualValue = driverModel.toJSON();

                        expect(actualValue).toEqual(expectedValue);
                    });
                });

                describe("when department does NOT have a value", function () {
                    var mockDriver = {
                            id: 13465134561,
                            firstName: "First Name",
                            middleName: "Middle Name",
                            lastName: "Last Name",
                            status: "Active",
                            statusDate: "3/14/2015"
                        };

                    beforeEach(function () {
                        spyOn(driverModel, "formatAttributes").and.callFake(function () {});
                        driverModel.clear();
                        driverModel.initialize(mockDriver);

                        spyOn(DriverModel.__super__, "toJSON").and.callThrough();

                        driverModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(DriverModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        var expectedValue = mockDriver,
                            actualValue = driverModel.toJSON();

                        expect(actualValue).toEqual(expectedValue);
                    });
                });
            });
        });
    });
