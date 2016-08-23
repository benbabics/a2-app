(function () {
    "use strict";

    var AnalyticsUtil,
        Logger,
        analytics,
        $q,
        DISPATCH_INTERVAL = 30;

    describe("An Analytics Util service", function () {

        beforeEach(function () {
            //mock dependencies:
            analytics = jasmine.createSpyObj("analytics", [
                "set",
                "setTrackingId",
                "sendEvent",
                "sendAppView",
                "setDispatchInterval"
            ]);

            module("app.shared", function ($provide) {
                TestUtils.provideCommonMockDependencies($provide, function (mocks) {
                    delete mocks.AnalyticsUtil;

                    mocks.PlatformUtil.waitForCordovaPlatform.and.callFake(function () {
                        return TestUtils.resolvedPromise(analytics);
                    });

                    Logger = mocks.Logger;
                });

                $provide.value("$ionicPlatform", {
                    ready: jasmine.createSpy("ready").and.callFake(function () {
                        //execute all analytics commands with the mock analytics object
                        return TestUtils.resolvedPromise(analytics);
                    }),
                    registerBackButtonAction: jasmine.createSpy("registerBackButtonAction")
                });
            });

            inject(function (_$q_, _AnalyticsUtil_, _Logger_) {
                AnalyticsUtil = _AnalyticsUtil_;
                Logger = _Logger_;
                $q = _$q_;
            });
        });

        it("should call analytics.setDispatchInterval with the expected values", function () {
            expect(analytics.setDispatchInterval).toHaveBeenCalledWith(DISPATCH_INTERVAL, jasmine.any(Function), jasmine.any(Function));
        });

        //TODO - Figure out how to test that analytics.setLogLevel(analytics.LogLevel.VERBOSE) is call ONLY if Logger.isEnabled returns true

        describe("has a setUserId function that", function () {
            var userId;

            beforeEach(function () {
                userId = TestUtils.getRandomStringThatIsAlphaNumeric(7);

                AnalyticsUtil.setUserId(userId);
            });

            it("should call analytics.set with the expected values", function () {
                expect(analytics.set).toHaveBeenCalledWith("&uid", userId, jasmine.any(Function), jasmine.any(Function));
            });
        });

        describe("has a startTracker function that", function () {
            var trackerId;

            beforeEach(function () {
                trackerId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when the given trackerId is NOT the active tracker", function () {

                beforeEach(function () {
                    AnalyticsUtil.startTracker(trackerId);
                });

                it("should call analytics.setTrackingId with the expected values", function () {
                    expect(analytics.setTrackingId).toHaveBeenCalledWith(trackerId, jasmine.any(Function), jasmine.any(Function));
                });

                describe("when called again with the same trackerId", function () {

                    beforeEach(function () {
                        AnalyticsUtil.startTracker(trackerId);
                    });

                    it("should NOT call analytics.setTrackingId again", function () {
                        expect(analytics.setTrackingId.calls.count()).toEqual(1);
                    });

                    it("should call Logger.info with the expected message", function () {
                        var expectedMessage = "The active analytics tracker is already set to " + trackerId;

                        expect(Logger.info).toHaveBeenCalledWith(expectedMessage);
                    });
                });
            });
        });

        describe("has a trackEvent function that", function () {
            var category,
                action,
                label,
                value;

            beforeEach(function () {
                category = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                action = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                label = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                value = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                AnalyticsUtil.trackEvent(category, action, label, value);
            });

            it("should call analytics.sendEvent with the expected values", function () {
                expect(analytics.sendEvent).toHaveBeenCalledWith(category, action, label, value, jasmine.any(Function), jasmine.any(Function));
            });
        });

        describe("has a trackView function that", function () {
            var name;

            beforeEach(function () {
                name = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                AnalyticsUtil.trackView(name);
            });

            it("should call analytics.sendAppView with the expected name", function () {
                expect(analytics.sendAppView).toHaveBeenCalledWith(name, jasmine.any(Function), jasmine.any(Function));
            });
        });
    });
}());