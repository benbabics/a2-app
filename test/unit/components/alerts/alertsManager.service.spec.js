(function () {
    "use strict";

    var $rootScope,
        $q,
        globals,
        resolveHandler,
        rejectHandler,
        AlertModel,
        AlertsResource,
        AlertsManager,
        mockAlertsCollection,
        mockCachedAlertsCollection;

    describe("An Alerts Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.alerts");

            // mock dependencies
            AlertsResource = jasmine.createSpyObj("AlertsResource", ["getAlerts"]);

            module(function ($provide) {
                $provide.value("AlertsResource", AlertsResource);
            });

            inject(function (_$q_, _globals_, _$rootScope_, _AlertsManager_, _AlertModel_) {
                $q = _$q_;
                globals = _globals_;
                $rootScope = _$rootScope_;
                AlertsManager = _AlertsManager_;
                AlertModel = _AlertModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            // set up mocks
            var numModels, i;

            mockAlertsCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockAlertsCollection.push(TestUtils.getRandomAlert(AlertModel));
            }

            mockCachedAlertsCollection = [];
            numModels = TestUtils.getRandomInteger(1, 100);
            for (i = 0; i < numModels; ++i) {
                mockCachedAlertsCollection.push(TestUtils.getRandomAlert(AlertModel));
            }
        });

        describe("has a clearCachedValues function that", function () {

            beforeEach(function () {
                AlertsManager.setAlerts(mockAlertsCollection);
                AlertsManager.clearCachedValues();
            });

            it("should reset the cached alerts", function () {
                expect(AlertsManager.getAlerts()).toEqual([]);
            });
        });

        describe("has a fetchAlerts function that", function () {
            var getAlertsDeferred,
                mockPageNumber,
                mockPageSize;

            beforeEach(function () {
                getAlertsDeferred = $q.defer();
                mockPageNumber = TestUtils.getRandomInteger(0, 10);
                mockPageSize = TestUtils.getRandomInteger(1, 100);

                AlertsManager.setAlerts(mockCachedAlertsCollection.slice());

                AlertsResource.getAlerts.and.returnValue(getAlertsDeferred.promise);
            });

            describe("when getting the alerts", function () {
                beforeEach(function () {
                    AlertsManager.fetchAlerts(mockPageNumber, mockPageSize)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call AlertsResource.getAlerts", function () {
                    expect(AlertsResource.getAlerts).toHaveBeenCalledWith({
                        status    : globals.NOTIFICATIONS_API.STATUS.READ + "," + globals.NOTIFICATIONS_API.STATUS.UNREAD,
                        pageNumber: mockPageNumber,
                        pageSize  : mockPageSize
                    });
                });
            });

            describe("when the alerts are fetched successfully", function () {
                var mockAlerts = {data: {notifications: []}};

                beforeEach(function () {
                    mockAlerts.data.notifications = mockAlertsCollection.slice();
                });

                describe("when there is data in the response", function () {
                    describe("when the first page is requested", function () {
                        beforeEach(function () {
                            mockPageNumber = 0;

                            AlertsManager.fetchAlerts(mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        beforeEach(function () {
                            getAlertsDeferred.resolve(mockAlerts);
                            $rootScope.$digest();
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(mockAlerts.data.notifications);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });
                    });

                    describe("when a page beyond the first page requested", function () {
                        beforeEach(function () {
                            mockPageNumber = TestUtils.getRandomInteger(1, 10);

                            AlertsManager.fetchAlerts(mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        describe("when there are alerts in the fetched data that are already cached", function () {
                            beforeEach(function () {
                                Array.prototype.push.apply(mockAlerts.data, mockCachedAlertsCollection);
                                getAlertsDeferred.resolve(mockAlerts);
                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockAlerts.data.notifications);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                            it("should add only the uncached alerts from the data to __alerts", function () {
                                var expectedValues = _.uniqBy(mockCachedAlertsCollection.concat(mockAlerts.data.notifications), "id");
                                expect(AlertsManager.getAlerts()).toEqual(expectedValues);
                            });
                        });

                        describe("when there are no alerts in the fetched data that are already cached", function () {
                            beforeEach(function () {
                                getAlertsDeferred.resolve(mockAlerts);
                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockAlerts.data.notifications);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe("when there is no data in the response", function () {
                    beforeEach(function () {
                        AlertsManager.fetchAlerts(mockPageNumber, mockPageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    beforeEach(function () {
                        getAlertsDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT modify __alerts", function () {
                        expect(AlertsManager.getAlerts()).toEqual(mockCachedAlertsCollection);
                    });
                });
            });

            describe("when retrieving alerts fails", function () {
                var mockResponse = "Some error";

                beforeEach(function () {
                    AlertsManager.fetchAlerts(mockPageNumber, mockPageSize)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                beforeEach(function () {
                    getAlertsDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });
            });

        });
    });
})();
