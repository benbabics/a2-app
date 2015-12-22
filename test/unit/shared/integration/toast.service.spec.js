(function () {
    "use strict";

    var ToastService,
        $window,
        $ionicLoading,
        $cordovaToast,
        CommonService,
        mockMessage = TestUtils.getRandomStringThatIsAlphaNumeric(10);

    describe("A Toast Service", function () {

        beforeEach(function () {

            module("app.shared.core");
            module("app.shared.dependencies");
            module("app.shared.logger");
            module("app.shared.integration");

            //mock dependencies:
            $cordovaToast = jasmine.createSpyObj("$cordovaToast", ["showShortTop", "showShortCenter", "showShortBottom",
                "showLongTop", "showLongCenter", "showLongBottom", "show"]);
            $ionicLoading = jasmine.createSpyObj("$ionicLoading", ["show"]);

            module(function ($provide) {
                $provide.value("$ionicLoading", $ionicLoading);
                $provide.value("$cordovaToast", $cordovaToast);
            });

            inject(function (_$window_, _CommonService_) {
                $window = _$window_;
                CommonService = _CommonService_;
            });
        });

        describe("when Cordova plugins are available", function () {

            beforeEach(function () {
                spyOn(CommonService, "platformHasCordova").and.returnValue(true);

                inject(function (_ToastService_) {
                    ToastService = _ToastService_;
                });
            });

            it("should use the Cordova toast plugin", function () {
                expect(ToastService).toEqual(jasmine.objectContaining($cordovaToast));
            });
        });

        describe("when Cordova plugins are not available", function () {

            beforeEach(function () {
                spyOn(CommonService, "platformHasCordova").and.returnValue(false);

                inject(function (_ToastService_) {
                    ToastService = _ToastService_;
                });
            });

            describe("has a show function that", function () {

                describe("when the duration is set to 'short'", function () {
                    var duration;

                    beforeEach(function () {
                        duration = "short";

                        ToastService.show(mockMessage, duration);
                    });

                    it("should call $ionicLoading.show with the expected values", function () {
                        var expectedDuration = mapDurationString(duration);

                        expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                            template: getExpectedToastTemplate(mockMessage),
                            duration: expectedDuration
                        }));
                    });
                });

                describe("when the duration is set to 'long'", function () {
                    var duration;

                    beforeEach(function () {
                        duration = "long";

                        ToastService.show(mockMessage, duration);
                    });

                    it("should call $ionicLoading.show with the expected values", function () {
                        var expectedDuration = mapDurationString(duration);

                        expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                            template: getExpectedToastTemplate(mockMessage),
                            duration: expectedDuration
                        }));
                    });
                });

                describe("when the duration is an invalid string", function () {
                    var duration;

                    beforeEach(function () {
                        duration = "invalid duration string";

                        ToastService.show(mockMessage, duration);
                    });

                    it("should call $ionicLoading.show with the expected values", function () {
                        var expectedDuration = 0;

                        expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                            template: getExpectedToastTemplate(mockMessage),
                            duration: expectedDuration
                        }));
                    });
                });
            });

            describe("has a showShortTop function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "short";
                    ToastService.showShortTop(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    var expectedDuration = mapDurationString(duration);

                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: expectedDuration
                    }));
                });
            });

            describe("has a showShortCenter function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "short";
                    ToastService.showShortCenter(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    var expectedDuration = mapDurationString(duration);

                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: expectedDuration
                    }));
                });
            });

            describe("has a showShortBottom function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "short";
                    ToastService.showShortBottom(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    var expectedDuration = mapDurationString(duration);

                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: expectedDuration
                    }));
                });
            });

            describe("has a showLongTop function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "long";
                    ToastService.showLongTop(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    var expectedDuration = mapDurationString(duration);

                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: expectedDuration
                    }));
                });
            });

            describe("has a showLongCenter function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "long";
                    ToastService.showLongCenter(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    var expectedDuration = mapDurationString(duration);

                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: expectedDuration
                    }));
                });
            });

            describe("has a showLongBottom function that", function () {
                var duration;

                beforeEach(function () {
                    duration = "long";
                    ToastService.showLongBottom(mockMessage);
                });

                it("should call $ionicLoading.show with the expected values", function () {
                    var expectedDuration = mapDurationString(duration);

                    expect($ionicLoading.show).toHaveBeenCalledWith(jasmine.objectContaining({
                        template: getExpectedToastTemplate(mockMessage),
                        duration: expectedDuration
                    }));
                });
            });
        });
    });

    function mapDurationString(duration) {
        if (duration.toLowerCase() === "short") {
            return 2000;
        } else if (duration.toLowerCase() === "long") {
            return 4000;
        }
        return 0;
    }

    function getExpectedToastTemplate(message) {
        return "<span class=\"toast-message\">" + message + "</span>";
    }
}());