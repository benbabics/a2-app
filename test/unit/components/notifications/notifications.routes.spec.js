(function () {
    "use strict";

    describe("An Notification Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockNotificationItem,
            NotificationItemsManager,
            mockGlobals = {
                ALERTS_LIST: {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            };

        beforeAll(function () {
            this.includeAppDependencies = false;
            this.includeHtml = true;
        });

        beforeEach(function () {

            module("app.components.notifications");

            // mock dependencies
            NotificationItemsManager = jasmine.createSpyObj("NotificationItemsManager", ["fetchNotifications"]);

            module(function ($provide, sharedGlobals) {
                $provide.value("NotificationItemsManager", NotificationItemsManager);
                $provide.value("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, NotificationModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                mockNotificationItem = TestUtils.getRandomPostedTransaction(NotificationModel);
            });
        });

        describe("has an notifications state that", function () {
            var state,
                stateName = "notifications";

            beforeEach(function() {
                state = $state.get(stateName);
            });

            it("should be defined", function() {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function() {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function() {
                expect(state.url).toEqual("/notifications");
            });

            it("should define a view on the root container", function() {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });
        });

        describe("has a notifications.list state that", function () {
            var state,
                stateName = "notifications.list";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should be cached", function () {
                expect(state.cache).toBeTruthy();
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                xit("should call AnalyticsUtil.trackView", function () {
                    expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.ALERTS_LIST.CONFIG.ANALYTICS.pageName);
                });

            });
        });

    });
})();
