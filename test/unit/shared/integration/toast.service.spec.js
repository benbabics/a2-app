(function () {
    "use strict";

    var service,
        $window,
        $ionicLoading,
        $cordovaToast = {},
        mockMessage = "Mock text";

    describe("A Toast Service", function () {

        beforeEach(function () {

            module("app.shared.integration");

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });
            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            module(function ($provide) {
                $provide.value("CommonService", {
                    "_": _
                });
            });

            module(function ($provide) {
                $provide.value("$cordovaToast", $cordovaToast);
            });

            $window = jasmine.createSpy("$window");

            $ionicLoading = jasmine.createSpyObj("$ionicLoading", ["show"]);

            module(function ($provide) {
                $provide.value("$window", $window);
                $provide.value("$ionicLoading", $ionicLoading);
            });
        });

        describe("when Cordova plugins are available", function () {
            beforeEach(function () {
                $window.plugins = jasmine.createSpy("plugins");
                $window.plugins.toast = jasmine.createSpy("toast");

                inject(function (ToastService) {
                    service = ToastService;
                });
            });

            it("should use the Cordova toast plugin", function () {
                expect(service).toEqual($cordovaToast);
            });
        });

        describe("when Cordova plugins are not available", function () {
            beforeEach(function () {
                delete $window.plugins;

                inject(function (ToastService) {
                    service = ToastService;
                });
            });

            describe("has a show function that", function () {

                describe("when the duration is set to 'short'", function () {
                    var duration;

                    beforeEach(function () {
                        duration = "short";

                        service.show(mockMessage, duration);
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

                        service.show(mockMessage, duration);
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

                        service.show(mockMessage, duration);
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
                    service.showShortTop(mockMessage);
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
                    service.showShortCenter(mockMessage);
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
                    service.showShortBottom(mockMessage);
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
                    service.showLongTop(mockMessage);
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
                    service.showLongCenter(mockMessage);
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
                    service.showLongBottom(mockMessage);
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
        return '<span class="toast-message">' + message + '</span>';
    }
}());