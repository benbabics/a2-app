(function () {
    "use strict";

    var _,
        $q,
        $rootScope,
        brandId,
        getBrandAssetsFirstCallDeferred,
        getBrandAssetsSecondCallDeferred,
        mockBrandAssetCollection,
        resolveHandler,
        rejectHandler,
        BrandManager,
        BrandAssetModel,
        BrandsResource,
        BrandAssetCollection;

    describe("A Brand Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.brand");

            // mock dependencies
            BrandsResource = jasmine.createSpyObj("BrandsResource", ["getBrandAssets"]);
            BrandAssetCollection = jasmine.createSpyObj("BrandAssetCollection", ["getCollection"]);
            mockBrandAssetCollection = jasmine.createSpyObj("mockBrandAssetCollection", ["by", "find", "insert", "remove", "update"]);

            module(function ($provide) {
                $provide.value("BrandsResource", BrandsResource);
                $provide.value("BrandAssetCollection", BrandAssetCollection);
            });

            inject(function (_$q_, _$rootScope_, globals, _BrandManager_, _BrandAssetModel_, _CommonService_) {
                _ = _CommonService_._;
                $q = _$q_;
                $rootScope = _$rootScope_;
                BrandManager = _BrandManager_;
                BrandAssetModel = _BrandAssetModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            // set up mocks
            brandId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            BrandAssetCollection.getCollection.and.returnValue(mockBrandAssetCollection);
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

                it("should return an empty array", function () {
                    expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual([]);
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

    });

})();