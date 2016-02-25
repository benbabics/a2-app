(function () {
    "use strict";

    var BrandUtil,
        BrandManager,
        BrandAssetModel,
        FileUtil,
        CommonService,
        UserManager,
        moment,
        globals,
        $q,
        $rootScope,
        $window,
        $state,
        $localStorage,
        brandAssets,
        brandAsset,
        binary,
        data,
        bundledAssetDirectory,
        resourcePath,
        user,
        fetchResourceDeferred,
        resolveHandler,
        rejectHandler,
        writeFileDeferred,
        checkDirectoryExistsDeferred,
        checkFileExistsDeferred,
        readFileDeferred,
        createDirectoryDeferred,
        fetchBrandAssetsDeferred,
        removeFileDeferred,
        LAST_BRAND_UPDATE_DATE,
        BRAND;

    describe("A Brand Util service", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.core");
            module("app.components.brand");
            module("app.components.util");
            module("app.components.user");
            module("app.html");

            //mock dependencies:
            BrandManager = jasmine.createSpyObj("BrandManager", [
                "fetchBrandAssets",
                "getBrandAssetsByBrand",
                "removeBrandAsset",
                "storeBrandAssets"]);
            FileUtil = jasmine.createSpyObj("FileUtil", [
                "checkFileExists",
                "checkDirectoryExists",
                "createDirectory",
                "readFile",
                "removeFile",
                "writeFile"
            ]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);

            module(function ($provide) {
                $provide.value("BrandManager", BrandManager);
                $provide.value("FileUtil", FileUtil);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$localStorage_, _$rootScope_, _$state_, _$q_, _$window_, _globals_, _moment_,
                             _BrandAssetModel_, _BrandUtil_, _CommonService_, UserModel, UserAccountModel) {

                BrandUtil = _BrandUtil_;
                CommonService = _CommonService_;
                BrandAssetModel = _BrandAssetModel_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $window = _$window_;
                $localStorage = _$localStorage_;
                $state = _$state_;
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
                user = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
            });

            //setup mocks:
            fetchResourceDeferred = $q.defer();
            writeFileDeferred = $q.defer();
            checkDirectoryExistsDeferred = $q.defer();
            checkFileExistsDeferred = $q.defer();
            readFileDeferred = $q.defer();
            createDirectoryDeferred = $q.defer();
            fetchBrandAssetsDeferred = $q.defer();
            removeFileDeferred = $q.defer();

            FileUtil.writeFile.and.returnValue(writeFileDeferred.promise);
            FileUtil.checkDirectoryExists.and.returnValue(checkDirectoryExistsDeferred.promise);
            FileUtil.checkFileExists.and.returnValue(checkFileExistsDeferred.promise);
            FileUtil.readFile.and.returnValue(readFileDeferred.promise);
            FileUtil.createDirectory.and.returnValue(createDirectoryDeferred.promise);
            FileUtil.removeFile.and.returnValue(removeFileDeferred.promise);
            BrandManager.fetchBrandAssets.and.returnValue(fetchBrandAssetsDeferred.promise);
            UserManager.getUser.and.returnValue(user);

            //setup spies:
            rejectHandler = jasmine.createSpy("rejectHandler");
            resolveHandler = jasmine.createSpy("resolveHandler");
            spyOn(brandAsset, "fetchResource").and.returnValue(fetchResourceDeferred.promise);
            spyOn($state, "transitionTo");
        });

        describe("has a fetchAssetResourceData function that", function () {

            beforeEach(function () {
                BrandUtil.fetchAssetResourceData(brandAsset)
                    .then(resolveHandler)
                    .catch(rejectHandler);
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
                    $rootScope.$digest();
                });

                describe("when the asset resource is successfully fetched", function () {

                    beforeEach(function () {
                        fetchResourceDeferred.resolve(data);
                        checkDirectoryExistsDeferred.resolve();
                        writeFileDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should return a promise resolving with the resource data", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(data);
                    });
                });

                describe("when the asset resource is NOT successfully fetched", function () {
                    var genericBrandAssets;

                    beforeEach(function () {
                        genericBrandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                        BrandManager.getBrandAssetsByBrand.and.returnValue(genericBrandAssets);
                    });

                    describe("when an equivalent generic asset is found", function () {
                        var equivalentGenericAsset,
                            genericAssetFetchResourceDeferred;

                        beforeEach(function () {
                            equivalentGenericAsset = TestUtils.getRandomValueFromArray(genericBrandAssets);
                            equivalentGenericAsset.assetSubtypeId = brandAsset.assetSubtypeId;

                            genericAssetFetchResourceDeferred = $q.defer();
                            spyOn(equivalentGenericAsset, "fetchResource").and.returnValue(genericAssetFetchResourceDeferred.promise);
                        });

                        beforeEach(function () {
                            fetchResourceDeferred.reject();
                        });

                        describe("when the resource data file already exists", function () {

                            beforeEach(function () {
                                FileUtil.checkFileExists.and.returnValue($q.resolve());
                            });

                            describe("when reading the file is successful", function () {

                                beforeEach(function () {
                                    readFileDeferred.resolve(data);
                                    $rootScope.$digest();
                                });

                                it("should resolve", function () {
                                    expect(resolveHandler).toHaveBeenCalled();
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
                                    var expectedError = "Failed to get brand asset resource file '" +
                                        getAssetResourceSubPath(equivalentGenericAsset) +
                                        "': " + CommonService.getErrorMessage(error);

                                    expect($rootScope.$digest).toThrowError(expectedError);
                                });
                            });
                        });

                        describe("when the resource data file does NOT already exist", function () {

                            beforeEach(function () {
                                checkFileExistsDeferred.reject();
                                $rootScope.$digest();
                            });

                            describe("when the asset resource is successfully fetched", function () {

                                beforeEach(function () {
                                    genericAssetFetchResourceDeferred.resolve(data);
                                    checkDirectoryExistsDeferred.resolve();
                                    writeFileDeferred.resolve();
                                    $rootScope.$digest();
                                });

                                it("should return a promise resolving with the resource data", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(data);
                                });
                            });

                            describe("when the asset resource is NOT successfully fetched", function () {

                                beforeEach(function () {
                                    genericAssetFetchResourceDeferred.reject();
                                    fetchResourceDeferred.reject();
                                    $rootScope.$digest();
                                });

                                it("should return a promise rejecting with the error", function () {
                                    var expectedError = "Failed to find generic equivalent for brand asset: " + brandAsset.assetSubtypeId;

                                    expect(rejectHandler).toHaveBeenCalledWith(expectedError);
                                });
                            });
                        });
                    });

                    describe("when an equivalent generic asset is NOT found", function () {

                        beforeEach(function () {
                            fetchResourceDeferred.reject();
                            $rootScope.$digest();
                        });

                        it("should return a promise rejecting with the expected error", function () {
                            var expectedError = "Failed to find generic equivalent for brand asset: " + brandAsset.assetSubtypeId;

                            expect(rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
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

        describe("has a loadBundledBrand function that", function () {
            var brandName,
                brandResource;

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                brandResource = TestUtils.getRandomBrandAssets(BrandAssetModel);
            });

            describe("when there is a FILE asset", function () {
                var fileAsset,
                    fileAssetResourcePath,
                    fileAssetFetchResourceDeferred;

                beforeEach(function () {
                    fileAsset = TestUtils.getRandomBrandAsset(BrandAssetModel);
                    fileAsset.assetTypeId = globals.BRAND.ASSET_TYPES.FILE;
                    fileAsset.links = [
                        {
                            rel: "self",
                            href: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    ];

                    fileAssetFetchResourceDeferred = $q.defer();
                    spyOn(fileAsset, "fetchResource").and.returnValue(fileAssetFetchResourceDeferred.promise);

                    brandResource.push(fileAsset);

                    fileAssetResourcePath = getAssetResourceSubPath(fileAsset);
                });

                beforeEach(function () {
                    BrandUtil.loadBundledBrand(brandName, brandResource)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call BrandManager.storeBrandAssets with the expected values", function () {
                    expect(BrandManager.storeBrandAssets).toHaveBeenCalledWith(brandResource);
                });

                describe("when loading a FILE asset", function () {

                    it("should call FileUtil.checkFileExists with the expected values", function () {
                        expect(FileUtil.checkFileExists).toHaveBeenCalledWith(fileAsset.getResourceLink(), bundledAssetDirectory);
                    });

                    describe("when the FILE asset exists on the file system", function () {

                        beforeEach(function () {
                            checkFileExistsDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should call FileUtil.readFile with the expected values", function () {
                            expect(FileUtil.readFile).toHaveBeenCalledWith(fileAsset.getResourceLink(), true, bundledAssetDirectory);
                        });

                        describe("when reading the file is successful", function () {

                            beforeEach(function () {
                                readFileDeferred.resolve(data);
                                checkDirectoryExistsDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(FileUtil.writeFile).toHaveBeenCalledWith(fileAssetResourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    $rootScope.$digest();
                                });

                                it("should return a promise that resolves with an array containing the resource data", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(jasmine.arrayContaining([data]));
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
                                        getAssetResourceSubPath(fileAsset) +
                                        "': " + CommonService.getErrorMessage(error);

                                    expect($rootScope.$digest).toThrowError(expectedError);
                                });
                            });
                        });

                        describe("when reading the file is NOT successful", function () {

                            beforeEach(function () {
                                readFileDeferred.reject();
                                $rootScope.$digest();
                            });

                            it("should try to fetch the resource", function () {
                                expect(fileAsset.fetchResource).toHaveBeenCalledWith();
                            });

                            describe("when fetching the resource succeeds", function () {

                                beforeEach(function () {
                                    checkDirectoryExistsDeferred.resolve();
                                    fileAssetFetchResourceDeferred.resolve(data);
                                    $rootScope.$digest();
                                });

                                it("should store the asset resource data", function () {
                                    expect(FileUtil.writeFile).toHaveBeenCalledWith(fileAssetResourcePath, data, true);
                                });

                                describe("when the asset resource data is successfully stored", function () {

                                    beforeEach(function () {
                                        writeFileDeferred.resolve();
                                        $rootScope.$digest();
                                    });

                                    it("should return a promise that resolves with an array containing the resource data", function () {
                                        expect(resolveHandler).toHaveBeenCalledWith(jasmine.arrayContaining([data]));
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
                                            getAssetResourceSubPath(fileAsset) +
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

                                    fileAssetFetchResourceDeferred.reject(error);
                                    $rootScope.$digest();
                                });

                                it("should return a promise that rejects with an array containing the error", function () {
                                    var expectedError = "Failed to load bundled brand asset with subtype '" +
                                        fileAsset.assetSubtypeId +
                                        "': " + CommonService.getErrorMessage(error);

                                    expect(rejectHandler).toHaveBeenCalledWith(jasmine.arrayContaining([expectedError]));
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
                            expect(fileAsset.fetchResource).toHaveBeenCalledWith();
                        });

                        describe("when fetching the resource succeeds", function () {

                            beforeEach(function () {
                                checkDirectoryExistsDeferred.resolve();
                                fileAssetFetchResourceDeferred.resolve(data);
                                $rootScope.$digest();
                            });

                            it("should store the asset resource data", function () {
                                expect(FileUtil.writeFile).toHaveBeenCalledWith(fileAssetResourcePath, data, true);
                            });

                            describe("when the asset resource data is successfully stored", function () {

                                beforeEach(function () {
                                    writeFileDeferred.resolve();
                                    $rootScope.$digest();
                                });

                                it("should return a promise that resolves with an array containing the resource data", function () {
                                    expect(resolveHandler).toHaveBeenCalledWith(jasmine.arrayContaining([data]));
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
                                        getAssetResourceSubPath(fileAsset) +
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

                                fileAssetFetchResourceDeferred.reject(error);
                                $rootScope.$digest();
                            });

                            it("should return a promise that rejects with an array containing the error", function () {
                                var expectedError = "Failed to load bundled brand asset with subtype '" +
                                    fileAsset.assetSubtypeId +
                                    "': " + CommonService.getErrorMessage(error);

                                expect(rejectHandler).toHaveBeenCalledWith(jasmine.arrayContaining([expectedError]));
                            });
                        });
                    });
                });
            });

            describe("when there are no FILE assets", function () {

                beforeEach(function () {
                    _.remove(brandResource, {assetTypeId: globals.BRAND.ASSET_TYPES.FILE});
                });

                beforeEach(function () {
                    BrandUtil.loadBundledBrand(brandName, brandResource)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call BrandManager.storeBrandAssets with the expected values", function () {
                    expect(BrandManager.storeBrandAssets).toHaveBeenCalledWith(brandResource);
                });

                it("should return a promise that resolves", function () {
                    expect(resolveHandler).toHaveBeenCalled();
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

        describe("has a getGenericBrandAssets function that", function () {

            describe("when there are generic brand assets", function () {
                var genericAssets;

                beforeEach(function () {
                    genericAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                    BrandManager.getBrandAssetsByBrand.and.returnValue(genericAssets);
                });

                it("should return the generic brand assets", function () {
                    expect(BrandUtil.getGenericBrandAssets()).toEqual(genericAssets);
                });
            });

            describe("when there are NOT generic brand assets", function () {

                beforeEach(function () {
                    BrandManager.getBrandAssetsByBrand.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(BrandUtil.getGenericBrandAssets()).toBeNull();
                });
            });
        });

        describe("has a getWexBrandAssets function that", function () {

            describe("when there are wex brand assets", function () {
                var wexAssets;

                beforeEach(function () {
                    wexAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                    BrandManager.getBrandAssetsByBrand.and.returnValue(wexAssets);
                });

                it("should return the wex brand assets", function () {
                    expect(BrandUtil.getWexBrandAssets()).toEqual(wexAssets);
                });
            });

            describe("when there are NOT wex brand assets", function () {

                beforeEach(function () {
                    BrandManager.getBrandAssetsByBrand.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(BrandUtil.getWexBrandAssets()).toBeNull();
                });
            });
        });

        describe("has a updateBrandCache function that", function () {
            var brandName,
                currentDate;

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                currentDate = TestUtils.getRandomDate();

                jasmine.clock().mockDate(currentDate);
            });

            describe("when there is a last update date", function () {
                var lastUpdateDate;

                beforeEach(function () {
                    lastUpdateDate = TestUtils.getRandomDate();

                    $localStorage[LAST_BRAND_UPDATE_DATE] = {};
                    $localStorage[LAST_BRAND_UPDATE_DATE][brandName] = lastUpdateDate;
                });

                beforeEach(function () {
                    BrandUtil.updateBrandCache(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call BrandManager.fetchBrandAssets with the expected values", function () {
                    expect(BrandManager.fetchBrandAssets).toHaveBeenCalledWith(brandName, lastUpdateDate);
                });

                describe("when fetching the brand assets succeeds", function () {

                    describe("when there is a brand asset with a resource", function () {

                        beforeEach(function () {
                            brandAsset.assetTypeId = BRAND.ASSET_TYPES.FILE;
                        });

                        beforeEach(function () {
                            fetchBrandAssetsDeferred.resolve(brandAssets);
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

                                it("should update the last update date", function () {
                                    expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                                });

                                it("should resolve", function () {
                                    expect(resolveHandler).toHaveBeenCalled();
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

                                it("should NOT update the last update date and throw an error", function () {
                                    var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + CommonService.getErrorMessage(error) + ".*?$");

                                    expect(function () {
                                        TestUtils.digestError($rootScope);
                                    }).toThrowError(expectedError);

                                    expect($localStorage[LAST_BRAND_UPDATE_DATE] && $localStorage[LAST_BRAND_UPDATE_DATE][brandName])
                                        .toEqual(lastUpdateDate);
                                });
                            });
                        });

                        describe("when the asset resource is NOT successfully fetched", function () {
                            var error;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };

                                fetchResourceDeferred.reject(error);
                            });

                            it("should NOT update the last update date and throw an error", function () {
                                var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + CommonService.getErrorMessage(error) + ".*?$");

                                expect(function () {
                                    $rootScope.$digest();
                                }).toThrowError(expectedError);

                                expect($localStorage[LAST_BRAND_UPDATE_DATE] && $localStorage[LAST_BRAND_UPDATE_DATE][brandName])
                                    .toEqual(lastUpdateDate);
                            });
                        });
                    });

                    describe("when there is NOT a brand asset with a resource", function () {

                        beforeEach(function () {
                            _.remove(brandAssets, {assetTypeId: globals.BRAND.ASSET_TYPES.FILE});
                        });

                        beforeEach(function () {
                            fetchBrandAssetsDeferred.resolve(brandAssets);
                            $rootScope.$digest();
                        });

                        it("should update the last update date", function () {
                            expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });
                });

                describe("when fetching the brand assets fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        fetchBrandAssetsDeferred.reject(error);
                    });

                    it("should NOT update the last update date and throw an error", function () {
                        var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + CommonService.getErrorMessage(error) + ".*?$");

                        expect(function () {
                            $rootScope.$digest();
                        }).toThrowError(expectedError);

                        expect($localStorage[LAST_BRAND_UPDATE_DATE] && $localStorage[LAST_BRAND_UPDATE_DATE][brandName])
                            .toEqual(lastUpdateDate);
                    });
                });
            });

            describe("when there is NOT a last update date", function () {

                beforeEach(function () {
                    delete $localStorage[LAST_BRAND_UPDATE_DATE];
                });

                beforeEach(function () {
                    BrandUtil.updateBrandCache(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call BrandManager.fetchBrandAssets with the expected values", function () {
                    expect(BrandManager.fetchBrandAssets).toHaveBeenCalledWith(brandName);
                });

                describe("when fetching the brand assets succeeds", function () {

                    describe("when there is a brand asset with a resource", function () {

                        beforeEach(function () {
                            brandAsset.assetTypeId = BRAND.ASSET_TYPES.FILE;
                        });

                        beforeEach(function () {
                            fetchBrandAssetsDeferred.resolve(brandAssets);
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

                            it("should update the last update date", function () {
                                expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
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

                                    it("should update the last update date", function () {
                                        expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                                    });

                                    it("should resolve", function () {
                                        expect(resolveHandler).toHaveBeenCalled();
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

                                    it("should NOT update the last update date and throw an error", function () {
                                        var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + CommonService.getErrorMessage(error) + ".*?$");

                                        expect(function () {
                                            TestUtils.digestError($rootScope);
                                        }).toThrowError(expectedError);

                                        expect($localStorage[LAST_BRAND_UPDATE_DATE] && $localStorage[LAST_BRAND_UPDATE_DATE][brandName])
                                            .toBeFalsy();
                                    });
                                });
                            });

                            describe("when the asset resource is NOT successfully fetched", function () {
                                var error;

                                beforeEach(function () {
                                    error = {
                                        message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                    };

                                    fetchResourceDeferred.reject(error);
                                });

                                it("should NOT update the last update date and throw an error", function () {
                                    var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + CommonService.getErrorMessage(error) + ".*?$");

                                    expect(function () {
                                        $rootScope.$digest();
                                    }).toThrowError(expectedError);

                                    expect($localStorage[LAST_BRAND_UPDATE_DATE] && $localStorage[LAST_BRAND_UPDATE_DATE][brandName])
                                        .toBeFalsy();
                                });
                            });
                        });
                    });

                    describe("when there is NOT a brand asset with a resource", function () {

                        beforeEach(function () {
                            _.remove(brandAssets, {assetTypeId: globals.BRAND.ASSET_TYPES.FILE});
                        });

                        beforeEach(function () {
                            fetchBrandAssetsDeferred.resolve(brandAssets);
                            $rootScope.$digest();
                        });

                        it("should update the last update date", function () {
                            expect($localStorage[LAST_BRAND_UPDATE_DATE][brandName]).toEqual(currentDate);
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });
                });

                describe("when fetching the brand assets fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        fetchBrandAssetsDeferred.reject(error);
                    });

                    it("should NOT update the last update date and throw an error", function () {
                        var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + CommonService.getErrorMessage(error) + ".*?$");

                        expect(function () {
                            $rootScope.$digest();
                        }).toThrowError(expectedError);

                        expect($localStorage[LAST_BRAND_UPDATE_DATE] && $localStorage[LAST_BRAND_UPDATE_DATE][brandName])
                            .toBeFalsy();
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

        describe("has a removeExpiredAssets function that", function () {
            var brandName;

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when there is an expired asset", function () {

                beforeEach(function () {
                    //make brandAsset the only asset that's expired
                    _.forEach(brandAssets, function (brandAsset) {
                        brandAsset.endDate = moment().add(1, "days").toDate();
                    });

                    brandAsset.endDate = moment().subtract(1, "days").toDate();
                });

                beforeEach(function () {
                    BrandManager.getBrandAssetsByBrand.and.returnValue(brandAssets);

                    BrandUtil.removeExpiredAssets(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
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
                        });

                        describe("when BrandManager.removeBrandAsset throws an error", function () {
                            var error;

                            beforeEach(function () {
                                error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                                BrandManager.removeBrandAsset.and.throwError(error);

                                TestUtils.digestError($rootScope);
                            });

                            it("should call BrandManager.removeBrandAsset with the expected value", function () {
                                expect(BrandManager.removeBrandAsset).toHaveBeenCalledWith(brandAsset);
                            });

                            it("should reject the promise with the expected error", function () {
                                expect(rejectHandler).toHaveBeenCalledWith(new Error(error));
                            });
                        });

                        describe("when BrandManager.removeBrandAsset does NOT throw an error", function () {

                            beforeEach(function () {
                                $rootScope.$digest();
                            });

                            it("should call BrandManager.removeBrandAsset with the expected value", function () {
                                expect(BrandManager.removeBrandAsset).toHaveBeenCalledWith(brandAsset);
                            });

                            it("should resolve the promise", function () {
                                expect(resolveHandler).toHaveBeenCalled();
                            });
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

            describe("when there is NOT an expired asset", function () {

                beforeEach(function () {
                    _.forEach(brandAssets, function (brandAsset) {
                        brandAsset.endDate = moment().add(1, "days").toDate();
                    });
                });

                beforeEach(function () {
                    BrandManager.getBrandAssetsByBrand.and.returnValue(brandAssets);

                    BrandUtil.removeExpiredAssets(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when the asset list is empty", function () {

                beforeEach(function () {
                    BrandManager.getBrandAssetsByBrand.and.returnValue([]);

                    BrandUtil.removeExpiredAssets(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when there are no assets for the brand", function () {

                beforeEach(function () {
                    BrandManager.getBrandAssetsByBrand.and.returnValue(null);

                    BrandUtil.removeExpiredAssets(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has a getUserBrandAssets function that", function () {

            beforeEach(function () {
                BrandManager.getBrandAssetsByBrand.and.returnValue(brandAssets);
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(user);
                });

                it("should return that assets", function () {
                    expect(BrandUtil.getUserBrandAssets()).toEqual(brandAssets);
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "User must be logged in to get user brand assets";

                    expect(BrandUtil.getUserBrandAssets).toThrowError(expectedError);
                });
            });
        });

        describe("has a getUserBrandAssetBySubtype function that", function () {
            var assetSubtypeId;

            beforeEach(function () {
                BrandManager.getBrandAssetsByBrand.and.returnValue(brandAssets);
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(user);
                });

                describe("when the given brandAssets contain an asset with the given subtype", function () {

                    beforeEach(function () {
                        assetSubtypeId = brandAsset.assetSubtypeId;
                    });

                    it("should return that asset", function () {
                        expect(BrandUtil.getUserBrandAssetBySubtype(assetSubtypeId)).toEqual(brandAsset);
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
                        expect(BrandUtil.getUserBrandAssetBySubtype(assetSubtypeId)).toBeNull();
                    });
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "User must be logged in to get user brand assets";

                    expect(BrandUtil.getUserBrandAssetBySubtype).toThrowError(expectedError);
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