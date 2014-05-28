define(["utils", "globals", "Squire", "models/CardModel", "models/UserModel"],
    function (utils, globals, Squire, CardModel, UserModel) {
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
            CardCollection,
            cardCollection;

        squire.mock("models/CardModel", CardModel);
        squire.mock("models/UserModel", UserModel);

        describe("A Card Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/CardCollection"], function (JasmineCardCollection) {
                    userModel.parse(mockUserModel);

                    spyOn(UserModel, "getInstance").and.returnValue(userModel);

                    CardCollection = JasmineCardCollection;
                    cardCollection = new CardCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(cardCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(cardCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(cardCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to CardModel", function () {
                    expect(cardCollection.model).toEqual(CardModel);
                });

                it("should default isAllResults", function () {
                    expect(cardCollection.isAllResults).toBeTruthy();
                });

                it("should default pageNumber", function () {
                    expect(cardCollection.pageNumber).toEqual(globals.cardSearch.constants.DEFAULT_PAGE_NUMBER);
                });

                it("should default pageSize", function () {
                    expect(cardCollection.pageSize).toEqual(globals.cardSearch.constants.DEFAULT_PAGE_SIZE);
                });
            });

            describe("has a url function that", function () {
                it("is defined", function () {
                    expect(cardCollection.url).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardCollection.url).toEqual(jasmine.any(Function));
                });

                it("should return expected result", function () {
                    var expectedResult = globals.WEBSERVICE.ACCOUNTS.URL +
                            "/" +
                            mockUserModel.selectedCompany.accountId +
                            globals.WEBSERVICE.CARD_PATH,
                        actualResult = cardCollection.url();

                    expect(actualResult).toEqual(expectedResult);
                });
            });

            describe("has an initialize function that", function () {
                var mockOptions = {
                    "option1": "Value1",
                    "option2": "Value2",
                    "option3": "Value3"
                };

                beforeEach(function () {
                    spyOn(CardCollection.__super__, "initialize").and.callFake(function () {});
                    spyOn(cardCollection, "on").and.callFake(function () {});

                    cardCollection.initialize(mockOptions);
                });

                it("is defined", function () {
                    expect(cardCollection.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardCollection.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super", function () {
                    expect(CardCollection.__super__.initialize).toHaveBeenCalledWith(mockOptions);
                });

                it("should listen on events", function () {
                    expect(cardCollection.on).toHaveBeenCalled();
                    expect(cardCollection.on.calls.mostRecent().args.length).toEqual(3);
                    expect(cardCollection.on.calls.mostRecent().args[0]).toEqual("add change remove reset");
                    expect(cardCollection.on.calls.mostRecent().args[1]).toEqual(jasmine.any(Function));
                    expect(cardCollection.on.calls.mostRecent().args[2]).toEqual(cardCollection);
                });

                describe("when calling the on event listener callback", function () {
                    var callback;

                    beforeEach(function () {
                        callback = cardCollection.on.calls.mostRecent().args[1];
                        cardCollection.isAllResults = null;
                    });

                    describe("when length is falsy", function () {
                        beforeEach(function () {
                            cardCollection.length = false;

                            callback.call(cardCollection);
                        });

                        it("should set isAllResults", function () {
                            expect(cardCollection.isAllResults).toBeTruthy();
                        });
                    });

                    describe("when length is truthy", function () {
                        beforeEach(function () {
                            cardCollection.length = 1;

                            callback.call(cardCollection);
                        });

                        it("should not set isAllResults", function () {
                            expect(cardCollection.isAllResults).toBeNull();
                        });
                    });
                });
            });

            describe("has a parse function that", function () {
                var mockResponse = {
                    data: {
                        totalResults: 123454,
                        searchResults: [
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
                    }
                };

                beforeEach(function () {
                    cardCollection.isAllResults = null;
                    spyOn(CardCollection.__super__, "parse")
                        .and.callFake(function () { return mockResponse.data.searchResults; });
                });

                it("is defined", function () {
                    expect(cardCollection.parse).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardCollection.parse).toEqual(jasmine.any(Function));
                });

                describe("when pageSize is less than totalResults", function () {
                    it("should set isAllResults", function () {
                        cardCollection.pageSize = 11;
                        cardCollection.totalResults = 12;

                        cardCollection.parse(mockResponse);

                        expect(cardCollection.isAllResults).toBeFalsy();
                    });
                });

                describe("when pageSize equals totalResults", function () {
                    it("should set isAllResults", function () {
                        cardCollection.pageSize = 12;
                        cardCollection.totalResults = 12;

                        cardCollection.parse(mockResponse);

                        expect(cardCollection.isAllResults).toBeTruthy();
                    });
                });

                describe("when pageSize is greater than totalResults", function () {
                    it("should set isAllResults", function () {
                        cardCollection.pageSize = 13;
                        cardCollection.totalResults = 12;

                        cardCollection.parse(mockResponse);

                        expect(cardCollection.isAllResults).toBeTruthy();
                    });
                });

                it("should return searchResults", function () {
                    var actualReturnValue = cardCollection.parse(mockResponse);

                    expect(actualReturnValue).toEqual(mockResponse.data.searchResults);
                });

                it("should call super", function () {
                    cardCollection.parse(mockResponse);
                    expect(CardCollection.__super__.parse).toHaveBeenCalledWith(mockResponse);
                });
            });

            describe("has a fetch function that", function () {
                var mockOptions = {
                    "id"                : 5677,
                    "customVehicleId"   : "Howard",
                    "licensePlateNumber": 132456,
                    "status"            : "ACTIVE",
                    department          : {
                        id              : "2456724567",
                        name            : "Dewey, Cheetum and Howe",
                        visible         : true
                    }
                };

                beforeEach(function () {
                    cardCollection.pageSize = 13465;
                    cardCollection.totalResults = 13461546;
                    cardCollection.isAllResults = true;

                    spyOn(CardCollection.__super__, "fetch").and.callFake(function () { });

                    cardCollection.fetch(mockOptions);
                });

                it("is defined", function () {
                    expect(cardCollection.fetch).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardCollection.fetch).toEqual(jasmine.any(Function));
                });

                it("should set isAllResults", function () {
                    expect(cardCollection.isAllResults).toBeFalsy();
                });

                it("should call super", function () {
                    var expectedOptions = {};
                    expectedOptions.number = mockOptions.id;
                    expectedOptions.customVehicleId = mockOptions.customVehicleId;
                    expectedOptions.licensePlateNumber = mockOptions.licensePlateNumber;
                    expectedOptions.status = mockOptions.status;
                    if (mockOptions.department) {
                        expectedOptions.departmentId = mockOptions.department.id;
                    }
                    expectedOptions.pageSize = cardCollection.pageSize;
                    expectedOptions.pageNumber = cardCollection.pageNumber;

                    expect(CardCollection.__super__.fetch).toHaveBeenCalledWith(expectedOptions);
                });
            });

            describe("has a resetPage function that", function () {
                beforeEach(function () {
                    cardCollection.pageSize = null;
                    cardCollection.resetPage();
                });

                it("is defined", function () {
                    expect(cardCollection.resetPage).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardCollection.resetPage).toEqual(jasmine.any(Function));
                });

                it("should set pageSize", function () {
                    expect(cardCollection.pageSize).toEqual(globals.cardSearch.constants.DEFAULT_PAGE_SIZE);
                });
            });

            describe("has a showAll function that", function () {
                beforeEach(function () {
                    cardCollection.pageSize = null;
                    cardCollection.showAll();
                });

                it("is defined", function () {
                    expect(cardCollection.showAll).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardCollection.showAll).toEqual(jasmine.any(Function));
                });

                it("should set pageSize", function () {
                    expect(cardCollection.pageSize).toEqual(globals.cardSearch.constants.SHOW_ALL_PAGE_SIZE);
                });
            });
        });
    });
