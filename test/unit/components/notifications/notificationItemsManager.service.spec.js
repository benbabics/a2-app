(function () {
    "use strict";

    var $rootScope,
        $q,
        globals,
        resolveHandler,
        rejectHandler,
        NotificationModel,
        NotificationsResource,
        NotificationItemsManager,
        mockNotificationsCollection,
        mockCachedNotificationsCollection,
        mockCachedNotificationsResponseCollection;

    describe("An Notifications Items Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.notifications");

            // mock dependencies
            NotificationsResource = jasmine.createSpyObj("NotificationsResource", ["getNotifications", "deleteNotification", "getUnreadNotificationsCount", "setNotificationsRead"]);

            module(function ($provide) {
                $provide.value("NotificationsResource", NotificationsResource);
            });

            inject(function (_$q_, _globals_, _$rootScope_, _NotificationItemsManager_, _NotificationModel_) {
                $q = _$q_;
                globals = _globals_;
                $rootScope = _$rootScope_;
                NotificationItemsManager = _NotificationItemsManager_;
                NotificationModel = _NotificationModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            // set up mocks
            var numModels, i;

            mockNotificationsCollection = [];
            numModels = TestUtils.getRandomInteger(1, 50);
            for (i = 0; i < numModels; ++i) {
                mockNotificationsCollection.push(TestUtils.getRandomNotification(NotificationModel));
            }

            mockCachedNotificationsCollection = [];
            mockCachedNotificationsResponseCollection = [];
            numModels = TestUtils.getRandomInteger(1, 50);
            for (i = 0; i < numModels; ++i) {
                mockCachedNotificationsResponseCollection.push(TestUtils.getRandomNotificationResponse());
                var model = new NotificationModel();
                model.set(mockCachedNotificationsResponseCollection[i]);
                mockCachedNotificationsCollection.push(model);
            }
        });

        describe("has a clearCachedValues function that", function () {

            beforeEach(function () {
                NotificationItemsManager.setNotifications(mockNotificationsCollection);
                NotificationItemsManager.clearCachedValues();
            });

            it("should reset the cached notifications", function () {
                expect(NotificationItemsManager.getNotifications()).toEqual([]);
            });

            it("should reset the cached unread notifications count", function() {
                expect(NotificationItemsManager.getUnreadNotificationsCount()).toEqual(0);
            });
        });

        describe("has a fetchNotifications function that", function () {
            var getNotificationsDeferred,
                mockPageNumber,
                mockPageSize;

            beforeEach(function () {
                getNotificationsDeferred = $q.defer();
                mockPageNumber = TestUtils.getRandomInteger(0, 10);
                mockPageSize = TestUtils.getRandomInteger(1, 100);

                NotificationItemsManager.setNotifications(mockCachedNotificationsCollection.slice());

                NotificationsResource.getNotifications.and.returnValue(getNotificationsDeferred.promise);
            });

            describe("when getting the notifications", function () {
                beforeEach(function () {
                    NotificationItemsManager.fetchNotifications(mockPageNumber, mockPageSize)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call NotificationsResource.getNotifications", function () {
                    expect(NotificationsResource.getNotifications).toHaveBeenCalledWith({
                        status    : globals.NOTIFICATIONS_API.STATUS.READ + "," + globals.NOTIFICATIONS_API.STATUS.UNREAD,
                        pageNumber: mockPageNumber,
                        pageSize  : mockPageSize
                    });
                });
            });

            describe("when the notifications are fetched successfully", function () {
                var mockResponse = {};
                var mockNotificationsModels = [];

                beforeEach(function () {
                    var notificationCount = TestUtils.getRandomInteger(1, mockPageSize);
                    mockResponse = { config: {}, data: [], status: 200, statusText: ""};
                    for (var i = 0; i < notificationCount; i++) {
                        mockResponse.data[i] = TestUtils.getRandomNotificationResponse();
                    }
                    mockNotificationsModels = _.map(mockResponse.data, function(resource) {
                        var notificationModel = new NotificationModel();
                        notificationModel.set(resource);
                        return notificationModel;
                    });
                });

                describe("when there is data in the response", function () {
                    describe("when the first page is requested", function () {
                        beforeEach(function () {
                            mockPageNumber = 0;

                            NotificationItemsManager.fetchNotifications(mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        beforeEach(function () {
                            getNotificationsDeferred.resolve(mockResponse);
                            $rootScope.$digest();
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(mockNotificationsModels);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });
                    });

                    describe("when a page beyond the first page requested", function () {
                        beforeEach(function () {
                            mockPageNumber = TestUtils.getRandomInteger(1, 10);

                            NotificationItemsManager.fetchNotifications(mockPageNumber, mockPageSize)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                        });

                        describe("when there are notifications in the fetched data that are already cached", function () {
                            beforeEach(function () {
                                Array.prototype.push.apply(mockResponse.data, mockCachedNotificationsResponseCollection);
                                Array.prototype.push.apply(mockNotificationsModels, mockCachedNotificationsCollection);
                                getNotificationsDeferred.resolve(mockResponse);
                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockNotificationsModels);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                            it("should add only the uncached notifications from the data to the notifications cache", function () {
                                var expectedValues = _.uniqBy(mockCachedNotificationsCollection.concat(mockNotificationsModels), "id");
                                expect(NotificationItemsManager.getNotifications()).toEqual(expectedValues);
                            });
                        });

                        describe("when there are no notifications in the fetched data that are already cached", function () {
                            beforeEach(function () {
                                getNotificationsDeferred.resolve(mockResponse);
                                $rootScope.$digest();
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockNotificationsModels);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe("when there is no data in the response", function () {
                    beforeEach(function () {
                        NotificationItemsManager.fetchNotifications(mockPageNumber, mockPageSize)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    beforeEach(function () {
                        getNotificationsDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT modify the notifications cache", function () {
                        expect(NotificationItemsManager.getNotifications()).toEqual(mockCachedNotificationsCollection);
                    });
                });
            });

            describe("when retrieving notifications fails", function () {
                var mockResponse = "Some error";

                beforeEach(function () {
                    NotificationItemsManager.fetchNotifications(mockPageNumber, mockPageSize)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                beforeEach(function () {
                    getNotificationsDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });
            });

        });

        describe("has a getUnreadNotificationsCount function that", function() {
            var mockUnreadCount;

            beforeEach(function() {
                mockUnreadCount = TestUtils.getRandomInteger(1, 100);
                NotificationItemsManager.setUnreadNotificationsCount(mockUnreadCount);
            });

            it("should return the cached unread notifications count", function() {
                expect(NotificationItemsManager.getUnreadNotificationsCount()).toEqual(mockUnreadCount);
            });
        });

        describe("has a fetchUnreadNotificationsCount function that", function() {

            var fetchUnreadDeferred,
                mockUnreadCount;

            beforeEach(function() {
                fetchUnreadDeferred = $q.defer();
                NotificationsResource.getUnreadNotificationsCount.and.returnValue(fetchUnreadDeferred.promise);
                mockUnreadCount = TestUtils.getRandomInteger(1, 100);
            });

            beforeEach(function() {
                NotificationItemsManager.fetchUnreadNotificationsCount()
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call NotificationsResource.getUnreadNotificationsCount", function() {
                expect(NotificationsResource.getUnreadNotificationsCount).toHaveBeenCalled();
            });

            describe("when it does successfully receive a count", function() {

                beforeEach(function() {
                    fetchUnreadDeferred.resolve({data: mockUnreadCount});
                    $rootScope.$digest();
                });

                it("should update the cached value with the received count", function() {
                    expect(resolveHandler).toHaveBeenCalled();
                    expect(rejectHandler).not.toHaveBeenCalled();
                    expect(NotificationItemsManager.getUnreadNotificationsCount()).toEqual(mockUnreadCount);
                });
            });

            describe("when it does NOT successfully receive a count", function() {

                beforeEach(function() {
                    NotificationItemsManager.setUnreadNotificationsCount(mockUnreadCount);
                    fetchUnreadDeferred.reject();
                    TestUtils.digestError($rootScope);
                });

                it("should NOT update the cached value", function() {
                    expect(rejectHandler).toHaveBeenCalled();
                    expect(resolveHandler).not.toHaveBeenCalled();
                    expect(NotificationItemsManager.getUnreadNotificationsCount()).toEqual(mockUnreadCount);
                });
            });
        });

        describe("has a setNotificationsRead function that", function() {

            var setNotificationsReadDeferred,
                notificationIds;

            beforeEach(function() {
                setNotificationsReadDeferred = $q.defer();
                notificationIds = _.map(mockCachedNotificationsCollection, function (notification) {
                    return notification.id;
                });
                NotificationsResource.setNotificationsRead.and.returnValue(setNotificationsReadDeferred.promise);
                spyOn(NotificationItemsManager, "fetchUnreadNotificationsCount");
            });

            beforeEach(function() {
                NotificationItemsManager.setNotificationsRead(notificationIds)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call NotificationsResource.setNotificationsRead", function() {
               expect(NotificationsResource.setNotificationsRead).toHaveBeenCalledWith(notificationIds);
            });

            describe("when it does succeed", function() {
                beforeEach(function() {
                    setNotificationsReadDeferred.resolve();
                    $rootScope.$digest();
                });

                it("does call fetchUnreadNotificationsCount", function() {
                    expect(resolveHandler).toHaveBeenCalled();
                    expect(rejectHandler).not.toHaveBeenCalled();
                    expect(NotificationItemsManager.fetchUnreadNotificationsCount).toHaveBeenCalled();
                });
            });

            describe("when it does NOT succeed", function() {
                beforeEach(function() {
                    setNotificationsReadDeferred.reject();
                    TestUtils.digestError($rootScope);
                });

                it("does NOT call fetchUnreadNotificationsCount", function() {
                    expect(rejectHandler).toHaveBeenCalled();
                    expect(resolveHandler).not.toHaveBeenCalled();
                    expect(NotificationItemsManager.fetchUnreadNotificationsCount).not.toHaveBeenCalled();
                });
            });
        });

        describe("has a deleteNotification function that", function() {

            var deleteNotificationDeferred,
                removedNotification;

            beforeEach(function() {
                deleteNotificationDeferred = $q.defer();
                NotificationsResource.deleteNotification.and.returnValue(deleteNotificationDeferred.promise);
                NotificationItemsManager.setNotifications(mockCachedNotificationsCollection.slice());
                removedNotification = _.sample(mockCachedNotificationsCollection);
            });

            beforeEach(function() {
                NotificationItemsManager.deleteNotification(removedNotification)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call NotificationsResource.deleteNotification", function() {
                expect(NotificationsResource.deleteNotification).toHaveBeenCalledWith(removedNotification.id);
            });

            describe("when it does succeed", function() {

                beforeEach(function() {
                    deleteNotificationDeferred.resolve();
                    $rootScope.$digest();
                });

                it("does remove the notification from the cache", function() {
                    expect(resolveHandler).toHaveBeenCalled();
                    expect(rejectHandler).not.toHaveBeenCalled();
                    var expectedResult = _.filter(mockCachedNotificationsCollection, function(value) { return value.id !== removedNotification.id });
                    expect(NotificationItemsManager.getNotifications()).toEqual(expectedResult);
                });
            });

            describe("when it does NOT succeed", function (){

                beforeEach(function() {
                    deleteNotificationDeferred.reject();
                    TestUtils.digestError($rootScope);
                });

                it("does NOT remove the notification from the cache", function() {
                    expect(rejectHandler).toHaveBeenCalled();
                    expect(resolveHandler).not.toHaveBeenCalled();
                    expect(NotificationItemsManager.getNotifications()).toEqual(mockCachedNotificationsCollection);
                });
            });
        });
    });
})();
