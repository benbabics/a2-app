(function () {
    "use strict";

    var BrandUtil,
        BrandManager,
        BrandAssetModel,
        FileUtil,
        CommonService,
        moment,
        globals,
        $q,
        $rootScope,
        $window,
        $localStorage,
        brandAssets,
        brandAsset,
        binary,
        data,
        bundledAssetDirectory,
        resourcePath,
        fetchResourceDeferred,
        resolveHandler,
        rejectHandler,
        writeFileDeferred,
        checkDirectoryExistsDeferred,
        checkFileExistsDeferred,
        readFileDeferred,
        createDirectoryDeferred,
        removeFileDeferred,
        LAST_BRAND_UPDATE_DATE,
        BRAND;

    describe("A Brand Util service", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.core");
            module("app.components.brand");
            module("app.components.util");
            module("app.html");

            //mock dependencies:
            BrandManager = jasmine.createSpyObj("BrandManager", ["getGenericAnalyticsTrackingId", "getGenericBrandAssets"]);
            FileUtil = jasmine.createSpyObj("FileUtil", [
                "checkFileExists",
                "checkDirectoryExists",
                "createDirectory",
                "readFile",
                "removeFile",
                "writeFile"
            ]);

            module(function ($provide) {
                $provide.value("BrandManager", BrandManager);
                $provide.value("FileUtil", FileUtil);
            });

            inject(function (_$localStorage_, _$rootScope_, _$q_, _$window_, _globals_, _moment_, _BrandAssetModel_, _BrandUtil_, _CommonService_) {

                BrandUtil = _BrandUtil_;
                CommonService = _CommonService_;
                BrandAssetModel = _BrandAssetModel_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $window = _$window_;
                $localStorage = _$localStorage_;
                globals = _globals_;
                moment = _moment_;

                LAST_BRAND_UPDATE_DATE = globals.LOCALSTORAGE.KEYS.LAST_BRAND_UPDATE_DATE;
                BRAND = globals.BRAND;

                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(brandAssets);
                binary = TestUtils.getRandomBoolean();
                data = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                resourcePath = getAssetResourceSubPath(brandAsset);
                bundledAssetDirectory = getDefaultBundledBrandPath();
            });

            //setup mocks:
            fetchResourceDeferred = $q.defer();
            writeFileDeferred = $q.defer();
            checkDirectoryExistsDeferred = $q.defer();
            checkFileExistsDeferred = $q.defer();
            readFileDeferred = $q.defer();
            createDirectoryDeferred = $q.defer();
            removeFileDeferred = $q.defer();

            FileUtil.writeFile.and.returnValue(writeFileDeferred.promise);
            FileUtil.checkDirectoryExists.and.returnValue(checkDirectoryExistsDeferred.promise);
            FileUtil.checkFileExists.and.returnValue(checkFileExistsDeferred.promise);
            FileUtil.readFile.and.returnValue(readFileDeferred.promise);
            FileUtil.createDirectory.and.returnValue(createDirectoryDeferred.promise);
            FileUtil.removeFile.and.returnValue(removeFileDeferred.promise);

            //setup spies:
            rejectHandler = jasmine.createSpy("rejectHandler");
            resolveHandler = jasmine.createSpy("resolveHandler");
            spyOn(brandAsset, "fetchResource").and.returnValue(fetchResourceDeferred.promise);
        });

        describe("has a getAssetResourceData function that", function () {

            beforeEach(function () {
                BrandUtil.getAssetResourceData(brandAsset, binary)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call FileUtil.checkFileExists with the expected values", function () {
                expect(FileUtil.checkFileExists).toHaveBeenCalledWith(getAssetResourceSubPath(brandAsset));
            });

            describe("when the resource data file already exists", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.resolve();
                    $rootScope.$digest();
                });

                it("should read the file", function () {
                    expect(FileUtil.readFile).toHaveBeenCalledWith(resourcePath, binary);
                });

                describe("when reading the file is successful", function () {

                    beforeEach(function () {
                        readFileDeferred.resolve(data);
                        $rootScope.$digest();
                    });

                    it("should return a promise resolving with the resource data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(data);
                    });
                });

                describe("when reading the file is NOT successful", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "Failed to get brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when the resource data file does NOT already exist", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.reject();
                });

                it("should throw an error", function () {
                    var expectedError = "Resource data file not found for brand asset: " + brandAsset.assetSubtypeId;

                    expect($rootScope.$digest).toThrowError(expectedError);
                });
            });
        });

        describe("has a getAssetResourceDirectory function that", function () {

            describe("when given a valid brandAsset", function () {

                it("should return the expected resourceDirectory", function () {
                    expect(BrandUtil.getAssetResourceDirectory(brandAsset)).toEqual(getAssetResourceDirectory(brandAsset));
                });
            });

            describe("when given a null brandAsset", function () {

                it("should throw an error", function () {
                    var expectedError = "Failed to get brand asset resource directory.";

                    expect(function () {
                        BrandUtil.getAssetResourceDirectory(null);
                    }).toThrowError(expectedError);
                });
            });

            describe("when given an undefined brandAsset", function () {

                it("should throw an error", function () {
                    var expectedError = "Failed to get brand asset resource directory.";

                    expect(function () {
                        BrandUtil.getAssetResourceDirectory(undefined);
                    }).toThrowError(expectedError);
                });
            });
        });

        describe("has a getAssetResourceFile function that", function () {

            beforeEach(function () {
                BrandUtil.getAssetResourceFile(brandAsset, binary)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call FileUtil.checkFileExists with the expected values", function () {
                expect(FileUtil.checkFileExists).toHaveBeenCalledWith(getAssetResourceSubPath(brandAsset));
            });

            describe("when the resource data file already exists", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.resolve();
                    $rootScope.$digest();
                });

                it("should read the file", function () {
                    expect(FileUtil.readFile).toHaveBeenCalledWith(resourcePath, binary);
                });

                describe("when reading the file is successful", function () {

                    beforeEach(function () {
                        readFileDeferred.resolve(data);
                        $rootScope.$digest();
                    });

                    it("should return a promise resolving with the resource data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(data);
                    });
                });

                describe("when reading the file is NOT successful", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        readFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "Failed to get brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when the resource data file does NOT already exist", function () {
                var error;

                beforeEach(function () {
                    error = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    checkFileExistsDeferred.reject(error);
                });

                it("should throw an error", function () {
                    var expectedError = "Failed to get brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                    expect($rootScope.$digest).toThrowError(expectedError);
                });
            });
        });

        describe("has a getAssetResourceFilePath function that", function () {
            var localFileSystemUrl;

            beforeEach(function () {
                localFileSystemUrl = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                $window.resolveLocalFileSystemURL = jasmine.createSpy("resolveLocalFileSystemURL").and.callFake(function (path, callback) {
                    var entry = jasmine.createSpyObj("entry", ["toInternalURL"]);
                    entry.toInternalURL.and.returnValue(localFileSystemUrl);

                    callback(entry);
                });

                BrandUtil.getAssetResourceFilePath(brandAsset)
                    .then(resolveHandler)
                    .catch(rejectHandler);
                $rootScope.$digest();
            });

            it("should resolve a promise with the expected value", function () {
                expect(resolveHandler).toHaveBeenCalledWith(localFileSystemUrl);
            });
        });

        describe("has a storeAssetResourceFile function that", function () {

            beforeEach(function () {
                BrandUtil.storeAssetResourceFile(brandAsset, data)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            describe("when the brand directory exists", function () {

                beforeEach(function () {
                    checkDirectoryExistsDeferred.resolve();
                    $rootScope.$digest();
                });

                it("should call FileUtil.writeFile with the expected values", function () {
                    expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                });

                describe("when writing the file succeeds", function () {

                    beforeEach(function () {
                        writeFileDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should return a promise that resolves with the data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(data);
                    });
                });

                describe("when writing the file fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        writeFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });

            describe("when the brand directory does NOT exist", function () {

                beforeEach(function () {
                    checkDirectoryExistsDeferred.reject();
                    $rootScope.$digest();
                });

                it("should call FileUtil.createDirectory with the expected value", function () {
                    expect(FileUtil.createDirectory).toHaveBeenCalledWith(getAssetResourceDirectory(brandAsset));
                });

                describe("when creating the directory succeeds", function () {

                    beforeEach(function () {
                        createDirectoryDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call FileUtil.writeFile with the expected values", function () {
                        expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                    });

                    describe("when writing the file succeeds", function () {

                        beforeEach(function () {
                            writeFileDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when writing the file fails", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            writeFileDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });

                describe("when creating the directory fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        createDirectoryDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                        expect($rootScope.$digest).toThrowError(expectedError);
                    });
                });
            });
        });

        describe("has a loadBundledAsset function that", function () {

            describe("when given a bundledAssetDirectory", function () {
                var bundledAssetDirectory;

                beforeEach(function () {
                    bundledAssetDirectory = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    BrandUtil.loadBundledAsset(brandAsset, bundledAssetDirectory)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call FileUtil.checkFileExists with the expected values", function () {
                    expect(FileUtil.checkFileExists).toHaveBeenCalledWith(brandAsset.getResourceLink(), bundledAssetDirectory);
                });

                describe("when the FILE asset exists on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call FileUtil.readFile with the expected values", function () {
                        expect(FileUtil.readFile).toHaveBeenCalledWith(brandAsset.getResourceLink(), true, bundledAssetDirectory);
                    });

                    describe("when reading the file is successful", function () {

                        beforeEach(function () {
                            readFileDeferred.resolve(data);
                            checkDirectoryExistsDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it("should return a promise that resolves with the resource data", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrowError(expectedError);
                            });
                        });
                    });

                    describe("when reading the file is NOT successful", function () {

                        beforeEach(function () {
                            readFileDeferred.reject();
                            $rootScope.$digest();
                        });

                        it("should try to fetch the resource", function () {
                            expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                        });

                        describe("when fetching the resource succeeds", function () {

                            beforeEach(function () {
                                checkDirectoryExistsDeferred.resolve();
                                fetchResourceDeferred.resolve(data);
                                $rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    $rootScope.$digest();
                                });

                                it("should return a promise that resolves with the resource data", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(data);
                                });
                            });

                            describe("when the asset resource data is NOT successfully stored", function () {
                                var error;

                                beforeEach(function () {
                                    error = {
                                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                    };

                                    writeFileDeferred.reject(error);
                                });

                                it("should throw an error", function () {
                                    var expectedError = "Failed to store brand asset resource file '" +
                                        getAssetResourceSubPath(brandAsset) +
                                        "': " + CommonService.getErrorMessage(error);

                                    expect($rootScope.$digest).toThrowError(expectedError);
                                });
                            });
                        });

                        describe("when fetching the resource fails", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                fetchResourceDeferred.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect($rootScope.$digest).toThrowError(expectedError);
                            });
                        });
                    });
                });

                describe("when the FILE asset does NOT exist on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should try to fetch the resource", function () {
                        expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                    });

                    describe("when fetching the resource succeeds", function () {

                        beforeEach(function () {
                            checkDirectoryExistsDeferred.resolve();
                            fetchResourceDeferred.resolve(data);
                            $rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it("should return a promise that resolves with he resource data", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = "Failed to store brand asset resource file '" +
                                    getAssetResourceSubPath(brandAsset) +
                                    "': " + CommonService.getErrorMessage(error);

                                expect($rootScope.$digest).toThrowError(expectedError);
                            });
                        });
                    });

                    describe("when fetching the resource fails", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            fetchResourceDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });
            });

            describe("when not given a bundledAssetDirectory", function () {
                var bundledAssetDirectory = getDefaultBundledBrandPath();

                beforeEach(function () {
                    BrandUtil.loadBundledAsset(brandAsset)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call FileUtil.checkFileExists with the expected values", function () {
                    expect(FileUtil.checkFileExists).toHaveBeenCalledWith(brandAsset.getResourceLink(), bundledAssetDirectory);
                });

                describe("when the FILE asset exists on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call FileUtil.readFile with the expected values", function () {
                        expect(FileUtil.readFile).toHaveBeenCalledWith(brandAsset.getResourceLink(), true, bundledAssetDirectory);
                    });

                    describe("when reading the file is successful", function () {

                        beforeEach(function () {
                            readFileDeferred.resolve(data);
                            checkDirectoryExistsDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it("should return a promise that resolves with the resource data", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrowError(expectedError);
                            });
                        });
                    });

                    describe("when reading the file is NOT successful", function () {

                        beforeEach(function () {
                            readFileDeferred.reject();
                            $rootScope.$digest();
                        });

                        it("should try to fetch the resource", function () {
                            expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                        });

                        describe("when fetching the resource succeeds", function () {

                            beforeEach(function () {
                                checkDirectoryExistsDeferred.resolve();
                                fetchResourceDeferred.resolve(data);
                                $rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    $rootScope.$digest();
                                });

                                it("should return a promise that resolves with the resource data", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(data);
                                });
                            });

                            describe("when the asset resource data is NOT successfully stored", function () {
                                var error;

                                beforeEach(function () {
                                    error = {
                                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                    };

                                    writeFileDeferred.reject(error);
                                });

                                it("should throw an error", function () {
                                    var expectedError = "Failed to store brand asset resource file '" +
                                        getAssetResourceSubPath(brandAsset) +
                                        "': " + CommonService.getErrorMessage(error);

                                    expect($rootScope.$digest).toThrowError(expectedError);
                                });
                            });
                        });

                        describe("when fetching the resource fails", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                fetchResourceDeferred.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                                expect($rootScope.$digest).toThrowError(expectedError);
                            });
                        });
                    });
                });

                describe("when the FILE asset does NOT exist on the file system", function () {

                    beforeEach(function () {
                        checkFileExistsDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should try to fetch the resource", function () {
                        expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                    });

                    describe("when fetching the resource succeeds", function () {

                        beforeEach(function () {
                            checkDirectoryExistsDeferred.resolve();
                            fetchResourceDeferred.resolve(data);
                            $rootScope.$digest();
                        });

                        it("should store the asset resource data", function () {
                            expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                        });

                        describe("when the asset resource data is successfully stored", function () {

                            beforeEach(function () {
                                writeFileDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it("should return a promise that resolves with he resource data", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(data);
                            });
                        });

                        describe("when the asset resource data is NOT successfully stored", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                writeFileDeferred.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = "Failed to store brand asset resource file '" +
                                    getAssetResourceSubPath(brandAsset) +
                                    "': " + CommonService.getErrorMessage(error);

                                expect($rootScope.$digest).toThrowError(expectedError);
                            });
                        });
                    });

                    describe("when fetching the resource fails", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            fetchResourceDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = new RegExp("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "':.+");

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });
            });
        });

        describe("has a getAssetBySubtype function that", function () {
            var assetSubtypeId;

            describe("when the given brandAssets contain an asset with the given subtype", function () {

                beforeEach(function () {
                    assetSubtypeId = brandAsset.assetSubtypeId;
                });

                it("should return that asset", function () {
                    expect(BrandUtil.getAssetBySubtype(brandAssets, assetSubtypeId)).toEqual(brandAsset);
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
                    expect(BrandUtil.getAssetBySubtype(brandAssets, assetSubtypeId)).toBeNull();
                });
            });

            describe("when the given brandAssets are null", function () {

                it("should return null", function () {
                    expect(BrandUtil.getAssetBySubtype(null, assetSubtypeId)).toBeNull();
                });
            });

            describe("when the given brandAssets are undefined", function () {

                it("should return null", function () {
                    expect(BrandUtil.getAssetBySubtype(undefined, assetSubtypeId)).toBeNull();
                });
            });
        });

        describe("has a cacheAssetResourceData function that", function () {

            describe("when forceUpdate is true", function () {

                beforeEach(function () {
                    BrandUtil.cacheAssetResourceData(brandAsset, true)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call brandAsset.fetchResource", function () {
                    expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                });

                describe("when the asset resource is successfully fetched", function () {

                    beforeEach(function () {
                        fetchResourceDeferred.resolve(data);
                        checkDirectoryExistsDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should store the asset resource data", function () {
                        expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                    });

                    describe("when the asset resource data is successfully stored", function () {

                        beforeEach(function () {
                            writeFileDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should return a promise resolving with the resource data", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(data);
                        });
                    });

                    describe("when the asset resource data is NOT successfully stored", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            writeFileDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });
            });

            describe("when forceUpdate is false", function () {

                describe("when there is a brand asset with a resource", function () {

                    beforeEach(function () {
                        BrandUtil.cacheAssetResourceData(brandAsset, false)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    describe("if the resource is already cached", function () {

                        beforeEach(function () {
                            checkFileExistsDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should NOT call brandAsset.fetchResource", function () {
                            expect(brandAsset.fetchResource).not.toHaveBeenCalled();
                        });

                        it("should NOT store the asset resource data", function () {
                            expect(FileUtil.writeFile).not.toHaveBeenCalled();
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("if the resource is NOT already cached", function () {

                        beforeEach(function () {
                            checkFileExistsDeferred.reject();
                            $rootScope.$digest();
                        });

                        it("should call brandAsset.fetchResource", function () {
                            expect(brandAsset.fetchResource).toHaveBeenCalledWith();
                        });

                        describe("when the asset resource is successfully fetched", function () {

                            beforeEach(function () {
                                fetchResourceDeferred.resolve(data);
                                checkDirectoryExistsDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(FileUtil.writeFile).toHaveBeenCalledWith(resourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    $rootScope.$digest();
                                });

                                it("should return a promise resolving with the resource data", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(data);
                                });
                            });

                            describe("when the asset resource data is NOT successfully stored", function () {
                                var error;

                                beforeEach(function () {
                                    error = {
                                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                    };

                                    writeFileDeferred.reject(error);
                                });

                                it("should throw an error", function () {
                                    var expectedError = "Failed to store brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error);

                                    expect($rootScope.$digest).toThrowError(expectedError);
                                });
                            });
                        });
                    });
                });
            });
        });

        describe("has a getLastBrandUpdateDate function that", function () {
            var brandName;

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when there is already a list of last update dates", function () {

                beforeEach(function () {
                    $localStorage[LAST_BRAND_UPDATE_DATE] = {};
                });

                describe("when the given brand is in the list of last update dates", function () {
                    var expectedDate;

                    beforeEach(function () {
                        expectedDate = TestUtils.getRandomDate();

                        $localStorage[LAST_BRAND_UPDATE_DATE][brandName] = expectedDate;
                    });

                    it("should return the last update date for the given brand", function () {
                        expect(BrandUtil.getLastBrandUpdateDate(brandName)).toEqual(expectedDate);
                    });
                });

                describe("when the given brand is NOT in the list of last update dates", function () {

                    beforeEach(function () {
                        delete $localStorage[LAST_BRAND_UPDATE_DATE][brandName];
                    });

                    it("should return null", function () {
                        expect(BrandUtil.getLastBrandUpdateDate(brandName)).toBeNull();
                    });
                });
            });

            describe("when there is NOT already a list of last update dates", function () {

                beforeEach(function () {
                    delete $localStorage[LAST_BRAND_UPDATE_DATE];
                });

                it("should return null", function () {
                    expect(BrandUtil.getLastBrandUpdateDate(brandName)).toBeNull();
                });
            });
        });

        describe("has a setLastBrandUpdateDate function that", function () {
            var brandName;

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when given a date", function () {
                var date;

                beforeEach(function () {
                    date = TestUtils.getRandomDate();
                });

                describe("when there is already a list of last update dates", function () {

                    beforeEach(function () {
                        $localStorage[LAST_BRAND_UPDATE_DATE] = {};
                    });

                    describe("when the given brand is in the list of last update dates", function () {
                        var oldDate;

                        beforeEach(function () {
                            oldDate = TestUtils.getRandomDate();

                            $localStorage[LAST_BRAND_UPDATE_DATE][brandName] = oldDate;
                        });

                        beforeEach(function () {
                            BrandUtil.setLastBrandUpdateDate(brandName, date);
                        });

                        it("should update the entry with the given date", function () {
                            expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(date);
                        });
                    });

                    describe("when the given brand is NOT in the list of last update dates", function () {

                        beforeEach(function () {
                            delete $localStorage[LAST_BRAND_UPDATE_DATE][brandName];
                        });

                        beforeEach(function () {
                            BrandUtil.setLastBrandUpdateDate(brandName, date);
                        });

                        it("should add the entry with the given date", function () {
                            expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(date);
                        });
                    });
                });

                describe("when there is NOT already a list of last update dates", function () {

                    beforeEach(function () {
                        delete $localStorage[LAST_BRAND_UPDATE_DATE];
                    });

                    beforeEach(function () {
                        BrandUtil.setLastBrandUpdateDate(brandName, date);
                    });

                    it("should create a list of last update dates", function () {
                        expect($localStorage[LAST_BRAND_UPDATE_DATE]).toBeDefined();
                    });

                    it("should add the entry with the given date", function () {
                        expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(date);
                    });
                });
            });

            describe("when NOT given a date", function () {
                var currentDate;

                beforeEach(function () {
                    currentDate = TestUtils.getRandomDate();
                });

                describe("when there is already a list of last update dates", function () {

                    beforeEach(function () {
                        $localStorage[LAST_BRAND_UPDATE_DATE] = {};
                    });

                    describe("when the given brand is in the list of last update dates", function () {
                        var oldDate;

                        beforeEach(function () {
                            oldDate = TestUtils.getRandomDate();

                            $localStorage[LAST_BRAND_UPDATE_DATE][brandName] = oldDate;
                        });

                        beforeEach(function () {
                            jasmine.clock().mockDate(currentDate);

                            BrandUtil.setLastBrandUpdateDate(brandName);
                        });

                        it("should update the entry with the current date", function () {
                            expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                        });
                    });

                    describe("when the given brand is NOT in the list of last update dates", function () {

                        beforeEach(function () {
                            delete $localStorage[LAST_BRAND_UPDATE_DATE][brandName];
                        });

                        beforeEach(function () {
                            jasmine.clock().mockDate(currentDate);

                            BrandUtil.setLastBrandUpdateDate(brandName);
                        });

                        it("should add the entry with the current date", function () {
                            expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                        });
                    });
                });

                describe("when there is NOT already a list of last update dates", function () {

                    beforeEach(function () {
                        delete $localStorage[LAST_BRAND_UPDATE_DATE];
                    });

                    beforeEach(function () {
                        jasmine.clock().mockDate(currentDate);

                        BrandUtil.setLastBrandUpdateDate(brandName);
                    });

                    it("should create a list of last update dates", function () {
                        expect($localStorage[LAST_BRAND_UPDATE_DATE]).toBeDefined();
                    });

                    it("should add the entry with the current date", function () {
                        expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                    });
                });
            });
        });

        describe("has a removeAssetResourceFile function that", function () {

            beforeEach(function () {
                BrandUtil.removeAssetResourceFile(brandAsset)
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should call FileUtil.checkFileExists with the expected values", function () {
                expect(FileUtil.checkFileExists).toHaveBeenCalledWith(resourcePath);
            });

            describe("when the resource file exists", function () {

                beforeEach(function () {
                    checkFileExistsDeferred.resolve();
                    $rootScope.$digest();
                });

                it("should call FileUtil.removeFile with the expected value", function () {
                    expect(FileUtil.removeFile).toHaveBeenCalledWith(resourcePath);
                });

                describe("when FileUtil.removeFile succeeds", function () {

                    beforeEach(function () {
                        removeFileDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalled();
                    });
                });

                describe("when FileUtil.removeFile fails", function () {
                    var error,
                        expectedError;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        expectedError = "Failed to remove asset resource file " + resourcePath + ": " + CommonService.getErrorMessage(error);

                        removeFileDeferred.reject(error);
                    });

                    it("should throw the expected error", function () {
                        expect($rootScope.$digest).toThrowError(expectedError);
                    });

                    it("should reject with the expected error", function () {
                        TestUtils.digestError($rootScope);

                        expect(rejectHandler).toHaveBeenCalledWith(new Error(expectedError));
                    });
                });
            });

            describe("when the resource file does NOT exist", function () {
                var error;

                beforeEach(function () {
                    error = {
                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    };

                    checkFileExistsDeferred.reject(error);
                });

                it("should throw an error", function () {
                    var expectedError = "Failed to remove asset resource file " + resourcePath + ": " + CommonService.getErrorMessage(error);

                    expect($rootScope.$digest).toThrowError(expectedError);
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