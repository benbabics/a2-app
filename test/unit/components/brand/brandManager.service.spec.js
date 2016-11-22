(function () {
    "use strict";

    var mocks = {};

    describe("A Brand Manager", function () {

        module.sharedInjector();

        beforeAll(function () {
            this.includeDependencies({
                commonSharedMockExclusions: ["PlatformUtil"],
                mocks: mocks
            }, this);

            // mock dependencies
            mocks.BrandsResource = jasmine.createSpyObj("BrandsResource", ["getBrandAssets"]);
            mocks.BrandAssetCollection = jasmine.createSpyObj("BrandAssetCollection", ["getCollection"]);
            mocks.UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            mocks.BrandUtil = jasmine.createSpyObj("BrandUtil", [
                "cacheAssetResourceData",
                "getAssetBySubtype",
                "getLastBrandUpdateDate",
                "loadBundledAsset",
                "removeAssetResourceFile",
                "setLastBrandUpdateDate"
            ]);

            module(function ($provide) {
                $provide.value("BrandsResource", mocks.BrandsResource);
                $provide.value("BrandAssetCollection", mocks.BrandAssetCollection);
                $provide.value("UserManager", mocks.UserManager);
                $provide.value("BrandUtil", mocks.BrandUtil);
            });

            inject(function (___, _$q_, _$rootScope_, _$state_, _globals_, _moment_, _BrandManager_, _BrandAssetModel_, _LoggerUtil_) {
                mocks._ = ___;
                mocks.LoggerUtil = _LoggerUtil_;
                mocks.$q = _$q_;
                mocks.$rootScope = _$rootScope_;
                mocks.$state = _$state_;
                mocks.moment = _moment_;
                mocks.globals = _globals_;
                mocks.BrandManager = _BrandManager_;
                mocks.BrandAssetModel = _BrandAssetModel_;

                spyOn(mocks.$state, "transitionTo");
            });

            // set up spies
            mocks.resolveHandler = jasmine.createSpy("mocks.resolveHandler");
            mocks.rejectHandler = jasmine.createSpy("mocks.rejectHandler");
        });

        beforeEach(inject(function (UserModel, UserAccountModel) {
            // set up mocks
            mocks.user = TestUtils.getRandomUser(UserModel, UserAccountModel, mocks.globals.ONLINE_APPLICATION);
            mocks.brandId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            mocks.mockBrandAssetCollection = jasmine.createSpyObj("mockBrandAssetCollection", ["by", "find", "insert", "remove", "update"]);
            mocks.BrandAssetCollection.getCollection.and.returnValue(mocks.mockBrandAssetCollection);
            mocks.UserManager.getUser.and.returnValue(mocks.user);

            mocks.BrandManager.setBrandAssets(mocks.mockBrandAssetCollection);
        }));

        afterEach(function () {
            //reset all mocks
            _.forEach(mocks, TestUtils.resetMock);
        });

        afterAll(function () {
            mocks = null;
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a fetchBrandAssets function that", function () {

            var alreadyCalled,
                brandAssets,
                brandAssetsObject,
                ifModifiedSince,
                mockError = {
                    status: ""
                };

            beforeEach(function () {
                alreadyCalled = false;
                brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                brandAssetsObject = {};
                brandAssetsObject[mocks.brandId] = brandAssets;
                ifModifiedSince = TestUtils.getRandomDate();

                mocks.getBrandAssetsFirstCallDeferred = mocks.$q.defer();
                mocks.getBrandAssetsSecondCallDeferred = mocks.$q.defer();

                mocks.BrandsResource.getBrandAssets.and.callFake(function () {
                    if (alreadyCalled) {
                        return mocks.getBrandAssetsSecondCallDeferred.promise;
                    }

                    alreadyCalled = true;
                    return mocks.getBrandAssetsFirstCallDeferred.promise;
                });
                mocks.mockBrandAssetCollection[mocks.brandId] = [];
                mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);
                mocks.mockBrandAssetCollection.insert.and.callFake(mocks._.bind(Array.prototype.push, mocks.mockBrandAssetCollection[mocks.brandId], mocks._));

                mocks.BrandManager.fetchBrandAssets(mocks.brandId, ifModifiedSince)
                    .then(mocks.resolveHandler, mocks.rejectHandler);
            });

            afterAll(function () {
                alreadyCalled = null;
                brandAssets = null;
                brandAssetsObject = null;
                ifModifiedSince =  null;
                mockError = null;
            });

            describe("when getting the brand assets", function () {

                it("should call mocks.BrandsResource.getBrandAssets", function () {
                    expect(mocks.BrandsResource.getBrandAssets).toHaveBeenCalledWith(mocks.brandId, ifModifiedSince);
                });

            });

            describe("when the brand assets are fetched successfully", function () {

                var mockRemoteBrandAssets = {data: {}};

                afterAll(function () {
                    mockRemoteBrandAssets = null;
                });

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockRemoteBrandAssets.data = brandAssets.slice();
                        mocks.getBrandAssetsFirstCallDeferred.resolve(mockRemoteBrandAssets);

                        mocks.$rootScope.$digest();
                    });

                    it("should set the brand assets", function () {
                        expect(mocks.BrandManager.getBrandAssetsByBrand(mocks.brandId)).toEqual(brandAssets);
                    });

                    it("should resolve", function () {
                        expect(mocks.resolveHandler).toHaveBeenCalledWith(mockRemoteBrandAssets.data);
                        expect(mocks.rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        mocks.getBrandAssetsFirstCallDeferred.resolve(null);

                        mocks.$rootScope.$digest();
                    });

                    it("should reject", function () {
                        expect(mocks.rejectHandler).toHaveBeenCalled();
                    });

                    it("should NOT update the brand assets", function () {
                        expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                    });

                });
            });

            describe("when there was an error fetching the brand assets with status of 400", function () {

                beforeEach(function () {
                    mockError.status = 400;
                    mocks.getBrandAssetsFirstCallDeferred.reject(mockError);

                    mocks.$rootScope.$digest();
                });

                describe("should try to fetch brand assets for 'GENERIC' that", function () {

                    describe("when getting the brand assets", function () {

                        it("should call mocks.BrandsResource.getBrandAssets for 'GENERIC'", function () {
                            expect(mocks.BrandsResource.getBrandAssets).toHaveBeenCalledWith("GENERIC", undefined);
                        });

                    });

                    describe("when the brand assets are fetched successfully", function () {

                        var mockRemoteBrandAssets = {data: {}};

                        afterAll(function () {
                            mockRemoteBrandAssets = null;
                        });

                        describe("when there is data in the response", function () {

                            beforeEach(function () {
                                mockRemoteBrandAssets.data = brandAssets.slice();
                                mocks.getBrandAssetsSecondCallDeferred.resolve(mockRemoteBrandAssets);

                                mocks.$rootScope.$digest();
                            });

                            it("should set the brand assets", function () {
                                expect(mocks.BrandManager.getBrandAssetsByBrand(mocks.brandId)).toEqual(brandAssets);
                            });

                            it("should resolve", function () {
                                expect(mocks.resolveHandler).toHaveBeenCalledWith(mockRemoteBrandAssets.data);
                                expect(mocks.rejectHandler).not.toHaveBeenCalled();
                            });

                        });

                        describe("when there is no data in the response", function () {

                            beforeEach(function () {
                                mocks.getBrandAssetsSecondCallDeferred.resolve(null);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                expect(mocks.rejectHandler).toHaveBeenCalled();
                            });

                            it("should NOT update the brand assets", function () {
                                expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                            });

                        });
                    });

                    describe("when there was an error fetching the brand assets with status of 400", function () {

                        beforeEach(function () {
                            mockError.status = 400;
                            mocks.getBrandAssetsSecondCallDeferred.reject(mockError);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(mocks.rejectHandler).toHaveBeenCalled();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status of 422", function () {

                        beforeEach(function () {
                            mockError.status = 422;
                            mocks.getBrandAssetsSecondCallDeferred.reject(mockError);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(mocks.rejectHandler).toHaveBeenCalled();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status other than 400 or 422", function () {

                        beforeEach(function () {
                            mockError.status = 500;
                            mocks.getBrandAssetsSecondCallDeferred.reject(mockError);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(mocks.rejectHandler).toHaveBeenCalled();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });
                });

            });

            describe("when there was an error fetching the brand assets with status of 422", function () {

                beforeEach(function () {
                    mockError.status = 422;
                    mocks.getBrandAssetsFirstCallDeferred.reject(mockError);

                    mocks.$rootScope.$digest();
                });

                describe("should try to fetch brand assets for 'WEX' that", function () {

                    describe("when getting the brand assets", function () {

                        it("should call mocks.BrandsResource.getBrandAssets for 'WEX'", function () {
                            expect(mocks.BrandsResource.getBrandAssets).toHaveBeenCalledWith("WEX", undefined);
                        });

                    });

                    describe("when the brand assets are fetched successfully", function () {

                        var mockRemoteBrandAssets = {data: {}};

                        afterAll(function () {
                            mockRemoteBrandAssets = null;
                        });

                        describe("when there is data in the response", function () {

                            beforeEach(function () {
                                mockRemoteBrandAssets.data = brandAssets.slice();
                                mocks.getBrandAssetsSecondCallDeferred.resolve(mockRemoteBrandAssets);

                                mocks.$rootScope.$digest();
                            });

                            it("should set the brand assets", function () {
                                expect(mocks.BrandManager.getBrandAssetsByBrand(mocks.brandId)).toEqual(brandAssets);
                            });

                            it("should resolve", function () {
                                expect(mocks.resolveHandler).toHaveBeenCalledWith(mockRemoteBrandAssets.data);
                                expect(mocks.rejectHandler).not.toHaveBeenCalled();
                            });

                        });

                        describe("when there is no data in the response", function () {

                            beforeEach(function () {
                                mocks.getBrandAssetsSecondCallDeferred.resolve(null);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                expect(mocks.rejectHandler).toHaveBeenCalled();
                            });

                            it("should NOT update the brand assets", function () {
                                expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                            });

                        });
                    });

                    describe("when there was an error fetching the brand assets with status of 400", function () {

                        beforeEach(function () {
                            mockError.status = 400;
                            mocks.getBrandAssetsSecondCallDeferred.reject(mockError);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(mocks.rejectHandler).toHaveBeenCalled();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status of 422", function () {

                        beforeEach(function () {
                            mockError.status = 422;
                            mocks.getBrandAssetsSecondCallDeferred.reject(mockError);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(mocks.rejectHandler).toHaveBeenCalled();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status other than 400 or 422", function () {

                        beforeEach(function () {
                            mockError.status = 500;
                            mocks.getBrandAssetsSecondCallDeferred.reject(mockError);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            expect(mocks.rejectHandler).toHaveBeenCalled();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });
                });

            });

            describe("when there was an error fetching the brand assets with status other than 400 or 422", function () {

                beforeEach(function () {
                    mockError.status = 500;
                    mocks.getBrandAssetsFirstCallDeferred.reject(mockError);
                    mocks.$rootScope.$digest();
                });

                it("should reject", function () {
                    expect(mocks.rejectHandler).toHaveBeenCalled();
                });

                it("should NOT update the brand assets", function () {
                    expect(mocks.BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                });

            });

        });

        describe("has a getBrandAssets function that", function () {

            it("should return the brand assets passed to setBrandAssets", function () {
                var result;

                mocks.mockBrandAssetCollection[mocks.brandId] = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                result = mocks.BrandManager.getBrandAssets();

                expect(result).toEqual(mocks.mockBrandAssetCollection);
            }) ;

            // TODO: figure out how to test this without using setBrandAssets
        });

        describe("has a setBrandAssets function that", function () {

            it("should update the brand assets returned by getBrandAssets", function () {
                var result;

                mocks.mockBrandAssetCollection[mocks.brandId] = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                result = mocks.BrandManager.getBrandAssets();

                expect(result).toEqual(mocks.mockBrandAssetCollection);
            }) ;

            // TODO: figure out how to test this without using getBrandAssets
        });

        describe("has a getBrandAssetsByBrand function that", function () {

            describe("when there are brand assets for the given mocks.brandId", function () {
                var brandAssets,
                    result;

                beforeEach(function () {
                    brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);

                    mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);

                    result = mocks.BrandManager.getBrandAssetsByBrand(mocks.brandId);
                });

                afterAll(function () {
                    brandAssets = null;
                    result = null;
                });

                it("should call mocks.mockBrandAssetCollection.find with the expected values", function () {
                    var searchRegex = new RegExp(mocks.brandId, "i");

                    expect(mocks.mockBrandAssetCollection.find).toHaveBeenCalledWith({"clientBrandName" :{"$regex" : searchRegex}});
                });

                it("should return the brand assets for the given mocks.brandId", function () {
                    expect(result).toEqual(brandAssets);
                });
            });

            describe("when there are NOT brand assets for the given mocks.brandId", function () {

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.find.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(mocks.BrandManager.getBrandAssetsByBrand(mocks.brandId)).toBeNull();
                });
            });
        });

        describe("has a storeBrandAssets function that", function () {
            var brandAssets,
                existingAssets,
                result;

            beforeEach(function () {
                brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                existingAssets = mocks._.filter(brandAssets, TestUtils.getRandomBoolean);

                mocks.mockBrandAssetCollection[mocks.brandId] = [];
                mocks.mockBrandAssetCollection[mocks.brandId].concat(existingAssets);
                mocks.mockBrandAssetCollection.by.and.callFake(function (key, value) {
                    return mocks._.find(existingAssets, mocks._.zipObject([key], [value]));
                });
                mocks.mockBrandAssetCollection.remove.and.callFake(function (value) {
                    return mocks._.remove(existingAssets, {brandAssetId: value.brandAssetId});
                });
            });

            beforeEach(function () {
                result = mocks.BrandManager.storeBrandAssets(brandAssets);
            });

            afterAll(function () {
                brandAssets = null;
                existingAssets = null;
                result = null;
            });

            it("should call remove on the expected assets", function () {
                mocks._.forEach(existingAssets, function (existingAsset) {
                    var expectedAsset = mocks._.find(brandAssets, {brandAssetId: existingAsset.brandAssetId});

                    expect(mocks.mockBrandAssetCollection.remove).toHaveBeenCalledWith(jasmine.objectContaining(expectedAsset));
                });
            });

            it("should call insert on the expected assets", function () {
                mocks._.forEach(mocks._.difference(brandAssets, existingAssets), function (newAsset) {
                    expect(mocks.mockBrandAssetCollection.insert).toHaveBeenCalledWith(newAsset);
                });
            });

            it("should return the given assets", function () {
                expect(result).toEqual(brandAssets);
            });
        });

        describe("has a removeBrandAsset function that", function () {
            var brandAsset;

            beforeEach(function () {
                brandAsset = TestUtils.getRandomBrandAsset(mocks.BrandAssetModel);
            });

            afterAll(function () {
                brandAsset = null;
            });

            describe("when the given asset exists", function () {

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.by.and.returnValue(brandAsset);

                    mocks.BrandManager.removeBrandAsset(brandAsset);
                });

                it("should call remove on the collection with the asset", function () {
                    expect(mocks.mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                });
            });

            describe("when the given asset does NOT exist", function () {

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.by.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "Failed to remove brand asset: " + brandAsset.asset + " not found";

                    expect(function () {
                        mocks.BrandManager.removeBrandAsset(brandAsset);
                    }).toThrowError(expectedError);
                });
            });
        });

        describe("has a removeExpiredAssets function that", function () {
            var brandName,
                brandAssets,
                brandAsset;

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(brandAssets);
            });

            afterAll(function () {
                brandAssets = null;
                brandAsset = null;
                brandName = null;
            });

            describe("when there is an expired asset", function () {
                var removeAssetResourceFileDeferred;

                beforeEach(function () {
                    removeAssetResourceFileDeferred = mocks.$q.defer();
                    mocks.BrandUtil.removeAssetResourceFile.and.returnValue(removeAssetResourceFileDeferred.promise);

                    //make brandAsset the only asset that's expired
                    mocks._.forEach(brandAssets, function (brandAsset) {
                        brandAsset.endDate = mocks.moment().add(1, "days").toDate();
                    });

                    brandAsset.endDate = mocks.moment().subtract(1, "days").toDate();
                });

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);

                    mocks.BrandManager.removeExpiredBrandAssets(brandName)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                afterAll(function () {
                    removeAssetResourceFileDeferred = null;
                });

                it("should call mocks.BrandUtil.removeAssetResourceFile with the expected values", function () {
                    expect(mocks.BrandUtil.removeAssetResourceFile).toHaveBeenCalledWith(brandAsset);
                });

                describe("when mocks.BrandUtil.removeAssetResourceFile succeeds", function () {

                    beforeEach(function () {
                        removeAssetResourceFileDeferred.resolve();
                    });

                    describe("when the given asset exists", function () {

                        beforeEach(function () {
                            mocks.mockBrandAssetCollection.by.and.returnValue(brandAsset);
                            mocks.$rootScope.$digest();
                        });

                        it("should call mocks.BrandAssetCollection.remove with the expected value", function () {
                            expect(mocks.mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                        });

                        it("should resolve the promise", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when the given asset doesn't exist", function () {

                        beforeEach(function () {
                            mocks.mockBrandAssetCollection.by.and.returnValue(null);
                            mocks.$rootScope.$digest();
                        });

                        it("should reject", function () {
                            var expectedError = new Error("Failed to remove brand asset: " + brandAsset.asset + " not found");

                            expect(mocks.rejectHandler).toHaveBeenCalledWith(expectedError);
                        });
                    });
                });

                describe("when mocks.BrandUtil.removeAssetResourceFile fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        removeAssetResourceFileDeferred.reject(error);
                        mocks.$rootScope.$digest();
                    });

                    afterAll(function () {
                        error = null;
                    });

                    it("should reject the promise", function () {
                        expect(mocks.rejectHandler).toHaveBeenCalled();
                    });
                });
            });

            describe("when there is NOT an expired asset", function () {

                beforeEach(function () {
                    mocks._.forEach(brandAssets, function (brandAsset) {
                        brandAsset.endDate = mocks.moment().add(1, "days").toDate();
                    });
                });

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);

                    mocks.BrandManager.removeExpiredBrandAssets(brandName)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(mocks.resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when the asset list is empty", function () {

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.find.and.returnValue([]);

                    mocks.BrandManager.removeExpiredBrandAssets(brandName)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(mocks.resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when there are no assets for the brand", function () {

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.find.and.returnValue(null);

                    mocks.BrandManager.removeExpiredBrandAssets(brandName)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                    mocks.$rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(mocks.resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has a getUserBrandAssets function that", function () {
            var brandAssets;

            beforeEach(function () {
                brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);

                mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);
            });

            afterAll(function () {
                brandAssets = null;
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    mocks.UserManager.getUser.and.returnValue(mocks.user);
                });

                it("should return that assets", function () {
                    expect(mocks.BrandManager.getUserBrandAssets()).toEqual(brandAssets);
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    mocks.UserManager.getUser.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "User must be logged in to get user brand assets";

                    expect(mocks.BrandManager.getUserBrandAssets).toThrowError(expectedError);
                });
            });
        });

        describe("has a getUserBrandAssetBySubtype function that", function () {
            var assetSubtypeId,
                brandAssets,
                brandAsset;

            beforeEach(function () {
                brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(brandAssets);

                mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);
            });

            afterAll(function () {
                brandAssets = null;
                brandAsset = null;
                assetSubtypeId = null;
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    mocks.UserManager.getUser.and.returnValue(mocks.user);
                });

                describe("when an asset with the assetSubtypeId is found", function () {
                    var result;

                    beforeEach(function () {
                        mocks.BrandUtil.getAssetBySubtype.and.returnValue(brandAsset);

                        result = mocks.BrandManager.getUserBrandAssetBySubtype(assetSubtypeId);
                    });

                    afterAll(function () {
                        result = null;
                    });

                    it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                        expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(brandAssets, assetSubtypeId);
                    });

                    it("should return the value from mocks.BrandUtil.getAssetBySubtype", function () {
                        expect(result).toEqual(brandAsset);
                    });
                });

                describe("when an asset with the assetSubtypeId is NOT found", function () {
                    var result,
                        genericEquivalent;

                    beforeEach(function () {
                        genericEquivalent = TestUtils.getRandomBrandAsset(mocks.BrandAssetModel);

                        mocks.BrandUtil.getAssetBySubtype.and.returnValues(null, genericEquivalent);

                        result = mocks.BrandManager.getUserBrandAssetBySubtype(assetSubtypeId);
                    });

                    afterAll(function () {
                        result = null;
                        genericEquivalent = null;
                    });

                    it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                        expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(brandAssets, assetSubtypeId);
                    });

                    it("should return a generic equivalent", function () {
                        expect(result).toEqual(genericEquivalent);
                    });
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    mocks.UserManager.getUser.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "User must be logged in to get user brand assets";

                    expect(mocks.BrandManager.getUserBrandAssetBySubtype).toThrowError(expectedError);
                });
            });
        });

        describe("has a getGenericBrandAssets function that", function () {

            describe("when there are generic brand assets", function () {
                var genericAssets;

                beforeEach(function () {
                    genericAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);

                    mocks.mockBrandAssetCollection.find.and.returnValue(genericAssets);
                });

                afterAll(function () {
                    genericAssets = null;
                });

                it("should return the generic brand assets", function () {
                    expect(mocks.BrandManager.getGenericBrandAssets()).toEqual(genericAssets);
                });
            });

            describe("when there are NOT generic brand assets", function () {

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.find.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(mocks.BrandManager.getGenericBrandAssets()).toBeNull();
                });
            });
        });

        describe("has a getWexBrandAssets function that", function () {

            describe("when there are wex brand assets", function () {
                var wexAssets;

                beforeEach(function () {
                    wexAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);

                    mocks.mockBrandAssetCollection.find.and.returnValue(wexAssets);
                });

                afterAll(function () {
                    wexAssets = null;
                });

                it("should return the wex brand assets", function () {
                    expect(mocks.BrandManager.getWexBrandAssets()).toEqual(wexAssets);
                });
            });

            describe("when there are NOT wex brand assets", function () {

                beforeEach(function () {
                    mocks.mockBrandAssetCollection.find.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(mocks.BrandManager.getWexBrandAssets()).toBeNull();
                });
            });
        });

        describe("has a loadBundledBrand function that", function () {
            var brandName,
                brandResource;

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                brandResource = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
            });

            afterAll(function () {
                brandName = null;
                brandResource = null;
            });

            describe("when there is a FILE asset", function () {
                var fileAsset,
                    fileAssetFetchResourceDeferred,
                    loadBundledAssetDeferred;

                beforeEach(function () {
                    fileAsset = TestUtils.getRandomBrandAsset(mocks.BrandAssetModel);
                    fileAsset.assetTypeId = mocks.globals.BRAND.ASSET_TYPES.FILE;
                    fileAsset.links = [
                        {
                            rel: "self",
                            href: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    ];

                    fileAssetFetchResourceDeferred = mocks.$q.defer();
                    loadBundledAssetDeferred = mocks.$q.defer();
                    spyOn(fileAsset, "fetchResource").and.returnValue(fileAssetFetchResourceDeferred.promise);
                    mocks.BrandUtil.loadBundledAsset.and.returnValue(loadBundledAssetDeferred.promise);

                    brandResource.push(fileAsset);
                });

                beforeEach(function () {
                    mocks.BrandManager.loadBundledBrand(brandName, brandResource)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                });

                afterAll(function () {
                    fileAsset = null;
                    fileAssetFetchResourceDeferred = null;
                    loadBundledAssetDeferred = null;
                });

                it("should call mocks.BrandAssetCollection.insert with the expected values", function () {
                    mocks._.forEach(brandResource, function (brandAsset) {
                        expect(mocks.mockBrandAssetCollection.insert).toHaveBeenCalledWith(brandAsset);
                    });
                });

                describe("when loading a FILE asset", function () {

                    it("should call mocks.BrandUtil.loadBundledAsset with the file asset", function () {
                        expect(mocks.BrandUtil.loadBundledAsset).toHaveBeenCalledWith(fileAsset);
                    });

                    describe("when mocks.BrandUtil.loadBundledAsset succeeds", function () {
                        var data;

                        beforeEach(function () {
                            data = TestUtils.getRandomStringThatIsAlphaNumeric(30);

                            loadBundledAssetDeferred.resolve(data);
                            mocks.$rootScope.$digest();
                        });

                        afterAll(function () {
                            data = null;
                        });

                        it("should return a promise that resolves with an array containing the resource data", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalledWith(jasmine.arrayContaining([data]));
                        });
                    });

                    describe("when BrandUtil.loadBundledAsset fails", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            loadBundledAssetDeferred.reject(error);
                            mocks.$rootScope.$digest();
                        });

                        afterAll(function () {
                            error = null;
                        });

                        it("should reject", function () {
                            var expectedError = new RegExp("Failed to load bundled brand '" + brandName + "':.+");

                            expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                        });
                    });
                });
            });

            describe("when there are no FILE assets", function () {

                beforeEach(function () {
                    mocks._.remove(brandResource, {assetTypeId: mocks.globals.BRAND.ASSET_TYPES.FILE});
                });

                beforeEach(function () {
                    mocks.BrandManager.loadBundledBrand(brandName, brandResource)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);

                    mocks.$rootScope.$digest();
                });

                it("should call mocks.BrandAssetCollection.insert with the expected values", function () {
                    mocks._.forEach(brandResource, function (brandAsset) {
                        expect(mocks.mockBrandAssetCollection.insert).toHaveBeenCalledWith(brandAsset);
                    });
                });

                it("should return a promise that resolves", function () {
                    expect(mocks.resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has an updateBrandCache function that", function () {
            var brandName,
                brandAssets,
                currentDate,
                numFileAssets,
                getBrandAssetsDeferred,
                cacheAssetResourceDataDeferred,
                cacheAssetResourceDataDeferred2,
                removeAssetResourceFileDeferred;

            afterAll(function () {
                brandName = null;
                brandAssets = null;
                currentDate = null;
                numFileAssets = null;
                getBrandAssetsDeferred = null;
                cacheAssetResourceDataDeferred = null;
                cacheAssetResourceDataDeferred2 = null;
                removeAssetResourceFileDeferred = null;
            });

            function testUpdateBrandCacheWithoutDate() {

                it("should call mocks.BrandsResource.getBrandAssets with the expected values", function () {
                    expect(mocks.BrandsResource.getBrandAssets).toHaveBeenCalledWith(brandName, null);
                });

                describe("when mocks.BrandUtil.removeAssetResourceFile succeeds", function () {

                    beforeEach(function () {
                        removeAssetResourceFileDeferred.resolve();
                        mocks.$rootScope.$digest();
                    });

                    it("should call mocks.BrandAssetCollection.remove with the expected values", function () {
                        mocks._.forEach(brandAssets, function (brandAsset) {
                            if (brandAsset.isExpired()) {
                                expect(mocks.mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                            }
                        });
                    });
                });

                describe("when mocks.BrandUtil.removeAssetResourceFile fails", function () {

                    beforeEach(function () {
                        removeAssetResourceFileDeferred.reject();
                        mocks.$rootScope.$digest();
                    });

                    it("should NOT reject the promise", function () {
                        expect(mocks.rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when getting the brand assets succeeds", function () {
                    var brandAssetResources;

                    beforeEach(function () {
                        brandAssetResources = mocks._.clone(brandAssets);

                        if(mocks._.isEmpty(brandAssetResources)) {
                            var addedResource = TestUtils.getRandomBrandAsset(mocks.BrandAssetModel);
                            addedResource.assetTypeId = mocks.globals.BRAND.ASSET_TYPES.FILE;
                            brandAssetResources.push(addedResource);
                            addedResource = null;
                        }

                        getBrandAssetsDeferred.resolve({data: brandAssetResources});
                        mocks.$rootScope.$digest();
                    });

                    afterAll(function () {
                        brandAssetResources = null;
                    });

                    it("should call mocks.BrandUtil.cacheAssetResourceData with the expected values", function () {
                        mocks._.forEach(brandAssetResources, function (brandAsset) {
                            if (brandAsset.hasResource()) {
                                expect(mocks.BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(brandAsset, false);
                            }
                            else {
                                expect(mocks.BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(brandAsset, false);
                            }
                        });
                    });

                    describe("when mocks.BrandUtil.cacheAssetResourceData succeeds", function () {

                        beforeEach(function () {
                            cacheAssetResourceDataDeferred.resolve();
                            mocks.$rootScope.$digest();
                        });

                        it("should call mocks.BrandUtil.setLastBrandUpdateDate with the brand name", function () {
                            expect(mocks.BrandUtil.setLastBrandUpdateDate).toHaveBeenCalledWith(brandName);
                        });

                        it("should resolve", function () {
                            expect(mocks.resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when mocks.BrandUtil.cacheAssetResourceData fails", function () {
                        var error,
                            genericAssets;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };
                            genericAssets = mocks._.map(brandAssetResources, function (brandAsset) {
                                return angular.extend(new mocks.BrandAssetModel(), brandAsset);
                            });

                            mocks.mockBrandAssetCollection.find.and.returnValue(genericAssets);
                            cacheAssetResourceDataDeferred.reject(error);
                        });

                        afterAll(function () {
                            error = null;
                            genericAssets = null;
                        });

                        describe("when mocks.BrandUtil.cacheAssetResourceData succeeds with the generic asset", function () {

                            beforeEach(function () {
                                cacheAssetResourceDataDeferred2.resolve();
                                mocks.$rootScope.$digest();
                            });

                            it("should reject the promise", function () {
                                var expectedError = new RegExp("Failed to update brand cache:.+");

                                expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                            });

                            it("should NOT update the last update date", function () {
                                expect(mocks.BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                            });

                            it("should call mocks.BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                mocks._.forEach(genericAssets, function (genericAsset) {
                                    if (genericAsset.hasResource()) {
                                        expect(mocks.BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, false);
                                    }
                                    else {
                                        expect(mocks.BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, false);
                                    }
                                });
                            });
                        });

                        describe("when mocks.BrandUtil.cacheAssetResourceData fails with the generic asset", function () {

                            beforeEach(function () {
                                cacheAssetResourceDataDeferred2.reject(error);
                                mocks.$rootScope.$digest();
                            });

                            it("should reject", function () {
                                var expectedError = new RegExp("Failed to update brand cache:.+");

                                expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                            });

                            it("should NOT update the last update date", function () {
                                expect(mocks.BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                            });

                            it("should call mocks.BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                mocks._.forEach(genericAssets, function (genericAsset) {
                                    if (genericAsset.hasResource()) {
                                        expect(mocks.BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, false);
                                    }
                                    else {
                                        expect(mocks.BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, false);
                                    }
                                });
                            });
                        });
                    });
                });

                describe("when getting the brand assets fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        getBrandAssetsDeferred.reject(error);
                        mocks.$rootScope.$digest();
                    });

                    afterAll(function () {
                        error = null;
                    });

                    it("should reject", function () {
                        var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + mocks.LoggerUtil.getErrorMessage(error) + ".*?$");

                        expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                    });

                    it("should NOT update the last update date", function () {
                        expect(mocks.BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                    });
                });
            }

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                brandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                currentDate = TestUtils.getRandomDate();
                numFileAssets = 0;
                getBrandAssetsDeferred = mocks.$q.defer();
                cacheAssetResourceDataDeferred = mocks.$q.defer();
                cacheAssetResourceDataDeferred2 = mocks.$q.defer();
                removeAssetResourceFileDeferred = mocks.$q.defer();

                mocks._.forEach(mocks._.filter(brandAssets, TestUtils.getRandomBoolean), function (brandAsset) {
                    brandAsset.assetTypeId = mocks.globals.BRAND.ASSET_TYPES.FILE;
                    ++numFileAssets;
                });

                //make sure there is at least 1 file asset
                if (numFileAssets === 0) {
                    brandAssets[0].assetTypeId = mocks.globals.BRAND.ASSET_TYPES.FILE;
                    numFileAssets = 1;
                }

                mocks.BrandsResource.getBrandAssets.and.returnValue(getBrandAssetsDeferred.promise);
                //return cacheAssetResourceDataDeferred/cacheAssetResourceDataDeferred2 x number of times based on the number of assets
                mocks._.spread(mocks.BrandUtil.cacheAssetResourceData.and.returnValues)(
                    mocks._.fill(new Array(numFileAssets), cacheAssetResourceDataDeferred.promise).concat(
                        mocks._.fill(new Array(numFileAssets), cacheAssetResourceDataDeferred2.promise)
                    ));

                mocks.BrandUtil.removeAssetResourceFile.and.returnValue(removeAssetResourceFileDeferred.promise);

                mocks.mockBrandAssetCollection.remove.and.callFake(function (value) {
                    return mocks._.remove(brandAssets, {brandAssetId: value.brandAssetId});
                });

                jasmine.clock().mockDate(currentDate);
            });

            describe("when there is a last update date", function () {
                var lastUpdateDate;

                afterAll(function () {
                    lastUpdateDate = null;
                });

                function testUpdateBrandCacheWithDate() {

                    it("should call mocks.BrandsResource.getBrandAssets with the expected values", function () {
                        expect(mocks.BrandsResource.getBrandAssets).toHaveBeenCalledWith(brandName, lastUpdateDate);
                    });

                    it("should call mocks.BrandUtil.removeAssetResourceFile with the expected values", function () {
                        mocks._.forEach(brandAssets, function (brandAsset) {
                            if (brandAsset.isExpired()) {
                                expect(mocks.BrandUtil.removeAssetResourceFile).toHaveBeenCalledWith(brandAsset);
                            }
                        });
                    });

                    describe("when mocks.BrandUtil.removeAssetResourceFile succeeds", function () {

                        beforeEach(function () {
                            removeAssetResourceFileDeferred.resolve();
                            mocks.$rootScope.$digest();
                        });

                        it("should call mocks.BrandAssetCollection.remove with the expected values", function () {
                            mocks._.forEach(brandAssets, function (brandAsset) {
                                if (brandAsset.isExpired()) {
                                    expect(mocks.mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                                }
                            });
                        });
                    });

                    describe("when mocks.BrandUtil.removeAssetResourceFile fails", function () {

                        beforeEach(function () {
                            removeAssetResourceFileDeferred.reject();
                            mocks.$rootScope.$digest();
                        });

                        it("should NOT reject the promise", function () {
                            expect(mocks.rejectHandler).not.toHaveBeenCalled();
                        });
                    });

                    describe("when getting the brand assets succeeds", function () {

                        beforeEach(function () {
                            getBrandAssetsDeferred.resolve({data: brandAssets});
                            mocks.$rootScope.$digest();
                        });

                        it("should call mocks.BrandUtil.cacheAssetResourceData with the expected values", function () {
                            mocks._.forEach(brandAssets, function (brandAsset) {
                                if (brandAsset.hasResource()) {
                                    expect(mocks.BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(brandAsset, true);
                                }
                                else {
                                    expect(mocks.BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(brandAsset, true);
                                }
                            });
                        });

                        describe("when mocks.BrandUtil.cacheAssetResourceData succeeds", function () {

                            beforeEach(function () {
                                cacheAssetResourceDataDeferred.resolve();
                                mocks.$rootScope.$digest();
                            });

                            it("should call mocks.BrandUtil.setLastBrandUpdateDate with the brand name", function () {
                                expect(mocks.BrandUtil.setLastBrandUpdateDate).toHaveBeenCalledWith(brandName);
                            });

                            it("should resolve", function () {
                                expect(mocks.resolveHandler).toHaveBeenCalled();
                            });
                        });

                        describe("when mocks.BrandUtil.cacheAssetResourceData fails", function () {
                            var error,
                                genericAssets;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };
                                genericAssets = mocks._.map(brandAssets, function (brandAsset) {
                                    return angular.extend(new mocks.BrandAssetModel(), brandAsset);
                                });

                                mocks.mockBrandAssetCollection.find.and.returnValue(genericAssets);
                                cacheAssetResourceDataDeferred.reject(error);
                            });

                            afterAll(function () {
                                error = null;
                                genericAssets = null;
                            });

                            describe("when mocks.BrandUtil.cacheAssetResourceData succeeds with the generic asset", function () {

                                beforeEach(function () {
                                    cacheAssetResourceDataDeferred2.resolve();
                                    mocks.$rootScope.$digest();
                                });

                                it("should reject", function () {
                                    var expectedError = new RegExp("Failed to update brand cache:.+");

                                    expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                                });

                                it("should NOT update the last update date", function () {
                                    expect(mocks.BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                                });

                                it("should call mocks.BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                    mocks._.forEach(genericAssets, function (genericAsset) {
                                        if (genericAsset.hasResource()) {
                                            expect(mocks.BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, true);
                                        }
                                        else {
                                            expect(mocks.BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, true);
                                        }
                                    });
                                });
                            });

                            describe("when mocks.BrandUtil.cacheAssetResourceData fails with the generic asset", function () {

                                beforeEach(function () {
                                    cacheAssetResourceDataDeferred2.reject(error);
                                    mocks.$rootScope.$digest();
                                });

                                it("should reject", function () {
                                    var expectedError = new RegExp("Failed to update brand cache:.+");

                                    expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                                });

                                it("should NOT update the last update date", function () {
                                    expect(mocks.BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                                });

                                it("should call mocks.BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                    mocks._.forEach(genericAssets, function (genericAsset) {
                                        if (genericAsset.hasResource()) {
                                            expect(mocks.BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, true);
                                        }
                                        else {
                                            expect(mocks.BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, true);
                                        }
                                    });
                                });
                            });
                        });
                    });

                    describe("when getting the brand assets fails", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            getBrandAssetsDeferred.reject(error);
                            mocks.$rootScope.$digest();
                        });

                        afterAll(function () {
                            error = null;
                        });

                        it("should reject", function () {
                            var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + mocks.LoggerUtil.getErrorMessage(error) + ".*?$");

                            expect(mocks.rejectHandler.calls.mostRecent().args[0]).toMatch(expectedError);
                        });

                        it("should NOT update the last update date", function () {
                            expect(mocks.BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                        });
                    });
                }

                beforeEach(function () {
                    lastUpdateDate = TestUtils.getRandomDate();
                    mocks.BrandUtil.getLastBrandUpdateDate.and.returnValue(lastUpdateDate);
                });

                describe("when there are assets for the given brand in the cache", function () {

                    beforeEach(function () {
                        mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);
                        mocks.mockBrandAssetCollection.by.and.callFake(function (key, value) {
                            return mocks._.find(brandAssets, mocks._.zipObject([key], [value]));
                        });
                    });

                    beforeEach(function () {
                        mocks.BrandManager.updateBrandCache(brandName)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                    });

                    describe("should update the brand assets using the last update date: ", testUpdateBrandCacheWithDate);
                });

                describe("when there are NO assets for the given brand in the cache", function () {

                    beforeEach(function () {
                        brandAssets = [];
                        mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);
                    });

                    beforeEach(function () {
                        mocks.BrandManager.updateBrandCache(brandName)
                            .then(mocks.resolveHandler)
                            .catch(mocks.rejectHandler);
                    });

                    describe("should update the brand assets using the last update date: ", testUpdateBrandCacheWithoutDate);
                });
            });

            describe("when there is NOT a last update date", function () {

                beforeEach(function () {
                    mocks.BrandUtil.getLastBrandUpdateDate.and.returnValue(null);

                    mocks.mockBrandAssetCollection.find.and.returnValue(brandAssets);
                    mocks.mockBrandAssetCollection.by.and.callFake(function (key, value) {
                        return mocks._.find(brandAssets, mocks._.zipObject([key], [value]));
                    });
                });

                beforeEach(function () {
                    mocks.BrandManager.updateBrandCache(brandName)
                        .then(mocks.resolveHandler)
                        .catch(mocks.rejectHandler);
                });

                describe("should update the brand assets NOT using the last update date: ", testUpdateBrandCacheWithoutDate);
            });
        });

        describe("has a getGenericBrandAssetBySubtype function that", function () {
            var assetSubtypeId,
                genericBrandAssets,
                brandAsset,
                result;

            beforeEach(function () {
                genericBrandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(genericBrandAssets);

                mocks.mockBrandAssetCollection.find.and.returnValue(genericBrandAssets);
                mocks.BrandUtil.getAssetBySubtype.and.returnValue(brandAsset);

                result = mocks.BrandManager.getGenericBrandAssetBySubtype(assetSubtypeId);
            });

            afterAll(function () {
                assetSubtypeId = null;
                genericBrandAssets = null;
                brandAsset = null;
                result = null;
            });

            it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(genericBrandAssets, assetSubtypeId);
            });

            it("should return the value from mocks.BrandUtil.getAssetBySubtype", function () {
                expect(result).toEqual(brandAsset);
            });
        });

        describe("has a getWexBrandAssetBySubtype function that", function () {
            var assetSubtypeId,
                wexBrandAssets,
                brandAsset,
                result;

            beforeEach(function () {
                wexBrandAssets = TestUtils.getRandomBrandAssets(mocks.BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(wexBrandAssets);

                mocks.mockBrandAssetCollection.find.and.returnValue(wexBrandAssets);
                mocks.BrandUtil.getAssetBySubtype.and.returnValue(brandAsset);

                result = mocks.BrandManager.getWexBrandAssetBySubtype(assetSubtypeId);
            });

            afterAll(function () {
                assetSubtypeId = null;
                wexBrandAssets = null;
                brandAsset = null;
                result = null;
            });

            it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(wexBrandAssets, assetSubtypeId);
            });

            it("should return the value from mocks.BrandUtil.getAssetBySubtype", function () {
                expect(result).toEqual(brandAsset);
            });
        });

        describe("has a getGenericAnalyticsTrackingId function that", function () {

            describe("when there is a generic analytics tracking id", function () {
                var trackingId,
                    result;

                beforeEach(function () {
                    trackingId = TestUtils.getRandomBrandAsset(mocks.BrandAssetModel);
                    mocks.BrandUtil.getAssetBySubtype.and.returnValue(trackingId);

                    result = mocks.BrandManager.getGenericAnalyticsTrackingId();
                });

                afterAll(function () {
                    trackingId = null;
                    result = null;
                });

                it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(mocks.globals.BRANDS.GENERIC, mocks.globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
                });

                it("should return the expected value", function () {
                    expect(result).toEqual(trackingId.assetValue);
                });
            });

            describe("when there is NOT a generic analytics tracking id", function () {
                var result;

                beforeEach(function () {
                    mocks.BrandUtil.getAssetBySubtype.and.returnValue(null);

                    result = mocks.BrandManager.getGenericAnalyticsTrackingId();
                });

                afterAll(function () {
                    result = null;
                });

                it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(mocks.globals.BRANDS.GENERIC, mocks.globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
                });

                it("should return null", function () {
                    expect(result).toBeNull();
                });
            });
        });

        describe("has a getWexAnalyticsTrackingId function that", function () {

            describe("when there is a wex analytics tracking id", function () {
                var trackingId,
                    result;

                beforeEach(function () {
                    trackingId = TestUtils.getRandomBrandAsset(mocks.BrandAssetModel);
                    mocks.BrandUtil.getAssetBySubtype.and.returnValue(trackingId);

                    result = mocks.BrandManager.getWexAnalyticsTrackingId();
                });

                afterAll(function () {
                    trackingId = null;
                    result = null;
                });

                it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(mocks.globals.BRANDS.WEX, mocks.globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
                });

                it("should return the expected value", function () {
                    expect(result).toEqual(trackingId.assetValue);
                });
            });

            describe("when there is NOT a wex analytics tracking id", function () {
                var result;

                beforeEach(function () {
                    mocks.BrandUtil.getAssetBySubtype.and.returnValue(null);

                    result = mocks.BrandManager.getWexAnalyticsTrackingId();
                });

                afterAll(function () {
                    result = null;
                });

                it("should call mocks.BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(mocks.BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(mocks.globals.BRANDS.WEX, mocks.globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
                });

                it("should return null", function () {
                    expect(result).toBeNull();
                });
            });
        });

    });

})();