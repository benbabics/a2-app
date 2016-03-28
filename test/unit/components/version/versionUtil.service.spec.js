(function () {
    "use strict";

    describe("A VersionUtil service", function () {

        var $cordovaAppVersion,
            $rootScope,
            $q,
            Logger,
            LoggerUtil,
            PlatformUtil,
            VersionManager,
            VersionUtil,
            cordovaGetVersionNumberDeferred,
            globals,
            versionManagerFetchVersionStatusDeferred,
            versionStatus,
            resolveHandler,
            rejectHandler;

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.version");

            //mock dependencies
            $cordovaAppVersion = jasmine.createSpyObj("$cordovaAppVersion", ["getVersionNumber"]);
            Logger = jasmine.createSpyObj("Logger", ["enabled", "warn"]);
            LoggerUtil = jasmine.createSpyObj("LoggerUtil", ["getErrorMessage"]);
            PlatformUtil = jasmine.createSpyObj("PlatformUtil", ["getPlatform", "platformSupportsAppVersion", "waitForCordovaPlatform"]);
            VersionManager = jasmine.createSpyObj("VersionManager", ["fetchVersionStatus"]);

            module(function ($provide) {
                $provide.value("$cordovaAppVersion", $cordovaAppVersion);
                $provide.value("Logger", Logger);
                $provide.value("LoggerUtil", LoggerUtil);
                $provide.value("PlatformUtil", PlatformUtil);
                $provide.value("VersionManager", VersionManager);
            });

            inject(function (_$q_, _$rootScope_, _globals_, VersionStatusModel, _VersionUtil_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                globals = _globals_;
                VersionUtil = _VersionUtil_;

                versionStatus = TestUtils.getRandomVersionStatus(VersionStatusModel);
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            PlatformUtil.waitForCordovaPlatform.and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });
            cordovaGetVersionNumberDeferred = $q.defer();
            versionManagerFetchVersionStatusDeferred = $q.defer();

            //setup mocks
            $cordovaAppVersion.getVersionNumber.and.returnValue(cordovaGetVersionNumberDeferred.promise);
            VersionManager.fetchVersionStatus.and.returnValue(versionManagerFetchVersionStatusDeferred.promise);

        });

        describe("has a determineVersionStatus function that", function () {

            describe("when PlatformUtil.platformSupportsAppVersion returns false", function () {

                beforeEach(function () {
                    PlatformUtil.platformSupportsAppVersion.and.returnValue(false);

                    VersionUtil.determineVersionStatus()
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call PlatformUtil.waitForCordovaPlatform", function () {
                    expect(PlatformUtil.waitForCordovaPlatform).toHaveBeenCalledWith();
                });

                it("should call PlatformUtil.platformSupportsAppVersion", function () {
                    expect(PlatformUtil.platformSupportsAppVersion).toHaveBeenCalledWith();
                });

                it("should call Logger.warn", function () {
                    expect(Logger.warn).toHaveBeenCalledWith("Platform does not support application versioning");
                });

                it("should resolve with NO_UPDATE", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.NO_UPDATE);
                });

            });

            describe("when PlatformUtil.platformSupportsAppVersion returns true", function () {

                beforeEach(function () {
                    PlatformUtil.platformSupportsAppVersion.and.returnValue(true);

                    VersionUtil.determineVersionStatus()
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call $cordovaAppVersion.getVersionNumber", function () {
                    expect($cordovaAppVersion.getVersionNumber).toHaveBeenCalledWith();
                });

                describe("when $cordovaAppVersion.getVersionNumber resolves", function () {
                    var platform,
                        versionNumber;

                    beforeEach(function () {
                        platform = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                        versionNumber = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        PlatformUtil.getPlatform.and.returnValue(platform);
                        cordovaGetVersionNumberDeferred.resolve(versionNumber);

                        $rootScope.$digest();
                    });

                    it("should call VersionManager.fetchVersionStatus", function () {
                        expect(VersionManager.fetchVersionStatus).toHaveBeenCalledWith(globals.AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID, platform, versionNumber);
                    });

                    describe("when VersionManager.fetchVersionStatus resolves", function () {

                        beforeEach(function () {
                            versionManagerFetchVersionStatusDeferred.resolve(versionStatus);

                            $rootScope.$digest();
                        });

                        it("should resolve with the version status", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(versionStatus);
                        });

                    });

                    describe("when VersionManager.fetchVersionStatus rejects", function () {
                        var error;

                        beforeEach(function () {
                            error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                            versionManagerFetchVersionStatusDeferred.reject(error);

                            $rootScope.$digest();
                        });

                        it("should call Logger.warn", function () {
                            var expectedError = "Determining Version Status failed: " + LoggerUtil.getErrorMessage(error);

                            expect(Logger.warn).toHaveBeenCalledWith(expectedError);
                        });

                        it("should resolve with NO_UPDATE", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.NO_UPDATE);
                        });

                    });

                });

                describe("when $cordovaAppVersion.getVersionNumber rejects", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        cordovaGetVersionNumberDeferred.reject(error);

                        $rootScope.$digest();
                    });

                    it("should call Logger.warn", function () {
                        var expectedError = "Determining Version Status failed: " + LoggerUtil.getErrorMessage(error);

                        expect(Logger.warn).toHaveBeenCalledWith(expectedError);
                    });

                    it("should resolve with NO_UPDATE", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.NO_UPDATE);
                    });

                });

            });

        });

    });

})();
