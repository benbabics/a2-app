(function () {
    "use strict";

    var _,
        $q,
        $rootScope,
        $state,
        brandId,
        getBrandAssetsFirstCallDeferred,
        getBrandAssetsSecondCallDeferred,
        mockBrandAssetCollection,
        resolveHandler,
        rejectHandler,
        BrandManager,
        BrandAssetModel,
        BrandsResource,
        BrandAssetCollection,
        BrandUtil,
        LoggerUtil,
        UserManager,
        AnalyticsUtil,
        user,
        moment,
        globals,
        mockGlobals = {
            BRANDS: {
                "GENERIC": [
                    {
                        "assetSubtypeId" : "GOOGLE_ANALYTICS_TRACKING_ID",
                        "assetTypeId"    : "TEXT",
                        "assetValue"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "clientBrandName": "GENERIC",
                        "links": []
                    }
                ],
                "WEX"    : [
                    {
                        "assetSubtypeId" : "BRAND_LOGO",
                        "assetTypeId"    : "FILE",
                        "assetValue"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "clientBrandName": "WEX",
                        "links": [
                            {
                                "rel": "self",
                                "href": TestUtils.getRandomStringThatIsAlphaNumeric(15)
                            }
                        ]
                    },
                    {
                        "assetSubtypeId" : "GOOGLE_ANALYTICS_TRACKING_ID",
                        "assetTypeId"    : "TEXT",
                        "assetValue"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "clientBrandName": "WEX",
                        "links": []
                    }
                ]
            }
        };

    describe("A Brand Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.core");
            module("app.components.brand");
            module("app.components.user");
            module("app.components.navigation");
            module("app.components.widgets");

            // mock dependencies
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);
            BrandsResource = jasmine.createSpyObj("BrandsResource", ["getBrandAssets"]);
            BrandAssetCollection = jasmine.createSpyObj("BrandAssetCollection", ["getCollection"]);
            mockBrandAssetCollection = jasmine.createSpyObj("mockBrandAssetCollection", ["by", "find", "insert", "remove", "update"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            BrandUtil = jasmine.createSpyObj("BrandUtil", [
                "cacheAssetResourceData",
                "getAssetBySubtype",
                "getLastBrandUpdateDate",
                "loadBundledAsset",
                "removeAssetResourceFile",
                "setLastBrandUpdateDate"
            ]);

            module(function ($provide, appGlobals, sharedGlobals) {
                $provide.value("BrandsResource", BrandsResource);
                $provide.value("BrandAssetCollection", BrandAssetCollection);
                $provide.value("UserManager", UserManager);
                $provide.value("BrandUtil", BrandUtil);
                $provide.value("AnalyticsUtil", AnalyticsUtil);

                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            inject(function (___, _$q_, _$rootScope_, _$state_, _globals_, _moment_,
                             _BrandManager_, _BrandAssetModel_, _LoggerUtil_, UserModel, UserAccountModel) {
                _ = ___;
                LoggerUtil = _LoggerUtil_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                moment = _moment_;
                globals = _globals_;
                BrandManager = _BrandManager_;
                BrandAssetModel = _BrandAssetModel_;

                user = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
            spyOn($state, "transitionTo");

            // set up mocks
            brandId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            BrandAssetCollection.getCollection.and.returnValue(mockBrandAssetCollection);
            UserManager.getUser.and.returnValue(user);
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
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                brandAssetsObject = {};
                brandAssetsObject[brandId] = brandAssets;
                ifModifiedSince = TestUtils.getRandomDate();

                getBrandAssetsFirstCallDeferred = $q.defer();
                getBrandAssetsSecondCallDeferred = $q.defer();

                BrandsResource.getBrandAssets.and.callFake(function () {
                    if (alreadyCalled) {
                        return getBrandAssetsSecondCallDeferred.promise;
                    }

                    alreadyCalled = true;
                    return getBrandAssetsFirstCallDeferred.promise;
                });
                mockBrandAssetCollection[brandId] = [];
                mockBrandAssetCollection.find.and.returnValue(brandAssets);
                mockBrandAssetCollection.insert.and.callFake(_.bind(Array.prototype.push, mockBrandAssetCollection[brandId], _));

                BrandManager.fetchBrandAssets(brandId, ifModifiedSince)
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting the brand assets", function () {

                it("should call BrandsResource.getBrandAssets", function () {
                    expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith(brandId, ifModifiedSince);
                });

            });

            describe("when the brand assets are fetched successfully", function () {

                var mockRemoteBrandAssets = {data: {}};

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockRemoteBrandAssets.data = brandAssets.slice();
                        getBrandAssetsFirstCallDeferred.resolve(mockRemoteBrandAssets);

                        $rootScope.$digest();
                    });

                    it("should set the brand assets", function () {
                        expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(brandAssets);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockRemoteBrandAssets.data);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getBrandAssetsFirstCallDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT update the brand assets", function () {
                        expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                    });

                });
            });

            describe("when there was an error fetching the brand assets with status of 400", function () {

                beforeEach(function () {
                    mockError.status = 400;
                    getBrandAssetsFirstCallDeferred.reject(mockError);

                    $rootScope.$digest();
                });

                describe("should try to fetch brand assets for 'GENERIC' that", function () {

                    describe("when getting the brand assets", function () {

                        it("should call BrandsResource.getBrandAssets for 'GENERIC'", function () {
                            expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith("GENERIC", undefined);
                        });

                    });

                    describe("when the brand assets are fetched successfully", function () {

                        var mockRemoteBrandAssets = {data: {}};

                        describe("when there is data in the response", function () {

                            beforeEach(function () {
                                mockRemoteBrandAssets.data = brandAssets.slice();
                                getBrandAssetsSecondCallDeferred.resolve(mockRemoteBrandAssets);

                                $rootScope.$digest();
                            });

                            it("should set the brand assets", function () {
                                expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(brandAssets);
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockRemoteBrandAssets.data);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                        });

                        describe("when there is no data in the response", function () {

                            beforeEach(function () {
                                getBrandAssetsSecondCallDeferred.resolve(null);
                            });

                            it("should throw an error", function () {
                                expect($rootScope.$digest).toThrow();
                            });

                            it("should NOT update the brand assets", function () {
                                expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                            });

                        });
                    });

                    describe("when there was an error fetching the brand assets with status of 400", function () {

                        beforeEach(function () {
                            mockError.status = 400;
                            getBrandAssetsSecondCallDeferred.reject(mockError);
                        });

                        it("should throw an error", function () {
                            expect($rootScope.$digest).toThrow();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status of 422", function () {

                        beforeEach(function () {
                            mockError.status = 422;
                            getBrandAssetsSecondCallDeferred.reject(mockError);
                        });

                        it("should throw an error", function () {
                            expect($rootScope.$digest).toThrow();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status other than 400 or 422", function () {

                        beforeEach(function () {
                            mockError.status = 500;
                            getBrandAssetsFirstCallDeferred.reject(mockError);
                        });

                        it("should throw an error", function () {
                            expect($rootScope.$digest).toThrow();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });
                });

            });

            describe("when there was an error fetching the brand assets with status of 422", function () {

                beforeEach(function () {
                    mockError.status = 422;
                    getBrandAssetsFirstCallDeferred.reject(mockError);

                    $rootScope.$digest();
                });

                describe("should try to fetch brand assets for 'WEX' that", function () {

                    describe("when getting the brand assets", function () {

                        it("should call BrandsResource.getBrandAssets for 'WEX'", function () {
                            expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith("WEX", undefined);
                        });

                    });

                    describe("when the brand assets are fetched successfully", function () {

                        var mockRemoteBrandAssets = {data: {}};

                        describe("when there is data in the response", function () {

                            beforeEach(function () {
                                mockRemoteBrandAssets.data = brandAssets.slice();
                                getBrandAssetsSecondCallDeferred.resolve(mockRemoteBrandAssets);

                                $rootScope.$digest();
                            });

                            it("should set the brand assets", function () {
                                expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(brandAssets);
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalledWith(mockRemoteBrandAssets.data);
                                expect(rejectHandler).not.toHaveBeenCalled();
                            });

                        });

                        describe("when there is no data in the response", function () {

                            beforeEach(function () {
                                getBrandAssetsSecondCallDeferred.resolve(null);
                            });

                            it("should throw an error", function () {
                                expect($rootScope.$digest).toThrow();
                            });

                            it("should NOT update the brand assets", function () {
                                expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                            });

                        });
                    });

                    describe("when there was an error fetching the brand assets with status of 400", function () {

                        beforeEach(function () {
                            mockError.status = 400;
                            getBrandAssetsSecondCallDeferred.reject(mockError);
                        });

                        it("should throw an error", function () {
                            expect($rootScope.$digest).toThrow();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status of 422", function () {

                        beforeEach(function () {
                            mockError.status = 422;
                            getBrandAssetsSecondCallDeferred.reject(mockError);
                        });

                        it("should throw an error", function () {
                            expect($rootScope.$digest).toThrow();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });

                    describe("when there was an error fetching the brand assets with status other than 400 or 422", function () {

                        beforeEach(function () {
                            mockError.status = 500;
                            getBrandAssetsFirstCallDeferred.reject(mockError);
                        });

                        it("should throw an error", function () {
                            expect($rootScope.$digest).toThrow();
                        });

                        it("should NOT update the brand assets", function () {
                            expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                        });

                    });
                });

            });

            describe("when there was an error fetching the brand assets with status other than 400 or 422", function () {

                beforeEach(function () {
                    mockError.status = 500;
                    getBrandAssetsFirstCallDeferred.reject(mockError);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should NOT update the brand assets", function () {
                    expect(BrandManager.getBrandAssets()).not.toEqual(jasmine.objectContaining(brandAssetsObject));
                });

            });

        });

        describe("has a getBrandAssets function that", function () {

            it("should return the brand assets passed to setBrandAssets", function () {
                var result;

                mockBrandAssetCollection[brandId] = TestUtils.getRandomBrandAssets(BrandAssetModel);
                result = BrandManager.getBrandAssets();

                expect(result).toEqual(mockBrandAssetCollection);
            }) ;

            // TODO: figure out how to test this without using setBrandAssets
        });

        describe("has a setBrandAssets function that", function () {

            it("should update the brand assets returned by getBrandAssets", function () {
                var result;

                mockBrandAssetCollection[brandId] = TestUtils.getRandomBrandAssets(BrandAssetModel);
                result = BrandManager.getBrandAssets();

                expect(result).toEqual(mockBrandAssetCollection);
            }) ;

            // TODO: figure out how to test this without using getBrandAssets
        });

        describe("has a getBrandAssetsByBrand function that", function () {

            describe("when there are brand assets for the given brandId", function () {
                var brandAssets,
                    result;

                beforeEach(function () {
                    brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                    mockBrandAssetCollection.find.and.returnValue(brandAssets);

                    result = BrandManager.getBrandAssetsByBrand(brandId);
                });

                it("should call mockBrandAssetCollection.find with the expected values", function () {
                    var searchRegex = new RegExp(brandId, "i");

                    expect(mockBrandAssetCollection.find).toHaveBeenCalledWith({"clientBrandName" :{"$regex" : searchRegex}});
                });

                it("should return the brand assets for the given brandId", function () {
                    expect(result).toEqual(brandAssets);
                });
            });

            describe("when there are NOT brand assets for the given brandId", function () {

                beforeEach(function () {
                    mockBrandAssetCollection.find.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(BrandManager.getBrandAssetsByBrand(brandId)).toBeNull();
                });
            });
        });

        describe("has a storeBrandAssets function that", function () {
            var brandAssets,
                existingAssets,
                result;

            beforeEach(function () {
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                existingAssets = _.filter(brandAssets, TestUtils.getRandomBoolean);

                mockBrandAssetCollection[brandId] = [];
                mockBrandAssetCollection[brandId].concat(existingAssets);
                mockBrandAssetCollection.by.and.callFake(function (key, value) {
                    return _.find(existingAssets, _.zipObject([key], [value]));
                });
            });

            beforeEach(function () {
                result = BrandManager.storeBrandAssets(brandAssets);
            });

            it("should call update on the expected assets", function () {
                _.forEach(existingAssets, function (existingAsset) {
                    var expectedAsset = _.find(brandAssets, {brandAssetId: existingAsset.brandAssetId});

                    expect(mockBrandAssetCollection.update).toHaveBeenCalledWith(jasmine.objectContaining(expectedAsset));
                });
            });

            it("should call insert on the expected assets", function () {
                _.forEach(_.difference(brandAssets, existingAssets), function (newAsset) {
                    expect(mockBrandAssetCollection.insert).toHaveBeenCalledWith(newAsset);
                });
            });

            it("should return the given assets", function () {
                expect(result).toEqual(brandAssets);
            });
        });

        describe("has a removeBrandAsset function that", function () {
            var brandAsset;

            beforeEach(function () {
                brandAsset = TestUtils.getRandomBrandAsset(BrandAssetModel);
            });

            describe("when the given asset exists", function () {

                beforeEach(function () {
                    mockBrandAssetCollection.by.and.returnValue(brandAsset);

                    BrandManager.removeBrandAsset(brandAsset);
                });

                it("should call remove on the collection with the asset", function () {
                    expect(mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                });
            });

            describe("when the given asset does NOT exist", function () {

                beforeEach(function () {
                    mockBrandAssetCollection.by.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "Failed to remove brand asset: " + brandAsset.asset + " not found";

                    expect(function () {
                        BrandManager.removeBrandAsset(brandAsset);
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
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(brandAssets);
            });

            describe("when there is an expired asset", function () {
                var removeAssetResourceFileDeferred;

                beforeEach(function () {
                    removeAssetResourceFileDeferred = $q.defer();
                    BrandUtil.removeAssetResourceFile.and.returnValue(removeAssetResourceFileDeferred.promise);

                    //make brandAsset the only asset that's expired
                    _.forEach(brandAssets, function (brandAsset) {
                        brandAsset.endDate = moment().add(1, "days").toDate();
                    });

                    brandAsset.endDate = moment().subtract(1, "days").toDate();
                });

                beforeEach(function () {
                    mockBrandAssetCollection.find.and.returnValue(brandAssets);

                    BrandManager.removeExpiredBrandAssets(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                    $rootScope.$digest();
                });

                it("should call BrandUtil.removeAssetResourceFile with the expected values", function () {
                    expect(BrandUtil.removeAssetResourceFile).toHaveBeenCalledWith(brandAsset);
                });

                describe("when BrandUtil.removeAssetResourceFile succeeds", function () {

                    beforeEach(function () {
                        removeAssetResourceFileDeferred.resolve();
                    });

                    describe("when the given asset exists", function () {

                        beforeEach(function () {
                            mockBrandAssetCollection.by.and.returnValue(brandAsset);
                            $rootScope.$digest();
                        });

                        it("should call BrandAssetCollection.remove with the expected value", function () {
                            expect(mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                        });

                        it("should resolve the promise", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when the given asset doesn't exist", function () {

                        beforeEach(function () {
                            mockBrandAssetCollection.by.and.returnValue(null);
                        });

                        it("should throw an error", function () {
                            var expectedError = "Failed to remove brand asset: " + brandAsset.asset + " not found";

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });

                describe("when BrandUtil.removeAssetResourceFile fails", function () {
                    var error;

                    beforeEach(function () {
                        error = {
                            message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        };

                        removeAssetResourceFileDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
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
                    mockBrandAssetCollection.find.and.returnValue(brandAssets);

                    BrandManager.removeExpiredBrandAssets(brandName)
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
                    mockBrandAssetCollection.find.and.returnValue([]);

                    BrandManager.removeExpiredBrandAssets(brandName)
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
                    mockBrandAssetCollection.find.and.returnValue(null);

                    BrandManager.removeExpiredBrandAssets(brandName)
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
            var brandAssets;

            beforeEach(function () {
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                mockBrandAssetCollection.find.and.returnValue(brandAssets);
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(user);
                });

                it("should return that assets", function () {
                    expect(BrandManager.getUserBrandAssets()).toEqual(brandAssets);
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "User must be logged in to get user brand assets";

                    expect(BrandManager.getUserBrandAssets).toThrowError(expectedError);
                });
            });
        });

        describe("has a getUserBrandAssetBySubtype function that", function () {
            var assetSubtypeId,
                brandAssets,
                brandAsset;

            beforeEach(function () {
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(brandAssets);

                mockBrandAssetCollection.find.and.returnValue(brandAssets);
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(user);
                });

                describe("when an asset with the assetSubtypeId is found", function () {
                    var result;

                    beforeEach(function () {
                        BrandUtil.getAssetBySubtype.and.returnValue(brandAsset);

                        result = BrandManager.getUserBrandAssetBySubtype(assetSubtypeId);
                    });

                    it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                        expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(brandAssets, assetSubtypeId);
                    });

                    it("should return the value from BrandUtil.getAssetBySubtype", function () {
                        expect(result).toEqual(brandAsset);
                    });
                });

                describe("when an asset with the assetSubtypeId is NOT found", function () {
                    var result,
                        genericEquivalent;

                    beforeEach(function () {
                        genericEquivalent = TestUtils.getRandomBrandAsset(BrandAssetModel);

                        BrandUtil.getAssetBySubtype.and.returnValues(null, genericEquivalent);

                        result = BrandManager.getUserBrandAssetBySubtype(assetSubtypeId);
                    });

                    it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                        expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(brandAssets, assetSubtypeId);
                    });

                    it("should return a generic equivalent", function () {
                        expect(result).toEqual(genericEquivalent);
                    });
                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    UserManager.getUser.and.returnValue(null);
                });

                it("should throw an error", function () {
                    var expectedError = "User must be logged in to get user brand assets";

                    expect(BrandManager.getUserBrandAssetBySubtype).toThrowError(expectedError);
                });
            });
        });

        describe("has a getGenericBrandAssets function that", function () {

            describe("when there are generic brand assets", function () {
                var genericAssets;

                beforeEach(function () {
                    genericAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                    mockBrandAssetCollection.find.and.returnValue(genericAssets);
                });

                it("should return the generic brand assets", function () {
                    expect(BrandManager.getGenericBrandAssets()).toEqual(genericAssets);
                });
            });

            describe("when there are NOT generic brand assets", function () {

                beforeEach(function () {
                    mockBrandAssetCollection.find.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(BrandManager.getGenericBrandAssets()).toBeNull();
                });
            });
        });

        describe("has a getWexBrandAssets function that", function () {

            describe("when there are wex brand assets", function () {
                var wexAssets;

                beforeEach(function () {
                    wexAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                    mockBrandAssetCollection.find.and.returnValue(wexAssets);
                });

                it("should return the wex brand assets", function () {
                    expect(BrandManager.getWexBrandAssets()).toEqual(wexAssets);
                });
            });

            describe("when there are NOT wex brand assets", function () {

                beforeEach(function () {
                    mockBrandAssetCollection.find.and.returnValue(null);
                });

                it("should return null", function () {
                    expect(BrandManager.getWexBrandAssets()).toBeNull();
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
                    fileAssetFetchResourceDeferred,
                    loadBundledAssetDeferred;

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
                    loadBundledAssetDeferred = $q.defer();
                    spyOn(fileAsset, "fetchResource").and.returnValue(fileAssetFetchResourceDeferred.promise);
                    BrandUtil.loadBundledAsset.and.returnValue(loadBundledAssetDeferred.promise);

                    brandResource.push(fileAsset);
                });

                beforeEach(function () {
                    BrandManager.loadBundledBrand(brandName, brandResource)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call BrandAssetCollection.insert with the expected values", function () {
                    _.forEach(brandResource, function (brandAsset) {
                        expect(mockBrandAssetCollection.insert).toHaveBeenCalledWith(brandAsset);
                    });
                });

                describe("when loading a FILE asset", function () {

                    it("should call BrandUtil.loadBundledAsset with the file asset", function () {
                        expect(BrandUtil.loadBundledAsset).toHaveBeenCalledWith(fileAsset);
                    });

                    describe("when BrandUtil.loadBundledAsset succeeds", function () {
                        var data;

                        beforeEach(function () {
                            data = TestUtils.getRandomStringThatIsAlphaNumeric(30);

                            loadBundledAssetDeferred.resolve(data);
                            $rootScope.$digest();
                        });

                        it("should return a promise that resolves with an array containing the resource data", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(jasmine.arrayContaining([data]));
                        });
                    });

                    describe("when BrandUtil.loadBundledAsset fails", function () {
                        var error;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };

                            loadBundledAssetDeferred.reject(error);
                        });

                        it("should throw an error", function () {
                            var expectedError = new RegExp("Failed to load bundled brand '" + brandName + "':.+");

                            expect($rootScope.$digest).toThrowError(expectedError);
                        });
                    });
                });
            });

            describe("when there are no FILE assets", function () {

                beforeEach(function () {
                    _.remove(brandResource, {assetTypeId: globals.BRAND.ASSET_TYPES.FILE});
                });

                beforeEach(function () {
                    BrandManager.loadBundledBrand(brandName, brandResource)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should call BrandAssetCollection.insert with the expected values", function () {
                    _.forEach(brandResource, function (brandAsset) {
                        expect(mockBrandAssetCollection.insert).toHaveBeenCalledWith(brandAsset);
                    });
                });

                it("should return a promise that resolves", function () {
                    expect(resolveHandler).toHaveBeenCalled();
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

            function testUpdateBrandCacheWithoutDate() {

                it("should call BrandsResource.getBrandAssets with the expected values", function () {
                    expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith(brandName, null);
                });

                describe("when BrandUtil.removeAssetResourceFile succeeds", function () {

                    beforeEach(function () {
                        removeAssetResourceFileDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should call BrandAssetCollection.remove with the expected values", function () {
                        _.forEach(brandAssets, function (brandAsset) {
                            if (brandAsset.isExpired()) {
                                expect(mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                            }
                        });
                    });
                });

                describe("when BrandUtil.removeAssetResourceFile fails", function () {

                    beforeEach(function () {
                        removeAssetResourceFileDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should NOT reject the promise", function () {
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });
                });

                describe("when getting the brand assets succeeds", function () {
                    var brandAssetResources;

                    beforeEach(function () {
                        brandAssetResources = _.clone(brandAssets);

                        if(_.isEmpty(brandAssetResources)) {
                            var addedResource = TestUtils.getRandomBrandAsset(BrandAssetModel);
                            addedResource.assetTypeId = globals.BRAND.ASSET_TYPES.FILE;
                            brandAssetResources.push(addedResource);
                        }

                        getBrandAssetsDeferred.resolve({data: brandAssetResources});
                        $rootScope.$digest();
                    });

                    it("should call BrandUtil.cacheAssetResourceData with the expected values", function () {
                        _.forEach(brandAssetResources, function (brandAsset) {
                            if (brandAsset.hasResource()) {
                                expect(BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(brandAsset, false);
                            }
                            else {
                                expect(BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(brandAsset, false);
                            }
                        });
                    });

                    describe("when BrandUtil.cacheAssetResourceData succeeds", function () {

                        beforeEach(function () {
                            cacheAssetResourceDataDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should call BrandUtil.setLastBrandUpdateDate with the brand name", function () {
                            expect(BrandUtil.setLastBrandUpdateDate).toHaveBeenCalledWith(brandName);
                        });

                        it("should resolve", function () {
                            expect(resolveHandler).toHaveBeenCalled();
                        });
                    });

                    describe("when BrandUtil.cacheAssetResourceData fails", function () {
                        var error,
                            genericAssets;

                        beforeEach(function () {
                            error = {
                                message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            };
                            genericAssets = _.map(brandAssetResources, function (brandAsset) {
                                return angular.extend(new BrandAssetModel(), brandAsset);
                            });

                            mockBrandAssetCollection.find.and.returnValue(genericAssets);
                            cacheAssetResourceDataDeferred.reject(error);
                        });

                        describe("when BrandUtil.cacheAssetResourceData succeeds with the generic asset", function () {

                            beforeEach(function () {
                                cacheAssetResourceDataDeferred2.resolve();
                            });

                            it("should throw an error", function () {
                                var expectedError = new RegExp("Failed to update brand cache:.+");

                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrowError(expectedError);

                                expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                            });

                            it("should NOT update the last update date", function () {
                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrow();

                                expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                            });

                            it("should call BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrow();

                                _.forEach(genericAssets, function (genericAsset) {
                                    if (genericAsset.hasResource()) {
                                        expect(BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, false);
                                    }
                                    else {
                                        expect(BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, false);
                                    }
                                });
                            });
                        });

                        describe("when BrandUtil.cacheAssetResourceData fails with the generic asset", function () {

                            beforeEach(function () {
                                cacheAssetResourceDataDeferred2.reject(error);
                            });

                            it("should throw an error", function () {
                                var expectedError = new RegExp("Failed to update brand cache:.+");

                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrowError(expectedError);

                                expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                            });

                            it("should NOT update the last update date", function () {
                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrow();

                                expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                            });

                            it("should call BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                expect(function () {
                                    TestUtils.digestError($rootScope);
                                }).toThrow();

                                _.forEach(genericAssets, function (genericAsset) {
                                    if (genericAsset.hasResource()) {
                                        expect(BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, false);
                                    }
                                    else {
                                        expect(BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, false);
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
                    });

                    it("should NOT update the last update date and throw an error", function () {
                        var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + LoggerUtil.getErrorMessage(error) + ".*?$");

                        expect(function () {
                            TestUtils.digestError($rootScope);
                        }).toThrowError(expectedError);

                        expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                    });
                });
            }

            beforeEach(function () {
                brandName = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                currentDate = TestUtils.getRandomDate();
                numFileAssets = 0;
                getBrandAssetsDeferred = $q.defer();
                cacheAssetResourceDataDeferred = $q.defer();
                cacheAssetResourceDataDeferred2 = $q.defer();
                removeAssetResourceFileDeferred = $q.defer();

                _.forEach(_.filter(brandAssets, TestUtils.getRandomBoolean), function (brandAsset) {
                    brandAsset.assetTypeId = globals.BRAND.ASSET_TYPES.FILE;
                    ++numFileAssets;
                });

                //make sure there is at least 1 file asset
                if (numFileAssets === 0) {
                    brandAssets[0].assetTypeId = globals.BRAND.ASSET_TYPES.FILE;
                    numFileAssets = 1;
                }

                BrandsResource.getBrandAssets.and.returnValue(getBrandAssetsDeferred.promise);
                //return cacheAssetResourceDataDeferred/cacheAssetResourceDataDeferred2 x number of times based on the number of assets
                _.spread(BrandUtil.cacheAssetResourceData.and.returnValues)(
                    _.fill(new Array(numFileAssets), cacheAssetResourceDataDeferred.promise).concat(
                        _.fill(new Array(numFileAssets), cacheAssetResourceDataDeferred2.promise)
                    ));

                BrandUtil.removeAssetResourceFile.and.returnValue(removeAssetResourceFileDeferred.promise);

                jasmine.clock().mockDate(currentDate);
            });

            describe("when there is a last update date", function () {
                var lastUpdateDate;

                function testUpdateBrandCacheWithDate() {

                    it("should call BrandsResource.getBrandAssets with the expected values", function () {
                        expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith(brandName, lastUpdateDate);
                    });

                    it("should call BrandUtil.removeAssetResourceFile with the expected values", function () {
                        _.forEach(brandAssets, function (brandAsset) {
                            if (brandAsset.isExpired()) {
                                expect(BrandUtil.removeAssetResourceFile).toHaveBeenCalledWith(brandAsset);
                            }
                        });
                    });

                    describe("when BrandUtil.removeAssetResourceFile succeeds", function () {

                        beforeEach(function () {
                            removeAssetResourceFileDeferred.resolve();
                            $rootScope.$digest();
                        });

                        it("should call BrandAssetCollection.remove with the expected values", function () {
                            _.forEach(brandAssets, function (brandAsset) {
                                if (brandAsset.isExpired()) {
                                    expect(mockBrandAssetCollection.remove).toHaveBeenCalledWith(brandAsset);
                                }
                            });
                        });
                    });

                    describe("when BrandUtil.removeAssetResourceFile fails", function () {

                        beforeEach(function () {
                            removeAssetResourceFileDeferred.reject();
                            $rootScope.$digest();
                        });

                        it("should NOT reject the promise", function () {
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });
                    });

                    describe("when getting the brand assets succeeds", function () {

                        beforeEach(function () {
                            getBrandAssetsDeferred.resolve({data: brandAssets});
                            $rootScope.$digest();
                        });

                        it("should call BrandUtil.cacheAssetResourceData with the expected values", function () {
                            _.forEach(brandAssets, function (brandAsset) {
                                if (brandAsset.hasResource()) {
                                    expect(BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(brandAsset, true);
                                }
                                else {
                                    expect(BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(brandAsset, true);
                                }
                            });
                        });

                        describe("when BrandUtil.cacheAssetResourceData succeeds", function () {

                            beforeEach(function () {
                                cacheAssetResourceDataDeferred.resolve();
                                $rootScope.$digest();
                            });

                            it("should call BrandUtil.setLastBrandUpdateDate with the brand name", function () {
                                expect(BrandUtil.setLastBrandUpdateDate).toHaveBeenCalledWith(brandName);
                            });

                            it("should resolve", function () {
                                expect(resolveHandler).toHaveBeenCalled();
                            });
                        });

                        describe("when BrandUtil.cacheAssetResourceData fails", function () {
                            var error,
                                genericAssets;

                            beforeEach(function () {
                                error = {
                                    message: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                };
                                genericAssets = _.map(brandAssets, function (brandAsset) {
                                    return angular.extend(new BrandAssetModel(), brandAsset);
                                });

                                mockBrandAssetCollection.find.and.returnValue(genericAssets);
                                cacheAssetResourceDataDeferred.reject(error);
                            });

                            describe("when BrandUtil.cacheAssetResourceData succeeds with the generic asset", function () {

                                beforeEach(function () {
                                    cacheAssetResourceDataDeferred2.resolve();
                                });

                                it("should throw an error", function () {
                                    var expectedError = new RegExp("Failed to update brand cache:.+");

                                    expect(function () {
                                        TestUtils.digestError($rootScope);
                                    }).toThrowError(expectedError);

                                    expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                                });

                                it("should NOT update the last update date", function () {
                                    expect(function () {
                                        TestUtils.digestError($rootScope);
                                    }).toThrow();

                                    expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                                });

                                it("should call BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                    expect(function () {
                                        TestUtils.digestError($rootScope);
                                    }).toThrow();

                                    _.forEach(genericAssets, function (genericAsset) {
                                        if (genericAsset.hasResource()) {
                                            expect(BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, true);
                                        }
                                        else {
                                            expect(BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, true);
                                        }
                                    });
                                });
                            });

                            describe("when BrandUtil.cacheAssetResourceData fails with the generic asset", function () {

                                beforeEach(function () {
                                    cacheAssetResourceDataDeferred2.reject(error);
                                });

                                it("should throw an error", function () {
                                    var expectedError = new RegExp("Failed to update brand cache:.+");

                                    expect(function () {
                                        TestUtils.digestError($rootScope);
                                    }).toThrowError(expectedError);

                                    expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                                });

                                it("should NOT update the last update date", function () {
                                    expect(function () {
                                        TestUtils.digestError($rootScope);
                                    }).toThrow();

                                    expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                                });

                                it("should call BrandUtil.cacheAssetResourceData again with a generic equivalent", function () {
                                    expect(function () {
                                        TestUtils.digestError($rootScope);
                                    }).toThrow();

                                    _.forEach(genericAssets, function (genericAsset) {
                                        if (genericAsset.hasResource()) {
                                            expect(BrandUtil.cacheAssetResourceData).toHaveBeenCalledWith(genericAsset, true);
                                        }
                                        else {
                                            expect(BrandUtil.cacheAssetResourceData).not.toHaveBeenCalledWith(genericAsset, true);
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
                        });

                        it("should NOT update the last update date and throw an error", function () {
                            var expectedError = new RegExp("^.*?(Failed to update brand cache:).*?" + LoggerUtil.getErrorMessage(error) + ".*?$");

                            expect(function () {
                                TestUtils.digestError($rootScope);
                            }).toThrowError(expectedError);

                            expect(BrandUtil.setLastBrandUpdateDate).not.toHaveBeenCalled();
                        });
                    });
                }

                beforeEach(function () {
                    lastUpdateDate = TestUtils.getRandomDate();
                    BrandUtil.getLastBrandUpdateDate.and.returnValue(lastUpdateDate);
                });

                describe("when there are assets for the given brand in the cache", function () {

                    beforeEach(function () {
                        mockBrandAssetCollection.find.and.returnValue(brandAssets);
                        mockBrandAssetCollection.by.and.callFake(function (key, value) {
                            return _.find(brandAssets, _.zipObject([key], [value]));
                        });
                    });

                    beforeEach(function () {
                        BrandManager.updateBrandCache(brandName)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    describe("should update the brand assets using the last update date: ", testUpdateBrandCacheWithDate);
                });

                describe("when there are NO assets for the given brand in the cache", function () {

                    beforeEach(function () {
                        brandAssets = [];
                        mockBrandAssetCollection.find.and.returnValue(brandAssets);
                    });

                    beforeEach(function () {
                        BrandManager.updateBrandCache(brandName)
                            .then(resolveHandler)
                            .catch(rejectHandler);
                    });

                    describe("should update the brand assets using the last update date: ", testUpdateBrandCacheWithoutDate);
                });
            });

            describe("when there is NOT a last update date", function () {

                beforeEach(function () {
                    BrandUtil.getLastBrandUpdateDate.and.returnValue(null);

                    mockBrandAssetCollection.find.and.returnValue(brandAssets);
                    mockBrandAssetCollection.by.and.callFake(function (key, value) {
                        return _.find(brandAssets, _.zipObject([key], [value]));
                    });
                });

                beforeEach(function () {
                    BrandManager.updateBrandCache(brandName)
                        .then(resolveHandler)
                        .catch(rejectHandler);
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
                genericBrandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(genericBrandAssets);

                mockBrandAssetCollection.find.and.returnValue(genericBrandAssets);
                BrandUtil.getAssetBySubtype.and.returnValue(brandAsset);

                result = BrandManager.getGenericBrandAssetBySubtype(assetSubtypeId);
            });

            it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(genericBrandAssets, assetSubtypeId);
            });

            it("should return the value from BrandUtil.getAssetBySubtype", function () {
                expect(result).toEqual(brandAsset);
            });
        });

        describe("has a getWexBrandAssetBySubtype function that", function () {
            var assetSubtypeId,
                wexBrandAssets,
                brandAsset,
                result;

            beforeEach(function () {
                wexBrandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);
                brandAsset = TestUtils.getRandomValueFromArray(wexBrandAssets);

                mockBrandAssetCollection.find.and.returnValue(wexBrandAssets);
                BrandUtil.getAssetBySubtype.and.returnValue(brandAsset);

                result = BrandManager.getWexBrandAssetBySubtype(assetSubtypeId);
            });

            it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(wexBrandAssets, assetSubtypeId);
            });

            it("should return the value from BrandUtil.getAssetBySubtype", function () {
                expect(result).toEqual(brandAsset);
            });
        });

        describe("has a getGenericAnalyticsTrackingId function that", function () {

            describe("when there is a generic analytics tracking id", function () {
                var trackingId,
                    result;

                beforeEach(function () {
                    trackingId = TestUtils.getRandomBrandAsset(BrandAssetModel);
                    BrandUtil.getAssetBySubtype.and.returnValue(trackingId);

                    result = BrandManager.getGenericAnalyticsTrackingId();
                });

                it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(globals.BRANDS.GENERIC, globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
                });

                it("should return the expected value", function () {
                    expect(result).toEqual(trackingId.assetValue);
                });
            });

            describe("when there is NOT a generic analytics tracking id", function () {
                var result;

                beforeEach(function () {
                    result = BrandManager.getGenericAnalyticsTrackingId();
                });

                it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(globals.BRANDS.GENERIC, globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
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
                    trackingId = TestUtils.getRandomBrandAsset(BrandAssetModel);
                    BrandUtil.getAssetBySubtype.and.returnValue(trackingId);

                    result = BrandManager.getWexAnalyticsTrackingId();
                });

                it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(globals.BRANDS.WEX, globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
                });

                it("should return the expected value", function () {
                    expect(result).toEqual(trackingId.assetValue);
                });
            });

            describe("when there is NOT a wex analytics tracking id", function () {
                var result;

                beforeEach(function () {
                    result = BrandManager.getWexAnalyticsTrackingId();
                });

                it("should call BrandUtil.getAssetBySubtype with the expected values", function () {
                    expect(BrandUtil.getAssetBySubtype).toHaveBeenCalledWith(globals.BRANDS.WEX, globals.BRAND.ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);
                });

                it("should return null", function () {
                    expect(result).toBeNull();
                });
            });
        });

    });

})();