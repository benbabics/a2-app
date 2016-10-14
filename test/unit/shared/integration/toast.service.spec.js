(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to define functions after they're used

    var Toast,
        $window,
        $ionicLoading,
        $cordovaToast,
        PlatformUtil,
        mockMessage = TestUtils.getRandomStringThatIsAlphaNumeric(10);

    describe("A Toast Service", function () {

        beforeEach(function () {

            //mock dependencies:
            $cordovaToast = jasmine.createSpyObj("$cordovaToast", [
                "showShortTop",
                "showShortCenter",
                "showShortBottom",
                "showLongTop",
                "showLongCenter",
                "showLongBottom",
                "show"
            ]);
            $ionicLoading = jasmine.createSpyObj("$ionicLoading", ["show"]);

            module("app.shared.core");
            module("app.shared.dependencies");
            module("app.shared.logger");
            module("app.shared.integration", function ($provide) {
                $provide.value("$ionicLoading", $ionicLoading);
                $provide.value("$cordovaToast", $cordovaToast);
            });
            module(["$provide", _.partial(TestUtils.provideCommonMockDependencies, _, function (mocks) {
                PlatformUtil = mocks.PlatformUtil;
            })]);

            inject(function (_$window_) {
                $window = _$window_;
            });
        });

        describe("when Cordova plugins are available", function () {

            beforeEach(function () {
                PlatformUtil.platformHasCordova.and.returnValue(true);

                inject(function (_Toast_) {
                    Toast = _Toast_;
                });
            });

            it("should use the Cordova toast plugin", function () {
                expect(Toast).toEqual(jasmine.objectContaining($cordovaToast));
            });
        });

        describe("when Cordova plugins are not available", function () {

            beforeEach(function () {
                PlatformUtil.platformHasCordova.and.returnValue(false);

                inject(function (_Toast_) {
                    Toast = _Toast_;
                });
            });

            describe("has a show function that", function () {

                describe("when the duration is set to 'short'", function () {
                    var duration;

                    beforeEach(function () {
                        duration = "short";

                        Toast.show(mockMessage, duration);
                    });

                    it("should call $ionicLoading.show with the expected values", function () {
                        expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                            template: getExpectedToastTemplate(mockMessage),
                            duration: 2000
                        }));
                    });
                });

                describe("when the duration is set to 'long'", function () {
                    var duration;

                    beforeEach(function () {
                        duration = "long";

                        Toast.show(mockMessage, duration);
                    });

                    it("should call $ionicLoading.show with the expected values", function () {
                        expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                            template: getExpectedToastTemplate(mockMessage),
                            duration: 4000
                        }));
                    });
                });

                describe("when the duration is set to a number", function () {
                    var duration;

                    beforeEach(function () {
                        duration = TestUtils.getRandomInteger(1, 1000);

                        Toast.show(mockMessage, duration);
                    });

                    it("should call $ionicLoading.show with the expected values", function () {
                        expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                            template: getExpectedToastTemplate(mockMessage),
                            duration: duration
                        }));
                    });
                });

                describe("when the duration is an invalid string", function () {
                    var duration;

                    beforeEach(function () {
                        duration = "invalid duration string";

                        Toast.show(mockMessage, duration);
                    });

                    it("should call $ionicLoading.show with the expected values", function () {
                        expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                            template: getExpectedToastTemplate(mockMessage),
                            duration: 0
                        }));
                    });
                });
            });

            describe("has a showShortTop function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "short";
                    Toast.showShortTop(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: 2000
                    }));
                });
            });

            describe("has a showShortCenter function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "short";
                    Toast.showShortCenter(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: 2000
                    }));
                });
            });

            describe("has a showShortBottom function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "short";
                    Toast.showShortBottom(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: 2000
                    }));
                });
            });

            describe("has a showLongTop function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "long";
                    Toast.showLongTop(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: 4000
                    }));
                });
            });

            describe("has a showLongCenter function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "long";
                    Toast.showLongCenter(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: 4000
                    }));
                });
            });

            describe("has a showLongBottom function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "long";
                    Toast.showLongBottom(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: 4000
                    }));
                });
            });
        });
    });

    function getExpectedToastTemplate(message) {
        return "<span class=\"toast-message\">" + message + "</span>";
    }
}());
