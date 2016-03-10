(function () {
    "use strict";

    describe("A PlatformUtil service", function () {

        var PlatformUtil,
            Logger,
            $ionicPlatform,
            $rootScope,
            $q,
            resolveHandler,
            rejectHandler;

        beforeEach(function () {

            module("app.shared");

            //mock dependencies
            Logger = jasmine.createSpyObj("Logger", ["debug", "enabled", "error"]);

            module(function ($provide) {
                $provide.value("Logger", Logger);
            });

            inject(function (_$ionicPlatform_, _$q_, _$rootScope_, _PlatformUtil_) {
                PlatformUtil = _PlatformUtil_;
                $ionicPlatform = _$ionicPlatform_;
                $rootScope = _$rootScope_;
                $q = _$q_;
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has a platformHasCordova function that", function () {

            describe("when Cordova is available on the window", function () {

                beforeEach(function () {
                    window.cordova = {};
                });

                it("should return true", function () {
                    expect(PlatformUtil.platformHasCordova()).toBeTruthy();
                });
            });

            describe("when Cordova is NOT available on the window", function () {

                beforeEach(function () {
                    delete window.cordova;
                });

                it("should return false", function () {
                    expect(PlatformUtil.platformHasCordova()).toBeFalsy();
                });
            });
        });

        describe("has a waitForCordovaPlatform function that", function () {

            describe("when Ionic is ready", function () {

                beforeEach(function () {
                    spyOn($ionicPlatform, "ready").and.returnValue($q.resolve());
                });

                describe("when the current platform has Cordova", function () {

                    beforeEach(function () {
                        window.cordova = {};
                    });

                    describe("when a callback is given", function () {
                        var callback;

                        describe("when the callback is a function", function () {
                            var value;

                            beforeEach(function () {
                                callback = jasmine.createSpy("callback");
                                value = TestUtils.getRandomInteger(1, 100);

                                callback.and.returnValue(value);
                            });

                            beforeEach(function () {
                                PlatformUtil.waitForCordovaPlatform(callback)
                                    .then(resolveHandler)
                                    .catch(rejectHandler);

                                $rootScope.$digest();
                            });

                            it("should call the callback", function () {
                                expect(callback).toHaveBeenCalledWith();
                            });

                            it("should resolve the promise with the return value from the callback", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(value);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });
                        });

                        describe("when the callback is not a function", function () {

                            beforeEach(function () {
                                callback = TestUtils.getRandomStringThatIsAlphaNumeric(1, 10);
                            });

                            beforeEach(function () {
                                PlatformUtil.waitForCordovaPlatform(callback)
                                    .then(resolveHandler)
                                    .catch(rejectHandler);

                                $rootScope.$digest();
                            });

                            it("should resolve the promise", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(undefined);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });
                        });
                    });

                    describe("when a callback is NOT given", function () {

                        beforeEach(function () {
                            PlatformUtil.waitForCordovaPlatform()
                                .then(resolveHandler)
                                .catch(rejectHandler);

                            $rootScope.$digest();
                        });

                        it("should resolve the promise", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(undefined);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("when the current platform does NOT have Cordova", function () {

                    beforeEach(function () {
                        delete window.cordova;
                    });

                    describe("when a callback is given", function () {
                        var callback,
                            value;

                        beforeEach(function () {
                            callback = jasmine.createSpy("callback");
                            value = TestUtils.getRandomInteger(1, 100);

                            callback.and.returnValue(value);
                        });

                        beforeEach(function () {
                            PlatformUtil.waitForCordovaPlatform(callback)
                                .then(resolveHandler)
                                .catch(rejectHandler);

                            $rootScope.$digest();
                        });

                        it("should NOT call the callback", function () {
                            expect(callback).not.toHaveBeenCalled();
                        });

                        it("should reject the promise", function () {
                            expect(resolveHandler).not.toHaveBeenCalled();
                            expect(rejectHandler).toHaveBeenCalledWith(undefined);
                        });

                        it("should log the expected debug message", function () {
                            expect(Logger.debug).toHaveBeenCalledWith(
                                "waitForCordovaPlatform callback function skipped: Cordova is not available on this platform. " +
                                "Note: All future callbacks will also be skipped."
                            );
                        });

                        describe("when waitForCordovaPlatform is called an additional time", function () {

                            beforeEach(function () {
                                PlatformUtil.waitForCordovaPlatform();
                            });

                            it("should NOT log the expected debug message again", function () {
                                expect(Logger.debug).toHaveBeenCalledTimes(1);
                            });
                        });
                    });

                    describe("when a callback is NOT given", function () {

                        beforeEach(function () {
                            PlatformUtil.waitForCordovaPlatform()
                                .then(resolveHandler)
                                .catch(rejectHandler);

                            $rootScope.$digest();
                        });

                        it("should reject the promise", function () {
                            expect(resolveHandler).not.toHaveBeenCalled();
                            expect(rejectHandler).toHaveBeenCalledWith(undefined);
                        });

                        describe("when waitForCordovaPlatform is called an additional time", function () {

                            beforeEach(function () {
                                PlatformUtil.waitForCordovaPlatform();
                            });

                            it("should NOT log the expected debug message again", function () {
                                expect(Logger.debug).toHaveBeenCalledTimes(1);
                            });
                        });
                    });
                });
            });
        });
    });
})();
