(function () {
    "use strict";

    fdescribe("A DriverManager", function () {

        var _,
            $q,
            $rootScope,
            DriverManager,
            DriverModel,
            DriversResource,
            resolveHandler,
            rejectHandler;

        beforeEach(function () {

            //setup mock dependencies
            DriversResource = jasmine.createSpyObj("DriversResource", ["getDrivers"]);
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            module(function ($provide) {
                $provide.value("DriversResource", DriversResource);
            });

            inject(function (___, _$q_, _$rootScope_, _DriverManager_, _DriverModel_) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                DriverManager = _DriverManager_;
                DriverModel = _DriverModel_;
            });
        });

        describe("has a clearCachedValues function that", function () {
            var drivers;

            beforeEach(function () {
                drivers = TestUtils.getRandomArray(10, TestUtils.getRandomDriver, DriverModel);
                DriverManager.setDrivers(drivers);

                DriverManager.clearCachedValues();
            });

            it("should clear the cached drivers", function () {
                expect(DriverManager.getDrivers()).toEqual([]);
            });
        });

        describe("has a fetchDriver function that", function () {
            var driverToFetch;

            describe("when drivers is NOT empty", function () {
                var cachedDrivers;

                beforeEach(function () {
                    cachedDrivers = TestUtils.getRandomArray(10, TestUtils.getRandomDriver, DriverModel);

                    DriverManager.setDrivers(cachedDrivers);
                });

                describe("when the driver to fetch is in the list", function () {

                    beforeEach(function () {
                        driverToFetch = TestUtils.getRandomValueFromArray(cachedDrivers);

                        DriverManager.fetchDriver(driverToFetch.promptId)
                            .then(resolveHandler);

                        $rootScope.$digest();
                    });

                    it("should return the expected driver", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(driverToFetch);
                    });
                });

                describe("when the driver to fetch is NOT in the list", function () {

                    beforeEach(function () {
                        driverToFetch = TestUtils.getRandomDriver(DriverModel);

                        DriverManager.fetchDriver(driverToFetch.promptId)
                            .then(resolveHandler);

                        $rootScope.$digest();
                    });

                    it("should return undefined", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(undefined);
                    });
                });

            });

            describe("when drivers is empty", function () {

                beforeEach(function () {
                    DriverManager.setDrivers([]);
                });

                beforeEach(function () {
                    driverToFetch = TestUtils.getRandomDriver(DriverModel);

                    DriverManager.fetchDriver(driverToFetch.promptId)
                        .then(resolveHandler);

                    $rootScope.$digest();
                });

                it("should return undefined", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(undefined);
                });
            });

        });

        describe("has a fetchDrivers function that", function () {
            var accountId,
                params,
                getDriversDeferred;

            function testNoDataInResponse() {
                var error = "Getting Drivers failed: No data in response from getting the Drivers";

                beforeEach(function () {
                    getDriversDeferred.resolve({});
                });

                it("should log and throw an error", function () {
                    TestUtils.digestError($rootScope);

                    expect(this.Logger.error).toHaveBeenCalledWith(error);

                    expect(rejectHandler).toHaveBeenCalledWith(new Error(error));
                });
            }

            beforeEach(function () {
                accountId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                getDriversDeferred = $q.defer();
                DriversResource.getDrivers.and.returnValue(getDriversDeferred.promise);
            });

            describe("when a pageSize is the ONLY given parameter for paging", function () {
                var error = "Failed to fetch drivers: intent of pagination requires presence of coupled fields pageSize & pageNumber.";

                beforeEach(function () {
                    params = {
                        firstName: "Q",
                        departmentId: "SA-WEB",
                        email: "N/A",
                        pageNumber: TestUtils.getRandomInteger(0, 10)
                    };
                });

                it("should log and throw an error", function () {
                    expect(function () {
                        DriverManager.fetchDrivers(accountId, params);
                    }).toThrowError(error);

                    expect(this.Logger.error).toHaveBeenCalledWith(error);
                });
            });

            describe("when a pageNumber is the ONLY given parameter for paging", function () {
                var error = "Failed to fetch drivers: intent of pagination requires presence of coupled fields pageSize & pageNumber.";

                beforeEach(function () {
                    params = {
                        firstName: "Q",
                        departmentId: "SA-WEB",
                        email: "N/A",
                        pageSize: TestUtils.getRandomInteger(0, 10)
                    };
                });

                it("should log and throw an error", function () {
                    expect(function () {
                        DriverManager.fetchDrivers(accountId, params);
                    }).toThrowError(error);

                    expect(this.Logger.error).toHaveBeenCalledWith(error);
                });
            });

            describe("when pageNumber and pageSize are given as parameters", function () {

                describe("when DriversResource.getDrivers succeeds", function () {

                    describe("when the pageNumber is 0", function () {

                        beforeEach(function () {
                            params = {
                                firstName   : "Q",
                                departmentId: "SA-WEB",
                                email       : "N/A",
                                pageSize    : TestUtils.getRandomInteger(0, 10),
                                pageNumber  : 0,
                                invalidParam: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            DriverManager.fetchDrivers(accountId, params)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        it("should pass the expected params to DriversResource.getDrivers", function () {
                            expect(_.difference(params, DriversResource.getDrivers.calls.mostRecent().args[1])).toEqual([]);

                            expect(DriversResource.getDrivers).toHaveBeenCalledWith(accountId, _.pick(params, [
                                "promptId",
                                "firstName",
                                "lastName",
                                "email",
                                "status",
                                "departmentId",
                                "pageSize",
                                "pageNumber"
                            ]));
                        });

                        describe("when there is data in the response", function () {
                            var driversResponse;

                            beforeEach(function () {
                                driversResponse = {
                                    data: TestUtils.getRandomArray(10, TestUtils.getRandomDriver, DriverModel)
                                };

                                getDriversDeferred.resolve(driversResponse);
                                $rootScope.$digest();
                            });

                            it("should convert all Drivers in the response to model objects and cache them", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(_.map(driversResponse.data, createDriver));
                            });
                        });

                        describe("when there is NOT data in the response", testNoDataInResponse);
                    });

                    describe("when the pageNumber is NOT 0", function () {

                        beforeEach(function () {
                            params = {
                                firstName: "Q",
                                departmentId: "SA-WEB",
                                email: "N/A",
                                pageSize: TestUtils.getRandomInteger(0, 10),
                                pageNumber: TestUtils.getRandomInteger(1, 10)
                            };

                            DriverManager.fetchDrivers(accountId, params)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        describe("when there is data in the response", function () {
                            var driversResponse,
                                driverResource,
                                cachedDrivers;

                            beforeEach(function () {
                                driverResource = TestUtils.getRandomArray(10, TestUtils.getRandomDriver, DriverModel);
                                driversResponse = {data: driverResource.slice()};

                                cachedDrivers = TestUtils.getRandomArray(10, TestUtils.getRandomDriver, DriverModel);
                                DriverManager.setDrivers(cachedDrivers.slice());
                            });

                            describe("when there are drivers in the fetched data that are already cached", function () {

                                beforeEach(function () {
                                    Array.prototype.push.apply(driversResponse.data, cachedDrivers);

                                    getDriversDeferred.resolve(driversResponse);
                                    $rootScope.$digest();
                                });

                                it("should resolve", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(driversResponse.data);
                                    expect(rejectHandler).not.toHaveBeenCalled();
                                });

                                it("should add only the uncached drivers from the data to cachedDrivers", function () {
                                    var expectedValues = _.uniqBy(cachedDrivers.concat(driverResource), "promptId");

                                    expect(DriverManager.getDrivers()).toEqual(expectedValues);
                                });
                            });

                            describe("when there are no drivers in the fetched data that are already cached", function () {

                                beforeEach(function () {
                                    getDriversDeferred.resolve(driversResponse);
                                    $rootScope.$digest();
                                });

                                it("should resolve", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(driversResponse.data);
                                    expect(rejectHandler).not.toHaveBeenCalled();
                                });

                                it("should add all of the fetched drivers to cachedDrivers", function () {
                                    expect(DriverManager.getDrivers()).toEqual(cachedDrivers.concat(driversResponse.data));
                                });
                            });
                        });

                        describe("when there is NOT data in the response", testNoDataInResponse);
                    });
                });

                describe("when DriversResource.getDrivers fails", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        getDriversDeferred.reject(error);

                        DriverManager.fetchDrivers(accountId, params)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    it("should log and throw an error", function () {
                        var expectedError = "Getting Drivers failed: " + error;

                        TestUtils.digestError($rootScope);

                        expect(this.Logger.error).toHaveBeenCalledWith(expectedError);

                        expect(rejectHandler).toHaveBeenCalledWith(new Error(expectedError));
                    });
                });
            });

            function createDriver(driverResource) {
                var driverModel = new DriverModel();
                driverModel.set(driverResource);

                return driverModel;
            }
        });

        it("should have valid setDriver and getDriver functions", function () {
            var drivers = TestUtils.getRandomArray(10, TestUtils.getRandomDriver, DriverModel);

            DriverManager.setDrivers(drivers);

            expect(DriverManager.getDrivers()).toEqual(drivers);
        });
    });
})();
