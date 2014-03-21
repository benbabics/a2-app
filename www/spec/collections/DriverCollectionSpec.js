define(["utils", "globals", "Squire", "models/DriverModel"],
    function (utils, globals, Squire, DriverModel) {
        "use strict";

        var squire = new Squire(),
            DriverCollection,
            driverCollection;

        squire.mock("models/DriverModel", DriverModel);

        describe("A Driver Collection", function () {
            beforeEach(function(done) {
                squire.require(["collections/DriverCollection"], function(JasmineDriverCollection) {
                    DriverCollection = JasmineDriverCollection;
                    driverCollection = new DriverCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(driverCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(driverCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(driverCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to DriverModel", function () {
                    expect(driverCollection.model).toEqual(DriverModel);
                });

                it("should default isAllResults", function () {
                    expect(driverCollection.isAllResults).toBeTruthy();
                });

                it("should default pageNumber", function () {
                    expect(driverCollection.pageNumber).toEqual(globals.driverSearch.constants.DEFAULT_PAGE_NUMBER);
                });

                it("should default pageSize", function () {
                    expect(driverCollection.pageSize).toEqual(globals.driverSearch.constants.DEFAULT_PAGE_SIZE);
                });

                it("should default url", function () {
                    expect(driverCollection.url).toEqual(globals.driverSearch.constants.WEBSERVICE);
                });
            });

            describe("has an initialize function that", function () {
                var mockOptions = {
                    "option1": "Value1",
                    "option2": "Value2",
                    "option3": "Value3"
                };

                beforeEach(function () {
                    spyOn(DriverCollection.__super__, "initialize").and.callFake(function () {});
                    spyOn(driverCollection, "on").and.callFake(function () {});

                    driverCollection.initialize(mockOptions);
                });

                it("is defined", function () {
                    expect(driverCollection.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverCollection.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super", function () {
                    expect(DriverCollection.__super__.initialize).toHaveBeenCalledWith(mockOptions);
                });

                it("should listen on events", function () {
                    expect(driverCollection.on).toHaveBeenCalled();
                    expect(driverCollection.on.calls.mostRecent().args.length).toEqual(3);
                    expect(driverCollection.on.calls.mostRecent().args[0]).toEqual("add change remove reset");
                    expect(driverCollection.on.calls.mostRecent().args[1]).toEqual(jasmine.any(Function));
                    expect(driverCollection.on.calls.mostRecent().args[2]).toEqual(driverCollection);
                });

                describe("when calling the on event listener callback", function () {
                    var callback;

                    beforeEach(function () {
                        callback = driverCollection.on.calls.mostRecent().args[1];
                        driverCollection.isAllResults = null;
                    });

                    describe("when length is falsy", function () {
                        beforeEach(function () {
                            driverCollection.length = false;

                            callback.call(driverCollection);
                        });

                        it("should set isAllResults", function () {
                            expect(driverCollection.isAllResults).toBeTruthy();
                        });
                    });

                    describe("when length is truthy", function () {
                        beforeEach(function () {
                            driverCollection.length = 1;

                            callback.call(driverCollection);
                        });

                        it("should not set isAllResults", function () {
                            expect(driverCollection.isAllResults).toBeNull();
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
                    driverCollection.isAllResults = null;
                    spyOn(DriverCollection.__super__, "parse")
                        .and.callFake(function () { return mockResponse.data.searchResults; });
                });

                it("is defined", function () {
                    expect(driverCollection.parse).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverCollection.parse).toEqual(jasmine.any(Function));
                });

                describe("when pageSize is less than totalResults", function () {
                    it("should set isAllResults", function () {
                        driverCollection.pageSize = 11;
                        driverCollection.totalResults = 12;

                        driverCollection.parse(mockResponse);

                        expect(driverCollection.isAllResults).toBeFalsy();
                    });
                });

                describe("when pageSize equals totalResults", function () {
                    it("should set isAllResults", function () {
                        driverCollection.pageSize = 12;
                        driverCollection.totalResults = 12;

                        driverCollection.parse(mockResponse);

                        expect(driverCollection.isAllResults).toBeTruthy();
                    });
                });

                describe("when pageSize is greater than totalResults", function () {
                    it("should set isAllResults", function () {
                        driverCollection.pageSize = 13;
                        driverCollection.totalResults = 12;

                        driverCollection.parse(mockResponse);

                        expect(driverCollection.isAllResults).toBeTruthy();
                    });
                });

                it("should return searchResults", function () {
                    var actualReturnValue = driverCollection.parse(mockResponse);

                    expect(actualReturnValue).toEqual(mockResponse.data.searchResults);
                });

                it("should call super", function () {
                    driverCollection.parse(mockResponse);
                    expect(DriverCollection.__super__.parse).toHaveBeenCalledWith(mockResponse);
                });
            });

            describe("has a fetch function that", function () {
                var mockOptions = {
                    "firstName"   : "Curly",
                    "lastName"    : "Howard",
                    "driverId"    : null,
                    "status"      : null,
                    "departmentId": null
                };

                beforeEach(function () {
                    driverCollection.pageSize = 13465;
                    driverCollection.totalResults = 13461546;
                    driverCollection.isAllResults = true;

                    spyOn(DriverCollection.__super__, "fetch").and.callFake(function () { });

                    driverCollection.fetch(mockOptions);
                });

                it("is defined", function () {
                    expect(driverCollection.fetch).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverCollection.fetch).toEqual(jasmine.any(Function));
                });

                it("should set isAllResults", function () {
                    expect(driverCollection.isAllResults).toBeFalsy();
                });

                it("should call super", function () {
                    var expectedOptions = utils._.clone(mockOptions);
                    expectedOptions.pageSize = driverCollection.pageSize;
                    expectedOptions.pageNumber = driverCollection.pageNumber;

                    expect(DriverCollection.__super__.fetch).toHaveBeenCalledWith(expectedOptions);
                });
            });

            describe("has a resetPage function that", function () {
                beforeEach(function () {
                    driverCollection.pageSize = null;
                    driverCollection.resetPage();
                });

                it("is defined", function () {
                    expect(driverCollection.resetPage).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverCollection.resetPage).toEqual(jasmine.any(Function));
                });

                it("should set pageSize", function () {
                    expect(driverCollection.pageSize).toEqual(globals.driverSearch.constants.DEFAULT_PAGE_SIZE);
                });
            });

            describe("has a showAll function that", function () {
                beforeEach(function () {
                    driverCollection.pageSize = null;
                    driverCollection.showAll();
                });

                it("is defined", function () {
                    expect(driverCollection.showAll).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverCollection.showAll).toEqual(jasmine.any(Function));
                });

                it("should set pageSize", function () {
                    expect(driverCollection.pageSize).toEqual(globals.driverSearch.constants.SHOW_ALL_PAGE_SIZE);
                });
            });
        });
    });
