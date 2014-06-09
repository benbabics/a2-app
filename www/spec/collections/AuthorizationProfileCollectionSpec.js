define(["utils", "globals", "Squire", "models/AuthorizationProfileModel", "models/UserModel"],
    function (utils, globals, Squire, AuthorizationProfileModel, UserModel) {
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
            AuthorizationProfileCollection,
            authorizationProfileCollection;

        squire.mock("models/AuthorizationProfileModel", AuthorizationProfileModel);
        squire.mock("models/UserModel", UserModel);

        describe("An Authorization Profile Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/AuthorizationProfileCollection"], function (JasmineAuthorizationProfileCollection) {
                    userModel.initialize(mockUserModel);

                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    AuthorizationProfileCollection = JasmineAuthorizationProfileCollection;
                    authorizationProfileCollection = new AuthorizationProfileCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(authorizationProfileCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(authorizationProfileCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(authorizationProfileCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(authorizationProfileCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to AuthorizationProfileModel", function () {
                    expect(authorizationProfileCollection.model).toEqual(AuthorizationProfileModel);
                });
            });

            describe("has a fetch function that", function () {
                var mockOptions = {
                    "accountId"  : "157257276"
                };

                beforeEach(function () {
                    spyOn(AuthorizationProfileCollection.__super__, "fetch").and.callFake(function () { });

                    authorizationProfileCollection.fetch(mockOptions);
                });

                it("is defined", function () {
                    expect(authorizationProfileCollection.fetch).toBeDefined();
                });

                it("is a function", function () {
                    expect(authorizationProfileCollection.fetch).toEqual(jasmine.any(Function));
                });

                it("should set url", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL + "/" + mockOptions.accountId +
                        globals.WEBSERVICE.AUTH_PROFILES_PATH;
                    expect(authorizationProfileCollection.url).toEqual(expectedResult);
                });

                it("should call super", function () {
                    expect(AuthorizationProfileCollection.__super__.fetch).toHaveBeenCalledWith({});
                });
            });
        });
    });
