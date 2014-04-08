define(["Squire", "utils", "globals", "models/CompanyModel", "backbone"],
    function (Squire, utils, globals, CompanyModel, Backbone) {

        "use strict";

        var squire = new Squire(),
            UserModel,
            userModel;

        squire.mock("backbone", Backbone);
        squire.mock("models/CompanyModel", CompanyModel);

        describe("A User Model", function () {
            beforeEach(function (done) {
                squire.require(["models/UserModel"], function (JasmineUserModel) {
                    UserModel = JasmineUserModel;
                    userModel = UserModel.getInstance();

                    done();
                });
            });

            it("is defined", function () {
                expect(userModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(userModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set authenticated to default", function () {
                    expect(userModel.defaults.authenticated).toBeFalsy();
                });

                it("should set firstName to default", function () {
                    expect(userModel.defaults.firstName).toBeNull();
                });

                it("should set email to default", function () {
                    expect(userModel.defaults.email).toBeNull();
                });

                it("should set selectedCompany to default", function () {
                    expect(userModel.defaults.selectedCompany).toBeNull();
                });

                it("should set hasMultipleAccounts to default", function () {
                    expect(userModel.defaults.hasMultipleAccounts).toBeFalsy();
                });

                it("should set permissions to default", function () {
                    expect(userModel.defaults.permissions).toEqual(globals.userData.permissions);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(userModel, "set").and.callThrough();
                    spyOn(userModel, "setPermissions").and.callFake(function () { });
                });

                it("is defined", function () {
                    expect(userModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        userModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(userModel.set).not.toHaveBeenCalled();
                        expect(userModel.setPermissions).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        userModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(userModel.set).not.toHaveBeenCalled();
                        expect(userModel.setPermissions).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            authenticated: true,
                            firstName: "Beavis",
                            email: "cornholio@bnbinc.com",
                            selectedCompany: {
                                name: "Beavis and Butthead Inc",
                                accountId: "2562456",
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
                                ]
                            },
                            hasMultipleAccounts: true,
                            permissions: [
                                "PERMISSION_1",
                                "PERMISSION_2",
                                "PERMISSION_3"
                            ]
                        };

                    beforeEach(function () {
                        userModel.initialize(options);
                    });

                    it("should call set 5 times", function () {
                        expect(userModel.set.calls.count()).toEqual(5);
                    });

                    it("should set authenticated", function () {
                        expect(userModel.set).toHaveBeenCalledWith("authenticated", options.authenticated);
                    });

                    it("should set firstName", function () {
                        expect(userModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set email", function () {
                        expect(userModel.set).toHaveBeenCalledWith("email", options.email);
                    });

                    // TODO - Replace with something that verifies that a new CompanyModel was created, the correct
                    // parameter was passed to the CompanyModel.initialize function and then set to "selectedCompany"
                    it("should set selectedCompany", function () {
                        var actualCompany, actualDepartments;

                        expect(userModel.set.calls.argsFor(3).length).toEqual(2);
                        expect(userModel.set.calls.argsFor(3)[0]).toEqual("selectedCompany");

                        actualCompany = userModel.set.calls.argsFor(3)[1];

                        expect(actualCompany.get("name")).toEqual(options.selectedCompany.name);
                        expect(actualCompany.get("accountId")).toEqual(options.selectedCompany.accountId);
                        expect(actualCompany.get("wexAccountNumber")).toEqual(options.selectedCompany.wexAccountNumber);
                        expect(actualCompany.get("driverIdLength")).toEqual(options.selectedCompany.driverIdLength);

                        actualDepartments = actualCompany.get("departments");
                        expect(actualDepartments.at(0).get("id")).toEqual(options.selectedCompany.departments[0].id);
                        expect(actualDepartments.at(0).get("name"))
                            .toEqual(options.selectedCompany.departments[0].name);
                        expect(actualDepartments.at(0).get("visible"))
                            .toEqual(options.selectedCompany.departments[0].visible);

                        expect(actualDepartments.at(1).get("id")).toEqual(options.selectedCompany.departments[1].id);
                        expect(actualDepartments.at(1).get("name"))
                            .toEqual(options.selectedCompany.departments[1].name);
                        expect(actualDepartments.at(1).get("visible"))
                            .toEqual(options.selectedCompany.departments[1].visible);
                    });

                    it("should set hasMultipleAccounts", function () {
                        expect(userModel.set).toHaveBeenCalledWith("hasMultipleAccounts", options.hasMultipleAccounts);
                    });

                    it("should set permissions", function () {
                        expect(userModel.setPermissions).toHaveBeenCalledWith(options.permissions);
                    });
                });
            });

            describe("has a reset function that", function () {
                beforeEach(function () {
                    spyOn(userModel, "set").and.callThrough();

                    userModel.reset();
                });

                it("is defined", function () {
                    expect(userModel.reset).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.reset).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(userModel.set).toHaveBeenCalledWith(userModel.defaults);
                });
            });

            describe("has a setPermissions function that", function () {
                var mockPermissions = [
                    "PERMISSION_1",
                    "PERMISSION_2",
                    "PERMISSION_3"
                ];

                beforeEach(function () {
                    spyOn(userModel, "set").and.callThrough();

                    userModel.setPermissions(mockPermissions);
                });

                it("is defined", function () {
                    expect(userModel.setPermissions).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.setPermissions).toEqual(jasmine.any(Function));
                });

                it("should call set", function () {
                    expect(userModel.set).toHaveBeenCalled();
                    expect(userModel.set.calls.mostRecent().args.length).toEqual(2);
                    expect(userModel.set.calls.mostRecent().args[0]).toEqual("permissions");
                });

                describe("when building a new object to set the permissions property with", function () {
                    var newPermissions;

                    beforeEach(function () {
                        newPermissions = userModel.set.calls.mostRecent().args[1];
                    });

                    it("should include all the default permissions", function () {
                        var numOfMatches = 0;

                        // find all elements in the newPermissions that have a matching key with the default permissions
                        utils._.each(userModel.defaults.permissions, function (value, key, list) {
                            if (utils._.has(newPermissions, key)) {
                                numOfMatches += 1;
                            }
                        });

                        expect(numOfMatches).toEqual(utils._.size(userModel.defaults.permissions));
                    });

                    it("should set only the passed in permissions to true", function () {
                        var truePermissions = {},
                            matchingPermissions;

                        // find all elements in newPermissions that are set to true
                        utils._.each(newPermissions, function (value, key, list) {
                            if (value) {
                                truePermissions[key] = value;
                            }
                        });

                        // get all the truePermissions that match the mockPermissions
                        matchingPermissions = utils._.pick(truePermissions, mockPermissions);

                        expect(utils._.size(matchingPermissions)).toEqual(utils._.size(mockPermissions));
                    });
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(userModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(userModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when selectedCompany does have a value", function () {
                    var selectedCompany,
                        mockUserModel,
                        actualValue;

                    beforeEach(function () {
                        mockUserModel = {
                            authenticated: true,
                            firstName: "Beavis",
                            email: "cornholio@bnbinc.com",
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
                                requiredFields: globals.companyData.requiredFields
                            },
                            permissions: userModel.defaults.permissions
                        };
                        userModel.clear();
                        userModel.initialize(mockUserModel);
                        selectedCompany = userModel.get("selectedCompany");

                        spyOn(selectedCompany, "toJSON").and.callThrough();
                        spyOn(userModel.__proto__, "toJSON").and.callThrough();

                        actualValue = userModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(userModel.__proto__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on selectedCompany", function () {
                        expect(selectedCompany.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockUserModel);
                    });
                });

                describe("when selectedCompany does NOT have a value", function () {
                    var mockUserModel,
                        actualValue;

                    beforeEach(function () {
                        mockUserModel = {
                            authenticated : true,
                            firstName     : "Beavis",
                            email         : "cornholio@bnbinc.com",
                            permissions   : userModel.defaults.permissions
                        };
                        userModel.clear();
                        userModel.initialize(mockUserModel);

                        spyOn(userModel.__proto__, "toJSON").and.callThrough();

                        actualValue = userModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(userModel.__proto__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockUserModel);
                    });
                });
            });
        });
    });
