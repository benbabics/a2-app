(function () {
    "use strict";

    describe("An Alert Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockAlertItem,
            AlertsManager,
            AnalyticsUtil,
            mockGlobals = {
                ALERTS_LIST: {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            };

        beforeEach(function () {

            module("app.shared");
            module("app.components.alerts");
            module("app.html");

            // mock dependencies
            AlertsManager = jasmine.createSpyObj("AlertsManager", ["fetchAlerts"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", ["trackView"]);

            module(function ($provide, sharedGlobals) {
                $provide.value("AlertsManager", AlertsManager);
                $provide.value("AnalyticsUtil", AnalyticsUtil);
                $provide.value("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_, AlertModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                mockAlertItem = TestUtils.getRandomPostedTransaction(AlertModel);
            });
        });

        describe("has an alerts state that", function () {
            var state,
                stateName = "alerts";

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
                expect(state.url).toEqual("/alerts");
            });

            it("should define a view on the root container", function() {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });
        });

        describe("has a alerts.list state that", function () {
            var state,
                stateName = "alerts.list";

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
                    expect(AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.ALERTS_LIST.CONFIG.ANALYTICS.pageName);
                });

            });
        });

    });
})();
