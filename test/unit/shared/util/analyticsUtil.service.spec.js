(function () {
    "use strict";

    var AnalyticsUtil,
        CommonService,
        $cordovaGoogleAnalytics,
        $q;

    describe("An Analytics Util service", function () {

        beforeEach(function () {
            module("app.shared");

            //mock dependencies:
            $cordovaGoogleAnalytics = jasmine.createSpyObj("$cordovaGoogleAnalytics", [
                "setUserId",
                "startTrackerWithId",
                "trackEvent",
                "trackView"
            ]);

            module(function ($provide) {
                $provide.value("$cordovaGoogleAnalytics", $cordovaGoogleAnalytics);
            });

            inject(function (_$q_, _AnalyticsUtil_, _CommonService_) {
                AnalyticsUtil = _AnalyticsUtil_;
                CommonService = _CommonService_;
                $q = _$q_;
            });

            //setup spies:
            spyOn(CommonService, "waitForCordovaPlatform").and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });
        });

        describe("has a setUserId function that", function () {
            var userId;

            beforeEach(function () {
                userId = TestUtils.getRandomStringThatIsAlphaNumeric(7);

                AnalyticsUtil.setUserId(userId);
            });

            it("should call CommonService.waitForCordovaPlatform", function () {
                expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call $cordovaGoogleAnalytics.setUserId with the expected user id", function () {
                expect($cordovaGoogleAnalytics.setUserId).toHaveBeenCalledWith(userId);
            });
        });

        describe("has a startTracker function that", function () {
            var trackingId;

            beforeEach(function () {
                trackingId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                AnalyticsUtil.startTracker(trackingId);
            });

            it("should call CommonService.waitForCordovaPlatform", function () {
                expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call $cordovaGoogleAnalytics.startTrackerWithId with the expected tracking id", function () {
                expect($cordovaGoogleAnalytics.startTrackerWithId).toHaveBeenCalledWith(trackingId);
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

            it("should call CommonService.waitForCordovaPlatform", function () {
                expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call $cordovaGoogleAnalytics.trackEvent with the expected values", function () {
                expect($cordovaGoogleAnalytics.trackEvent).toHaveBeenCalledWith(category, action, label, value);
            });
        });

        describe("has a trackView function that", function () {
            var name;

            beforeEach(function () {
                name = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                AnalyticsUtil.trackView(name);
            });

            it("should call CommonService.waitForCordovaPlatform", function () {
                expect(CommonService.waitForCordovaPlatform).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call $cordovaGoogleAnalytics.trackView with the expected name", function () {
                expect($cordovaGoogleAnalytics.trackView).toHaveBeenCalledWith(name);
            });
        });
    });
}());