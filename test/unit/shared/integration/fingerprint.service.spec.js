(function () {
    "use strict";

    fdescribe("A Fingerprint Service", function () {

        var CONSTANTS,
            IOS_PASSCODE_NOT_SET = -5,
            IOS_TOUCH_ID_NOT_AVAILABLE = -6,
            IOS_TOUCH_ID_NOT_ENROLLED = -7,
            $q,
            $rootScope,
            globals,
            Fingerprint,
            FingerprintPlugin,
            FingerprintPluginAndroid,
            FingerprintPluginIos,
            PlatformUtil,
            SecureStorage,
            options,
            platform,
            pluginResolve,
            pluginReject,
            resolveHandler,
            rejectHandler;

        beforeEach(function () {

            //create mock dependencies:
            FingerprintPluginAndroid = jasmine.createSpyObj("window.FingerprintAuth", [
                "isAvailable",
                "show"
            ]);
            FingerprintPluginIos = jasmine.createSpyObj("window.plugins.touchid", [
                "didFingerprintDatabaseChange",
                "isAvailable",
                "verifyFingerprint",
                "verifyFingerprintWithCustomPasswordFallback"
            ]);

            //setup mock dependencies:
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            _.set(window, "FingerprintAuth", FingerprintPluginAndroid);
            _.set(window, "plugins.touchid", FingerprintPluginIos);
        });

        describe("when on Android", function () {

            beforeEach(function () {
                platform = "android";
                FingerprintPlugin = FingerprintPluginAndroid;

                setupMocks();
            });

            describe("is a service that", fingerprintServiceTestsCommon);

            describe("has a didFingerprintDatabaseChange function that", function () {

                beforeEach(function () {
                    Fingerprint.didFingerprintDatabaseChange()
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should resolve with false", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(false);
                });
            });

            describe("has a verify function that", function () {

                beforeEach(function () {
                    options = {
                        locale: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        error: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };
                });

                beforeEach(function () {
                    FingerprintPlugin.show.and.callFake(function (config, resolve, reject) {
                        pluginResolve = resolve;
                        pluginReject = reject;
                    });
                });

                describe("when given a clientId", function () {

                    beforeEach(function () {
                        options.clientId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    describe("when registering with a clientSecret", function () {

                        beforeEach(function () {
                            options.clientSecret = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        });

                        describe("when the passwordFallback is DEFAULT", function () {

                            beforeEach(function () {
                                options.passwordFallback = CONSTANTS.PASSWORD_FALLBACK.DEFAULT;
                            });

                            beforeEach(function() {
                                Fingerprint.verify(options)
                                    .then(resolveHandler)
                                    .catch(rejectHandler);
                                $rootScope.$digest();
                            });

                            it("should call FingerprintPlugin.show with the expected values", function () {
                                expect(FingerprintPlugin.show).toHaveBeenCalledWith(_.extend(_.pick(options, [
                                    "clientId",
                                    "clientSecret",
                                    "locale"
                                ]), {disableBackup: false}), jasmine.any(Function), jasmine.any(Function));
                            });

                            describe("it should behave such that", commonVerifyRegisterTests);
                        });

                        describe("when the passwordFallback is NOT DEFAULT", function () {

                            beforeEach(function () {
                                options.passwordFallback = CONSTANTS.PASSWORD_FALLBACK.NONE;
                            });

                            beforeEach(function () {
                                Fingerprint.verify(options)
                                    .then(resolveHandler)
                                    .catch(rejectHandler);
                                $rootScope.$digest();
                            });

                            it("should call FingerprintPlugin.show with the expected values", function () {
                                expect(FingerprintPlugin.show).toHaveBeenCalledWith(_.extend(_.pick(options, [
                                    "clientId",
                                    "clientSecret",
                                    "locale"
                                ]), {disableBackup: true}), jasmine.any(Function), jasmine.any(Function));
                            });

                            describe("it should behave such that", commonVerifyRegisterTests);
                        });
                    });

                    describe("when NOT registering with a clientSecret", function () {

                        describe("when the passwordFallback is DEFAULT", function () {

                            beforeEach(function () {
                                options.passwordFallback = CONSTANTS.PASSWORD_FALLBACK.DEFAULT;
                            });

                            beforeEach(function () {
                                Fingerprint.verify(options)
                                    .then(resolveHandler)
                                    .catch(rejectHandler);
                                $rootScope.$digest();
                            });

                            it("should call FingerprintPlugin.show with the expected values", function () {
                                expect(FingerprintPlugin.show).toHaveBeenCalledWith(_.extend(_.pick(options, [
                                    "clientId",
                                    "clientSecret",
                                    "locale"
                                ]), {
                                    clientSecret: options.clientId,
                                    disableBackup: false
                                }), jasmine.any(Function), jasmine.any(Function));
                            });

                            describe("it should behave such that", commonVerifyReadTests);
                        });

                        describe("when the passwordFallback is NOT DEFAULT", function () {

                            beforeEach(function () {
                                options.passwordFallback = CONSTANTS.PASSWORD_FALLBACK.NONE;
                            });

                            beforeEach(function () {
                                Fingerprint.verify(options)
                                    .then(resolveHandler)
                                    .catch(rejectHandler);
                                $rootScope.$digest();
                            });

                            it("should call FingerprintPlugin.show with the expected values", function () {
                                expect(FingerprintPlugin.show).toHaveBeenCalledWith(_.extend(_.pick(options, [
                                    "clientId",
                                    "clientSecret",
                                    "locale"
                                ]), {
                                    clientSecret: options.clientId,
                                    disableBackup: true
                                }), jasmine.any(Function), jasmine.any(Function));
                            });

                            describe("it should behave such that", commonVerifyReadTests);
                        });
                    });
                });

                describe("when NOT given a clientId", function () {

                    beforeEach(function() {
                        Fingerprint.verify(options)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should reject with the expected value", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(new Error("'clientId' is required for fingerprint verification."));
                    });
                });
            });
        });

        describe("when on iOS", function () {

            beforeEach(function () {
                platform = "ios";
                FingerprintPlugin = FingerprintPluginIos;

                setupMocks();
            });

            describe("is a service that", fingerprintServiceTestsCommon);

            describe("has a didFingerprintDatabaseChange function that", function () {

                beforeEach(function () {
                    FingerprintPlugin.didFingerprintDatabaseChange.and.callFake(function (resolve, reject) {
                        pluginResolve = resolve;
                        pluginReject = reject;
                    });
                });

                beforeEach(function () {
                    Fingerprint.didFingerprintDatabaseChange()
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call FingerprintPlugin.didFingerprintDatabaseChange", function () {
                    expect(FingerprintPlugin.didFingerprintDatabaseChange).toHaveBeenCalledWith(
                        jasmine.any(Function), jasmine.any(Function)
                    );
                });

                describe("when FingerprintPlugin.didFingerprintDatabaseChange resolves", function () {

                    beforeEach(function () {
                        pluginResolve();
                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                    });
                });

                describe("when FingerprintPlugin.didFingerprintDatabaseChange rejects", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        pluginReject(error);
                        $rootScope.$digest();
                    });

                    it("should reject with the expected value", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(error);
                    });
                });
            });

            describe("has a verify function that", function () {

                beforeEach(function () {
                    options = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        error: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };
                });

                describe("when given a clientId", function () {

                    beforeEach(function () {
                        options.clientId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    describe("when registering with a clientSecret", function () {
                        var setDeferred;

                        beforeEach(function () {
                            options.clientSecret = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        });

                        beforeEach(function () {
                            setDeferred = $q.defer();

                            SecureStorage.set.and.returnValue(setDeferred.promise);
                        });

                        describe("when the passwordFallback is CUSTOM", function () {

                            describe("it should behave such that", _.flow([customPasswordTests, commonVerifyRegisterTests]));
                        });

                        describe("when the passwordFallback is NOT CUSTOM", function () {

                            describe("it should behave such that", _.flow([notCustomPasswordTests, commonVerifyRegisterTests]));
                        });
                    });

                    describe("when NOT registering with a clientSecret", function () {
                        var getDeferred;

                        beforeEach(function () {
                            getDeferred = $q.defer();

                            SecureStorage.get.and.returnValue(getDeferred.promise);
                        });

                        describe("when the passwordFallback is CUSTOM", function () {

                            describe("it should behave such that", _.flow([customPasswordTests, commonVerifyReadTests]));
                        });

                        describe("when the passwordFallback is NOT CUSTOM", function () {

                            describe("it should behave such that", _.flow([notCustomPasswordTests, commonVerifyReadTests]));
                        });
                    });

                    function customPasswordTests() {

                        beforeEach(function () {
                            options.passwordFallback = CONSTANTS.PASSWORD_FALLBACK.CUSTOM;
                        });

                        beforeEach(function () {
                            FingerprintPlugin.verifyFingerprintWithCustomPasswordFallback.and.callFake(function (config, resolve, reject) {
                                pluginResolve = resolve;
                                pluginReject = reject;
                            });
                        });

                        beforeEach(function() {
                            Fingerprint.verify(options)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                            $rootScope.$digest();
                        });

                        it("should call FingerprintPlugin.verifyFingerprintWithCustomPasswordFallback with the expected values", function () {
                            expect(FingerprintPlugin.verifyFingerprintWithCustomPasswordFallback).toHaveBeenCalledWith(
                                _.get(options, "message"), jasmine.any(Function), jasmine.any(Function)
                            );
                        });
                    }

                    function notCustomPasswordTests() {

                        beforeEach(function () {
                            options.passwordFallback = CONSTANTS.PASSWORD_FALLBACK.DEFAULT;
                        });

                        beforeEach(function () {
                            FingerprintPlugin.verifyFingerprint.and.callFake(function (config, resolve, reject) {
                                pluginResolve = resolve;
                                pluginReject = reject;
                            });
                        });

                        beforeEach(function () {
                            Fingerprint.verify(options)
                                .then(resolveHandler)
                                .catch(rejectHandler);
                            $rootScope.$digest();
                        });

                        it("should call FingerprintPlugin.verifyFingerprint with the expected values", function () {
                            expect(FingerprintPlugin.verifyFingerprint).toHaveBeenCalledWith(
                                _.get(options, "message"), jasmine.any(Function), jasmine.any(Function)
                            );
                        });
                    }
                });

                describe("when NOT given a clientId", function () {

                    beforeEach(function() {
                        Fingerprint.verify(options)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                        $rootScope.$digest();
                    });

                    it("should reject with the expected value", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(new Error("'clientId' is required for fingerprint verification."));
                    });
                });
            });
        });

        describe("when on an unsupported platform", function () {

            beforeEach(function () {
                platform = "browser";
                FingerprintPlugin = null;

                setupMocks();
            });

            describe("has an isAvailable function that", function () {

                beforeEach(function () {
                    Fingerprint.isAvailable()
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should reject with the expected values", function () {
                    expect(rejectHandler).toHaveBeenCalledWith({
                        isDeviceSupported: false,
                        isSetup: false
                    });
                });
            });
        });

        function fingerprintServiceTestsCommon() {

            describe("has an isAvailable function that", function () {
                var secureStorageDeferred,
                    pluginResolve,
                    pluginReject;

                beforeEach(function () {
                    secureStorageDeferred = $q.defer();

                    SecureStorage.isAvailable.and.returnValue(secureStorageDeferred.promise);
                    FingerprintPlugin.isAvailable.and.callFake(function (resolve, reject) {
                        pluginResolve = resolve;
                        pluginReject = reject;
                    });

                    Fingerprint.isAvailable()
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call SecureStorage.isAvailable", function () {
                    expect(SecureStorage.isAvailable).toHaveBeenCalled();
                });

                describe("when secure storage is available", function () {

                    beforeEach(function () {
                        secureStorageDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call FingerprintPlugin.isAvailable", function () {
                        expect(FingerprintPlugin.isAvailable).toHaveBeenCalled();
                    });

                    describe("when FingerprintPlugin.isAvailable resolves", function () {
                        var availabilityDetails;

                        describe("when the platform is Android", function () {

                            beforeEach(function () {
                                availabilityDetails = {
                                    isHardwareDetected: TestUtils.getRandomBoolean(),
                                    hasEnrolledFingerprints: TestUtils.getRandomBoolean()
                                };
                            });

                            describe("when fingerprint authentication is available", function () {

                                beforeEach(function () {
                                    availabilityDetails.isAvailable = true;

                                    pluginResolve(availabilityDetails);
                                    $rootScope.$digest();
                                });

                                it("should resolve the expected values", function () {
                                    if (platform === "android") {
                                        expect(resolveHandler).toHaveBeenCalledWith(availabilityDetails);
                                    }
                                });
                            });

                            describe("when fingerprint authentication is NOT available", function () {

                                beforeEach(function () {
                                    availabilityDetails.isAvailable = false;

                                    pluginResolve(availabilityDetails);
                                    $rootScope.$digest();
                                });

                                it("should reject with the expected values", function () {
                                    if (platform === "android") {
                                        expect(rejectHandler).toHaveBeenCalledWith({
                                            isDeviceSupported: _.get(availabilityDetails, "isHardwareDetected"),
                                            isSetup: _.get(availabilityDetails, "hasEnrolledFingerprints")
                                        });
                                    }
                                });
                            });
                        });

                        describe("when the platform is NOT Android", function () {

                            beforeEach(function () {
                                pluginResolve(availabilityDetails);
                                $rootScope.$digest();
                            });

                            it("should resolve with the expected values", function () {
                                if (platform !== "android") {
                                    expect(resolveHandler).toHaveBeenCalledWith(availabilityDetails);
                                }
                            });
                        });
                    });

                    describe("when FingerprintPlugin.isAvailable rejects", function () {

                        describe("when the platform is iOS", function () {
                            var error;

                            describe("when the error code is IOS_TOUCH_ID_NOT_AVAILABLE", function () {

                                beforeEach(function () {
                                    error = {code: IOS_TOUCH_ID_NOT_AVAILABLE};
                                    pluginReject(error);
                                    $rootScope.$digest();
                                });

                                it("should reject with the expected values", function () {
                                    if (platform === "ios") {
                                        expect(rejectHandler).toHaveBeenCalledWith({
                                            isDeviceSupported: false,
                                            isSetup: false
                                        });
                                    }
                                });
                            });

                            describe("when the error code is NOT IOS_TOUCH_ID_NOT_AVAILABLE", function () {

                                describe("when the error code is IOS_PASSCODE_NOT_SET", function () {

                                    beforeEach(function () {
                                        error = {code: IOS_PASSCODE_NOT_SET};
                                        pluginReject(error);
                                        $rootScope.$digest();
                                    });

                                    it("should reject with the expected values", function () {
                                        if (platform === "ios") {
                                            expect(rejectHandler).toHaveBeenCalledWith({
                                                isDeviceSupported: true,
                                                isSetup: false
                                            });
                                        }
                                    });
                                });

                                describe("when the error code is IOS_TOUCH_ID_NOT_ENROLLED", function () {

                                    beforeEach(function () {
                                        error = {code: IOS_TOUCH_ID_NOT_ENROLLED};
                                        pluginReject(error);
                                        $rootScope.$digest();
                                    });

                                    it("should reject with the expected values", function () {
                                        if (platform === "ios") {
                                            expect(rejectHandler).toHaveBeenCalledWith({
                                                isDeviceSupported: true,
                                                isSetup: false
                                            });
                                        }
                                    });
                                });

                                describe("when the error code is something else", function () {

                                    beforeEach(function () {
                                        error = {code: TestUtils.getRandomInteger(1000, 10000)};
                                        pluginReject(error);
                                        $rootScope.$digest();
                                    });

                                    it("should reject with the expected values", function () {
                                        if (platform === "ios") {
                                            expect(rejectHandler).toHaveBeenCalledWith({
                                                isDeviceSupported: true,
                                                isSetup: true
                                            });
                                        }
                                    });
                                });
                            });
                        });

                        describe("when the platform is NOT iOS", function () {

                            beforeEach(function () {
                                pluginReject();
                                $rootScope.$digest();
                            });

                            it("should reject with the expected values", function () {
                                if (platform !== "ios") {
                                    expect(rejectHandler).toHaveBeenCalledWith({
                                        isDeviceSupported: false,
                                        isSetup: false
                                    });
                                }
                            });
                        });

                    });
                });

                describe("when secure storage is NOT available", function () {

                    beforeEach(function () {
                        secureStorageDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should reject with the expected values", function () {
                        expect(rejectHandler).toHaveBeenCalledWith({
                            isDeviceSupported: false,
                            isSetup: false
                        });
                    });
                });
            });
        }

        function commonVerifyRegisterTests() {
            var setDeferred;

            beforeEach(function () {
                setDeferred = $q.defer();

                SecureStorage.set.and.returnValue(setDeferred.promise);
            });

            describe("when FingerprintPlugin.show resolves", function () {
                var authResponse;

                beforeEach(function () {
                    authResponse = {
                        someValue: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    pluginResolve(authResponse);
                    $rootScope.$digest();
                });

                it("should call SecureStorage.set with the expected values", function () {
                    expect(SecureStorage.set).toHaveBeenCalledWith(options.clientId, options.clientSecret);
                });

                describe("when SecureStorage.set resolves", function () {

                    beforeEach(function () {
                        setDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should resolve with the expected value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(
                            _.extend({clientSecret: options.clientSecret}, authResponse)
                        );
                    });
                });

                describe("when SecureStorage.set rejects", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        setDeferred.reject(error);
                        $rootScope.$digest();
                    });

                    it("should reject with the expected value", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(error);
                    });
                });
            });

            describe("when FingerprintPlugin.show rejects", function () {
                var error;

                beforeEach(function () {
                    error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    pluginReject(error);
                    $rootScope.$digest();
                });

                it("should reject with the expected value", function () {
                    expect(rejectHandler).toHaveBeenCalledWith(error);
                });
            });
        }

        function commonVerifyReadTests() {
            var getDeferred;

            beforeEach(function () {
                getDeferred = $q.defer();

                SecureStorage.get.and.returnValue(getDeferred.promise);
            });

            describe("when FingerprintPlugin.show resolves", function () {
                var authResponse;

                beforeEach(function () {
                    authResponse = {
                        someValue: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    pluginResolve(authResponse);
                    $rootScope.$digest();
                });

                it("should call SecureStorage.get with the expected values", function () {
                    expect(SecureStorage.get).toHaveBeenCalledWith(options.clientId);
                });

                describe("when SecureStorage.get resolves", function () {
                    var getResponse;

                    beforeEach(function () {
                        getResponse = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    });

                    beforeEach(function () {
                        getDeferred.resolve(getResponse);
                        $rootScope.$digest();
                    });

                    it("should resolve with the expected value", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(
                            _.extend({clientSecret: getResponse}, authResponse)
                        );
                    });
                });

                describe("when SecureStorage.get rejects", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        getDeferred.reject(error);
                        $rootScope.$digest();
                    });

                    it("should reject with the expected value", function () {
                        expect(rejectHandler).toHaveBeenCalledWith(error);
                    });
                });
            });

            describe("when FingerprintPlugin.show rejects", function () {
                var error;

                beforeEach(function () {
                    error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    pluginReject(error);
                    $rootScope.$digest();
                });

                it("should reject with the expected value", function () {
                    expect(rejectHandler).toHaveBeenCalledWith(error);
                });
            });
        }

        function setupMocks() {

            module("app.shared", ["$provide", _.partial(TestUtils.provideCommonMockDependencies, _, function (mocks) {
                PlatformUtil = mocks.PlatformUtil;
                SecureStorage = mocks.SecureStorage;

                PlatformUtil.getPlatform.and.returnValue(platform);

                //temporarily needed until we can inject $q
                PlatformUtil.waitForCordovaPlatform.and.callFake(function (callback) {
                    if (callback) {
                        return callback();
                    }
                    else {
                        return TestUtils.resolvedPromise();
                    }
                });
            })]);

            inject(function (_$q_, _globals_, _$rootScope_, _Fingerprint_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                Fingerprint = _Fingerprint_;
                globals = _globals_;

                CONSTANTS = globals.FINGERPRINT_AUTH;

                PlatformUtil.waitForCordovaPlatform = jasmine.createSpy("waitForCordovaPlatform")
                    .and.callFake(function (callback) {
                        return $q.resolve().then(callback || _.noop);
                    });
            });
        }
    });
})();
