(function () {
    "use strict";

    var brandAssets,
        brandAsset,
        binary,
        data,
        bundledAssetDirectory,
        resourcePath,
        fetchResourceDeferred,
        writeFileDeferred,
        checkDirectoryExistsDeferred,
        checkFileExistsDeferred,
        readFileDeferred,
        createDirectoryDeferred,
        removeFileDeferred,
        LAST_BRAND_UPDATE_DATE,
        BRAND,
        mocks = {};

    describe("A Brand Util service", function () {

        module.sharedInjector();

        beforeAll(function () {
            this.includeDependencies({mocks: mocks}, this);

            //mock dependencies:
            mocks.BrandManager = jasmine.createSpyObj("BrandManager", ["getGenericAnalyticsTrackingId", "getGenericBrandAssets", "loadBundledBrand"]);
            mocks.FileUtil = jasmine.createSpyObj("FileUtil", [
                "checkFileExists",
                "checkDirectoryExists",
                "createDirectory",
                "readFile",
                "removeFile",
                "writeFile"
            ]);

            module(function ($provide) {
                $provide.value("BrandManager", mocks.BrandManager);
                $provide.value("FileUtil", mocks.FileUtil);
            });

            inject(function ($localStorage, $rootScope, $state, $q, $window, globals, moment, BrandAssetModel, BrandUtil, LoggerUtil) {
                mocks.BrandUtil = BrandUtil;
                mocks.LoggerUtil = LoggerUtil;
                mocks.BrandAssetModel = BrandAssetModel;
                mocks.$q = $q;
                mocks.$rootScope = $rootScope;
                mocks.$window = $window;
                mocks.$localStorage = $localStorage;
                mocks.globals = globals;
                mocks.moment = moment;
                mocks.$state = $state;

                LAST_BRAND_UPDATE_DATE = mocks.globals.LOCALSTORAGE.KEYS.LAST_BRAND_UPDATE_DATE;
                BRAND = mocks.globals.BRAND;

                mocks.rejectHandler = jasmine.createSpy("mocks.rejectHandler");
                mocks.resolveHandler = jasmine.createSpy("mocks.resolveHandler");
            });
        });

        beforeEach(function () {
            //setup mocks:
            brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
            brandAsset = TestUtils.getRandomValueFromArray(brandAssets);
            binary = TestUtils.getRandomBoolean();
            data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
            resourcePath = getAssetResourceSubPath(brandAsset);
            bundledAssetDirectory = getDefaultBundledBrandPath();
            
            fetchResourceDeferred = mocks.$q.defer();
            writeFileDeferred = mocks.$q.defer();
            checkDirectoryExistsDeferred = mocks.$q.defer();
            checkFileExistsDeferred = mocks.$q.defer();
            readFileDeferred = mocks.$q.defer();
            createDirectoryDeferred = mocks.$q.defer();
            removeFileDeferred = mocks.$q.defer();

            mocks.FileUtil.writeFile.and.returnValue(writeFileDeferred.promise);
            mocks.FileUtil.checkDirectoryExists.and.returnValue(checkDirectoryExistsDeferred.promise);
            mocks.FileUtil.checkFileExists.and.returnValue(checkFileExistsDeferred.promise);
            mocks.FileUtil.readFile.and.returnValue(readFileDeferred.promise);
            mocks.FileUtil.createDirectory.and.returnValue(createDirectoryDeferred.promise);
            mocks.FileUtil.removeFile.and.returnValue(removeFileDeferred.promise);

            //setup spies:
            spyOn(brandAsset, "fetchResource").and.returnValue(fetchResourceDeferred.promise);
            spyOn(mocks.$state, "transitionTo").and.stub();
        });

        afterEach(function () {
            //reset all mocks
            _.forEach(mocks, TestUtils.resetMock);
        });

        afterAll(function () {
            brandAssets = null;
            brandAsset = null;
            binary = null;
            data = null;
            bundledAssetDirectory = null;
            resourcePath = null;
            fetchResourceDeferred = null;
            writeFileDeferred = null;
            checkDirectoryExistsDeferred = null;
            checkFileExistsDeferred = null;
            readFileDeferred = null;
            createDirectoryDeferred = null;
            removeFileDeferred = null;
            LAST_BRAND_UPDATE_DATE = null;
            BRAND = null;
            mocks = null;
        });

        describe("has a getAssetResourceData function that", function () {

            beforeEach(function () {
                mocks.BrandUtil.getAssetResourceData(brandAsset, binary)
                    .then(mocks.resolveHandler)
                    .catch(mocks.rejectHandler);
            });

            it("should call mocks.FileUtil.checkFileExists with the expected values", function () {
                expect(mocks.FileUtil.checkFileExists).toHaveBeenCalledWith(getAssetResourceSubPath(brandAsset));
            });

            describe("when the resource data file already exists", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.resolve();
                    mocks.$rootScope.$digest();
                });

                it("should read the file", function () {
                    expect(mocks.FileUtil.readFile).toHaveBeenCalledWith(resourcePath, binary);
                });

                describe("when reading the file is successful", function () {

                    beforeEach(function () {
                        readFileDeferred.resolve(data);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise resolving with the resource data", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                    });
                });

                describe("when reading the file is NOT successful", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readFileDeferred.reject(error);
                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "Resource data file not found for brand asset: " + brandAsset.assetSubtypeId;

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when the resource data file does NOT already exist", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.reject();
                    mocks.$rootScope.$digest();
                });

                it("should reject", function () {
                    var expectedError = "Resource data file not found for brand asset: " + brandAsset.assetSubtypeId;

                    expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                });
            });
        });

        describe("has a getAssetResourceDirectory function that", function () {

            describe("when given a valid brandAsset", function () {

                it("should return the expected resourceDirectory", function () {
                    expect(mocks.BrandUtil.getAssetResourceDirectory(brandAsset)).toEqual(getAssetResourceDirectory(brandAsset));
                });
            });

            describe("when given a null brandAsset", function () {

                it("should reject", function () {
                    var expectedError = "Failed to get brand asset resource directory.";

                    expect(function () {
                        mocks.BrandUtil.getAssetResourceDirectory(null);
                    }).toThrowError(expectedError);
                });
            });

            describe("when given an undefined brandAsset", function () {

                it("should reject", function () {
                    var expectedError = "Failed to get brand asset resource directory.";

                    expect(function () {
                        mocks.BrandUtil.getAssetResourceDirectory(undefined);
                    }).toThrowError(expectedError);
                });
            });
        });

        describe("has a getAssetResourceFile function that", function () {

            beforeEach(function () {
                mocks.BrandUtil.getAssetResourceFile(brandAsset, binary)
                    .then(mocks.resolveHandler)
                    .catch(mocks.rejectHandler);
            });

            it("should call mocks.FileUtil.checkFileExists with the expected values", function () {
                expect(mocks.FileUtil.checkFileExists).toHaveBeenCalledWith(getAssetResourceSubPath(brandAsset));
            });

            describe("when the resource data file already exists", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.resolve();
                    mocks.$rootScope.$digest();
                });

                it("should read the file", function () {
                    expect(mocks.FileUtil.readFile).toHaveBeenCalledWith(resourcePath, binary);
                });

                describe("when reading the file is successful", function () {

                    beforeEach(function () {
                        readFileDeferred.resolve(data);
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise resolving with the resource data", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                    });
                });

                describe("when reading the file is NOT successful", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readFileDeferred.reject(error);
                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "Failed to get brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when the resource data file does NOT already exist", function () {
                var error;

                afterAll(function () {
                    error = null;
                });

                beforeEach(function () {
                    error = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    checkFileExistsDeferred.reject(error);
                    mocks.$rootScope.$digest();
                });

                it("should reject", function () {
                    var expectedError = "Failed to get brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                    expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                });
            });
        });

        describe("has a getAssetResourceFilePath function that", function () {
            var localFileSystemUrl;

            afterAll(function () {
                localFileSystemUrl = null;
            });

            beforeEach(function () {
                localFileSystemUrl = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                mocks.$window.resolveLocalFileSystemURL = jasmine.createSpy("resolveLocalFileSystemURL").and.callFake(function (path, callback) {
                    var entry = jasmine.createSpyObj("entry", ["toInternalURL"]);
                    entry.toInternalURL.and.returnValue(localFileSystemUrl);

                    callback(entry);
                });

                mocks.BrandUtil.getAssetResourceFilePath(brandAsset)
                    .then(mocks.resolveHandler)
                    .catch(mocks.rejectHandler);
                mocks.$rootScope.$digest();
            });

            it("should resolve a promise with the expected value", function () {
                expect(mocks.resolveHandler).toHaveBeenCalledWith(localFileSystemUrl);
            });
        });

        describe("has a storeAssetResourceFile function that", function () {

            beforeEach(function () {
                mocks.BrandUtil.storeAssetResourceFile(brandAsset, data)
                    .then(mocks.resolveHandler)
                    .catch(mocks.rejectHandler);
            });

            describe("when the brand directory exists", function () {

                beforeEach(function () {
                    checkDirectoryExistsDeferred.resolve();
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.FileUtil.writeFile with the expected values", function () {
                    expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                });

                describe("when writing the file succeeds", function () {

                    beforeEach(function () {
                        writeFileDeferred.resolve();
                        mocks.$rootScope.$digest();
                    });

                    it("should return a promise that resolves with the data", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                    });
                });

                describe("when writing the file fails", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeFileDeferred.reject(error);
                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when the brand directory does NOT exist", function () {

                beforeEach(function () {
                    checkDirectoryExistsDeferred.reject();
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.FileUtil.createDirectory with the expected value", function () {
                    expect(mocks.FileUtil.createDirectory).toHaveBeenCalledWith(getAssetResourceDirectory(brandAsset));
                });

                describe("when creating the directory succeeds", function () {

                    beforeEach(function () {
                        createDirectoryDeferred.resolve();
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.FileUtil.writeFile with the expected values", function () {
                        expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                    });

                    describe("when writing the file succeeds", function () {

                        beforeEach(function () {
                            writeFileDeferred.resolve();
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise that resolves", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when writing the file fails", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            writeFileDeferred.reject(error);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });

                describe("when creating the directory fails", function () {
                    var error;

                    afterAll(function () {
                        error = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createDirectoryDeferred.reject(error);
                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });
        });

        describe("has a loadBundledAsset function that", function () {

            describe("when given a bundledAssetDirectory", function () {
                var bundledAssetDirectory;

                afterAll(function () {
                    bundledAssetDirectory = null;
                });

                beforeEach(function () {
                    bundledAssetDirectory = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    mocks.BrandUtil.loadBundledAsset(brandAsset, bundledAssetDirectory)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                });

                it("should call mocks.FileUtil.checkFileExists with the expected values", function () {
                    expect(mocks.FileUtil.checkFileExists).toHaveBeenCalledWith(brandAsset.getResourceLink(), bundledAssetDirectory);
                });

                describe("when the FILE asset exists on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.resolve();
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.FileUtil.readFile with the expected values", function () {
                        expect(mocks.FileUtil.readFile).toHaveBeenCalledWith(brandAsset.getResourceLink(), true, bundledAssetDirectory);
                    });

                    describe("when reading the file is successful", function () {

                        beforeEach(function () {
                            readFileDeferred.resolve(data);
                            checkDirectoryExistsDeferred.resolve();
                            mocks.$rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                mocks.$rootScope.$digest();
                            });

                            it("should return a promise that resolves with the resource data", function () {
                                expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            afterAll(function () {
                                error = null;
                            });

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                            });
                        });
                    });

                    describe("when reading the file is NOT successful", function () {

                        beforeEach(function () {
                            readFileDeferred.reject();
                            mocks.$rootScope.$digest();
                        });

                        it("should try to fetch the resource", function () {
                            expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                        });

                        describe("when fetching the resource succeeds", function () {

                            beforeEach(function () {
                                checkDirectoryExistsDeferred.resolve();
                                fetchResourceDeferred.resolve(data);
                                mocks.$rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    mocks.$rootScope.$digest();
                                });

                                it("should return a promise that resolves with the resource data", function () {
                                    expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                                });
                            });

                            describe("when the asset resource data is NOT successfully stored", function () {
                                var error;

                                afterAll(function () {
                                    error = null;
                                });

                                beforeEach(function () {
                                    error = {
                                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                    };

                                    writeFileDeferred.reject(error);
                                    mocks.$rootScope.$digest();
                                });

                                it("should reject", function () {
                                    var expectedError = "Failed to load bundled brand asset with subtype '" +
                                        brandAsset.assetSubtypeId +
                                        "': " + "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                                    expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                                });
                            });
                        });

                        describe("when fetching the resource fails", function () {
                            var error;

                            afterAll(function () {
                                error = null;
                            });

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                fetchResourceDeferred.reject(error);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                            });
                        });
                    });
                });

                describe("when the FILE asset does NOT exist on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.reject();
                        mocks.$rootScope.$digest();
                    });

                    it("should try to fetch the resource", function () {
                        expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                    });

                    describe("when fetching the resource succeeds", function () {

                        beforeEach(function () {
                            checkDirectoryExistsDeferred.resolve();
                            fetchResourceDeferred.resolve(data);
                            mocks.$rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                mocks.$rootScope.$digest();
                            });

                            it("should return a promise that resolves with he resource data", function () {
                                expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            afterAll(function () {
                                error = null;
                            });

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                var expectedError = "Failed to load bundled brand asset with subtype '" +
                                    brandAsset.assetSubtypeId +
                                    "': " + "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                                expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                            });
                        });
                    });

                    describe("when fetching the resource fails", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            fetchResourceDeferred.reject(error);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                            expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                        });
                    });
                });
            });

            describe("when not given a bundledAssetDirectory", function () {
                var bundledAssetDirectory = getDefaultBundledBrandPath();

                afterAll(function () {
                    bundledAssetDirectory = null;
                });

                beforeEach(function () {
                    mocks.BrandUtil.loadBundledAsset(brandAsset)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                });

                it("should call mocks.FileUtil.checkFileExists with the expected values", function () {
                    expect(mocks.FileUtil.checkFileExists).toHaveBeenCalledWith(brandAsset.getResourceLink(), bundledAssetDirectory);
                });

                describe("when the FILE asset exists on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.resolve();
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.FileUtil.readFile with the expected values", function () {
                        expect(mocks.FileUtil.readFile).toHaveBeenCalledWith(brandAsset.getResourceLink(), true, bundledAssetDirectory);
                    });

                    describe("when reading the file is successful", function () {

                        beforeEach(function () {
                            readFileDeferred.resolve(data);
                            checkDirectoryExistsDeferred.resolve();
                            mocks.$rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                mocks.$rootScope.$digest();
                            });

                            it("should return a promise that resolves with the resource data", function () {
                                expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            afterAll(function () {
                                error = null;
                            });

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                            });
                        });
                    });

                    describe("when reading the file is NOT successful", function () {

                        beforeEach(function () {
                            readFileDeferred.reject();
                            mocks.$rootScope.$digest();
                        });

                        it("should try to fetch the resource", function () {
                            expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                        });

                        describe("when fetching the resource succeeds", function () {

                            beforeEach(function () {
                                checkDirectoryExistsDeferred.resolve();
                                fetchResourceDeferred.resolve(data);
                                mocks.$rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    mocks.$rootScope.$digest();
                                });

                                it("should return a promise that resolves with the resource data", function () {
                                    expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                                });
                            });

                            describe("when the asset resource data is NOT successfully stored", function () {
                                var error;

                                afterAll(function () {
                                    error = null;
                                });

                                beforeEach(function () {
                                    error = {
                                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                    };

                                    writeFileDeferred.reject(error);
                                    mocks.$rootScope.$digest();
                                });

                                it("should reject", function () {
                                    var expectedError = "Failed to load bundled brand asset with subtype '" +
                                        brandAsset.assetSubtypeId +
                                        "': " + "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                                    expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                                });
                            });
                        });

                        describe("when fetching the resource fails", function () {
                            var error;

                            afterAll(function () {
                                error = null;
                            });

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                fetchResourceDeferred.reject(error);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                            });
                        });
                    });
                });

                describe("when the FILE asset does NOT exist on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.reject();
                        mocks.$rootScope.$digest();
                    });

                    it("should try to fetch the resource", function () {
                        expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                    });

                    describe("when fetching the resource succeeds", function () {

                        beforeEach(function () {
                            checkDirectoryExistsDeferred.resolve();
                            fetchResourceDeferred.resolve(data);
                            mocks.$rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                mocks.$rootScope.$digest();
                            });

                            it("should return a promise that resolves with he resource data", function () {
                                expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            afterAll(function () {
                                error = null;
                            });

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                var expectedError = "Failed to load bundled brand asset with subtype '" +
                                    brandAsset.assetSubtypeId +
                                    "': " + "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                                expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                            });
                        });
                    });

                    describe("when fetching the resource fails", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            fetchResourceDeferred.reject(error);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                            expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                        });
                    });
                });
            });
        });

        describe("has a getAssetBySubtype function that", function () {
            var assetSubtypeId;

            afterAll(function () {
                assetSubtypeId = null;
            });

            describe("when the given brandAssets contain an asset with the given subtype", function () {

                beforeEach(function () {
                    assetSubtypeId = brandAsset.assetSubtypeId;
                });

                it("should return that asset", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype(brandAssets, assetSubtypeId)).toEqual(brandAsset);
                });
            });

            describe("when the given brandAssets do NOT contain an asset with the given subtype", function () {

                beforeEach(function () {
                    do {
                        assetSubtypeId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    }
                    while (!!_.find(brandAssets, {assetSubtypeId: assetSubtypeId}));
                });

                it("should return null", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype(brandAssets, assetSubtypeId)).toBeNull();
                });
            });

            describe("when the given brandAssets are null", function () {

                it("should return null", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype(null, assetSubtypeId)).toBeNull();
                });
            });

            describe("when the given brandAssets are undefined", function () {

                it("should return null", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype(undefined, assetSubtypeId)).toBeNull();
                });
            });
        });

        describe("has a cacheAssetResourceData function that", function () {

            describe("when forceUpdate is true", function () {

                beforeEach(function () {
                    mocks.BrandUtil.cacheAssetResourceData(brandAsset, true)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);

                    mocks.$rootScope.$digest();
                });

                it("should call brandAsset.fetchResource", function () {
                    expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                });

                describe("when the asset resource is successfully fetched", function () {

                    beforeEach(function () {
                        fetchResourceDeferred.resolve(data);
                        checkDirectoryExistsDeferred.resolve();
                        mocks.$rootScope.$digest();
                    });

                    it("should store the asset resource data", function () {
                        expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                    });

                    describe("when the asset resource data is successfully stored", function () {

                        beforeEach(function () {
                            writeFileDeferred.resolve();
                            mocks.$rootScope.$digest();
                        });

                        it("should return a promise resolving with the resource data", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                        });
                    });

                    describe("when the asset resource data is NOT successfully stored", function () {
                        var error;

                        afterAll(function () {
                            error = null;
                        });

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            writeFileDeferred.reject(error);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });
            });

            describe("when forceUpdate is false", function () {

                describe("when there is a brand asset with a resource", function () {

                    beforeEach(function () {
                        mocks.BrandUtil.cacheAssetResourceData(brandAsset, false)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);

                        mocks.$rootScope.$digest();
                    });

                    describe("if the resource is already cached", function () {

                        beforeEach(function () {
                            checkFileExistsDeferred.resolve();
                            mocks.$rootScope.$digest();
                        });

                        it("should NOT call brandAsset.fetchResource", function () {
                            expect(brandAsset.fetchResource).not.toHaveBeenCalled();
                        });

                        it("should NOT store the asset resource data", function () {
                            expect(mocks.FileUtil.writeFile).not.toHaveBeenCalled();
                        });

                        it("should resolve", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("if the resource is NOT already cached", function () {

                        beforeEach(function () {
                            checkFileExistsDeferred.reject();
                            mocks.$rootScope.$digest();
                        });

                        it("should call brandAsset.fetchResource", function () {
                            expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                        });

                        describe("when the asset resource is successfully fetched", function () {

                            beforeEach(function () {
                                fetchResourceDeferred.resolve(data);
                                checkDirectoryExistsDeferred.resolve();
                                mocks.$rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(mocks.FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    mocks.$rootScope.$digest();
                                });

                                it("should return a promise resolving with the resource data", function () {
                                    expect(mocks.resolveHandler).toHaveBeenCalledWith(data);
                                });
                            });

                            describe("when the asset resource data is NOT successfully stored", function () {
                                var error;

                                afterAll(function () {
                                    error = null;
                                });

                                beforeEach(function () {
                                    error = {
                                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                    };

                                    writeFileDeferred.reject(error);
                                    mocks.$rootScope.$digest();
                                });

                                it("should reject", function () {
                                    var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + mocks.LoggerUtil.getErrorMessage(error);

                                    expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                                });
                            });
                        });
                    });
                });
            });
        });

        describe("has a getLastBrandUpdateDate function that", function () {
            var brandName;

            afterAll(function () {
                brandName = null;
            });

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when there is already a list of last update dates", function () {

                beforeEach(function () {
                    mocks.$localStorage[LAST_BRAND_UPDATE_DATE] = {};
                });

                describe("when the given brand is in the list of last update dates", function () {
                    var expectedDate;

                    afterAll(function () {
                        expectedDate = null;
                    });

                    beforeEach(function () {
                        expectedDate = TestUtils.getRandomDate();

                        mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName] = expectedDate;
                    });

                    it("should return the last update date for the given brand", function () {
                        expect(mocks.BrandUtil.getLastBrandUpdateDate(brandName)).toEqual(expectedDate);
                    });
                });

                describe("when the given brand is NOT in the list of last update dates", function () {

                    beforeEach(function () {
                        delete mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName];
                    });

                    it("should return null", function () {
                        expect(mocks.BrandUtil.getLastBrandUpdateDate(brandName)).toBeNull();
                    });
                });
            });

            describe("when there is NOT already a list of last update dates", function () {

                beforeEach(function () {
                    delete mocks.$localStorage[LAST_BRAND_UPDATE_DATE];
                });

                it("should return null", function () {
                    expect(mocks.BrandUtil.getLastBrandUpdateDate(brandName)).toBeNull();
                });
            });
        });

        describe("has a setLastBrandUpdateDate function that", function () {
            var brandName;

            afterAll(function () {
                brandName = null;
            });

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when given a date", function () {
                var date;

                afterAll(function () {
                    date = null;
                });

                beforeEach(function () {
                    date = TestUtils.getRandomDate();
                });

                describe("when there is already a list of last update dates", function () {

                    beforeEach(function () {
                        mocks.$localStorage[LAST_BRAND_UPDATE_DATE] = {};
                    });

                    describe("when the given brand is in the list of last update dates", function () {
                        var oldDate;

                        afterAll(function () {
                            oldDate = null;
                        });

                        beforeEach(function () {
                            oldDate = TestUtils.getRandomDate();

                            mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName] = oldDate;
                        });

                        beforeEach(function () {
                            mocks.BrandUtil.setLastBrandUpdateDate(brandName, date);
                        });

                        it("should update the entry with the given date", function () {
                            expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(date);
                        });
                    });

                    describe("when the given brand is NOT in the list of last update dates", function () {

                        beforeEach(function () {
                            delete mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName];
                        });

                        beforeEach(function () {
                            mocks.BrandUtil.setLastBrandUpdateDate(brandName, date);
                        });

                        it("should add the entry with the given date", function () {
                            expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(date);
                        });
                    });
                });

                describe("when there is NOT already a list of last update dates", function () {

                    beforeEach(function () {
                        delete mocks.$localStorage[LAST_BRAND_UPDATE_DATE];
                    });

                    beforeEach(function () {
                        mocks.BrandUtil.setLastBrandUpdateDate(brandName, date);
                    });

                    it("should create a list of last update dates", function () {
                        expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE]).toBeDefined();
                    });

                    it("should add the entry with the given date", function () {
                        expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(date);
                    });
                });
            });

            describe("when NOT given a date", function () {
                var currentDate;

                afterAll(function () {
                    currentDate = null;
                });

                beforeEach(function () {
                    currentDate = TestUtils.getRandomDate();
                });

                describe("when there is already a list of last update dates", function () {

                    beforeEach(function () {
                        mocks.$localStorage[LAST_BRAND_UPDATE_DATE] = {};
                    });

                    describe("when the given brand is in the list of last update dates", function () {
                        var oldDate;

                        afterAll(function () {
                            oldDate = null;
                        });

                        beforeEach(function () {
                            oldDate = TestUtils.getRandomDate();

                            mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName] = oldDate;
                        });

                        beforeEach(function () {
                            jasmine.clock().mockDate(currentDate);

                            mocks.BrandUtil.setLastBrandUpdateDate(brandName);
                        });

                        it("should update the entry with the current date", function () {
                            expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                        });
                    });

                    describe("when the given brand is NOT in the list of last update dates", function () {

                        beforeEach(function () {
                            delete mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName];
                        });

                        beforeEach(function () {
                            jasmine.clock().mockDate(currentDate);

                            mocks.BrandUtil.setLastBrandUpdateDate(brandName);
                        });

                        it("should add the entry with the current date", function () {
                            expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                        });
                    });
                });

                describe("when there is NOT already a list of last update dates", function () {

                    beforeEach(function () {
                        delete mocks.$localStorage[LAST_BRAND_UPDATE_DATE];
                    });

                    beforeEach(function () {
                        jasmine.clock().mockDate(currentDate);

                        mocks.BrandUtil.setLastBrandUpdateDate(brandName);
                    });

                    it("should create a list of last update dates", function () {
                        expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE]).toBeDefined();
                    });

                    it("should add the entry with the current date", function () {
                        expect(mocks.$localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                    });
                });
            });
        });

        describe("has a removeAssetResourceFile function that", function () {

            beforeEach(function () {
                mocks.BrandUtil.removeAssetResourceFile(brandAsset)
                    .then(mocks.resolveHandler)
                    .catch(mocks.rejectHandler);
            });

            it("should call mocks.FileUtil.checkFileExists with the expected values", function () {
                expect(mocks.FileUtil.checkFileExists).toHaveBeenCalledWith(resourcePath);
            });

            describe("when the resource file exists", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.resolve();
                    mocks.$rootScope.$digest();
                });

                it("should call mocks.FileUtil.removeFile with the expected value", function () {
                    expect(mocks.FileUtil.removeFile).toHaveBeenCalledWith(resourcePath);
                });

                describe("when mocks.FileUtil.removeFile succeeds", function () {

                    beforeEach(function () {
                        removeFileDeferred.resolve();
                        mocks.$rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalled();
                    });
                });

                describe("when mocks.FileUtil.removeFile fails", function () {
                    var error,
                        expectedError;

                    afterAll(function () {
                        error = null;
                        expectedError = null;
                    });

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        expectedError = "Failed to remove asset resource file " + resourcePath + ": " + mocks.LoggerUtil.getErrorMessage(error);

                        removeFileDeferred.reject(error);
                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                    });
                });
            });

            describe("when the resource file does NOT exist", function () {
                var error;

                afterAll(function () {
                    error = null;
                });

                beforeEach(function () {
                    error = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    checkFileExistsDeferred.reject(error);
                    mocks.$rootScope.$digest();
                });

                it("should reject", function () {
                    var expectedError = "Failed to remove asset resource file " + resourcePath + ": " + mocks.LoggerUtil.getErrorMessage(error);

                    expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                });
            });
        });
    });

    function getAssetResourceDirectory(brandAsset) {
        return brandAsset.clientBrandName + "/";
    }

    function getAssetResourceSubPath(brandAsset) {
        return getAssetResourceDirectory(brandAsset) + brandAsset.assetValue;
    }

    function getDefaultBundledBrandPath() {
        if (_.has(window, "cordova.file.applicationDirectory")) {
            return cordova.file.applicationDirectory + "www/";
        }
        else {
            return "cdvfile:///www/";
        }
    }
})();