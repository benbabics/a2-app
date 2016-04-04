(function () {
    "use strict";

    var $cordovaAppVersion,
        $q,
        $rootScope,
        clientId,
        cordovaGetVersionNumberDeferred,
        globals,
        platform,
        resolveHandler,
        rejectHandler,
        versionNumber,
        Logger,
        LoggerUtil,
        PlatformUtil,
        VersionManager,
        VersionStatusModel,
        VersionsResource,
        mockVersionStatus = {};

    describe("A Version Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.version");

            // mock dependencies
            $cordovaAppVersion = jasmine.createSpyObj("$cordovaAppVersion", ["getVersionNumber"]);
            Logger = jasmine.createSpyObj("Logger", ["enabled", "warn"]);
            LoggerUtil = jasmine.createSpyObj("LoggerUtil", ["getErrorMessage"]);
            PlatformUtil = jasmine.createSpyObj("PlatformUtil", ["getPlatform", "platformSupportsAppVersion", "waitForCordovaPlatform"]);
            VersionsResource = jasmine.createSpyObj("VersionsResource", ["getVersionStatus"]);
            mockVersionStatus = jasmine.createSpyObj("VersionStatusModel", ["VersionStatusModel", "set"]);

            module(function ($provide) {
                $provide.value("$cordovaAppVersion", $cordovaAppVersion);
                $provide.value("Logger", Logger);
                $provide.value("LoggerUtil", LoggerUtil);
                $provide.value("PlatformUtil", PlatformUtil);
                $provide.value("VersionsResource", VersionsResource);
            });

            inject(function (_$q_, _$rootScope_, _globals_, _VersionManager_, _VersionStatusModel_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                globals = _globals_;
                VersionManager = _VersionManager_;
                VersionStatusModel = _VersionStatusModel_;
            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            PlatformUtil.waitForCordovaPlatform.and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });
            cordovaGetVersionNumberDeferred = $q.defer();

            //setup mocks
            $cordovaAppVersion.getVersionNumber.and.returnValue(cordovaGetVersionNumberDeferred.promise);
        });

        describe("has a determineVersionStatus function that", function () {

            describe("when PlatformUtil.platformSupportsAppVersion returns false", function () {

                beforeEach(function () {
                    PlatformUtil.platformSupportsAppVersion.and.returnValue(false);

                    VersionManager.determineVersionStatus()
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

                var versionManagerFetchVersionStatusDeferred;

                beforeEach(function () {
                    versionManagerFetchVersionStatusDeferred = $q.defer();
                    spyOn(VersionManager, "fetchVersionStatus").and.returnValue(versionManagerFetchVersionStatusDeferred.promise);

                    PlatformUtil.platformSupportsAppVersion.and.returnValue(true);

                    VersionManager.determineVersionStatus()
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

                        var versionStatus;

                        beforeEach(function () {
                            versionStatus = TestUtils.getRandomVersionStatus(VersionStatusModel);
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

        describe("has a fetchVersionStatus function that", function () {

            var getVersionStatusDeferred,
                mockVersionStatusResponse = {
                    data: {
                        status: TestUtils.getRandomStringThatIsAlphaNumeric(5)
                    }
                };

            beforeEach(function () {
                getVersionStatusDeferred = $q.defer();

                clientId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                platform = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                versionNumber = TestUtils.getRandomStringThatIsAlphaNumeric(5);

                VersionsResource.getVersionStatus.and.returnValue(getVersionStatusDeferred.promise);

                VersionManager.fetchVersionStatus(clientId, platform, versionNumber)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when getting a version status", function () {

                it("should call VersionsResource.getVersionStatus", function () {
                    expect(VersionsResource.getVersionStatus).toHaveBeenCalledWith({
                        clientId     : clientId,
                        platform     : platform,
                        versionNumber: versionNumber
                    });
                });

            });

            describe("when the version status is fetched successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getVersionStatusDeferred.resolve(mockVersionStatusResponse);
                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        var versionStatusModel = new VersionStatusModel();

                        versionStatusModel.set(mockVersionStatusResponse.data);

                        expect(resolveHandler).toHaveBeenCalledWith(versionStatusModel);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getVersionStatusDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                });
            });

            describe("when retrieving the version status fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getVersionStatusDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

            });

        });

    });

})();
