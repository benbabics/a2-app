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
        BrandsResource;

    // TODO: Fix this test by mocking indexedDB
    xdescribe("A Brand Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.brand");

            // mock dependencies
            BrandsResource = jasmine.createSpyObj("BrandsResource", ["getBrandAssets"]);

            module(function ($provide) {
                $provide.value("BrandsResource", BrandsResource);
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
            mockBrandAssetCollection = {};
            mockBrandAssetCollection[brandId] = TestUtils.getRandomBrandAssets(BrandAssetModel);
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a clearCachedValues function that", function () {

            beforeEach(function () {
                BrandManager.setBrandAssets(mockBrandAssetCollection);
                BrandManager.clearCachedValues();
            });

            it("should reset the brand assets", function () {
                expect(BrandManager.getBrandAssets()).toEqual({});
            });

        });

        describe("has a fetchBrandAssets function that", function () {

            var alreadyCalled,
                mockError = {
                    status: ""
                };

            beforeEach(function () {
                alreadyCalled = false;

                getBrandAssetsFirstCallDeferred = $q.defer();
                getBrandAssetsSecondCallDeferred = $q.defer();

                BrandsResource.getBrandAssets.and.callFake(function () {
                    if (alreadyCalled) {
                        return getBrandAssetsSecondCallDeferred.promise;
                    }

                    alreadyCalled = true;
                    return getBrandAssetsFirstCallDeferred.promise;
                });

                BrandManager.setBrandAssets({});

                BrandManager.fetchBrandAssets(brandId)
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting the brand assets", function () {

                it("should call BrandsResource.getBrandAssets", function () {
                    expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith(brandId);
                });

            });

            describe("when the brand assets are fetched successfully", function () {

                var mockRemoteBrandAssets = {data: {}};

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockRemoteBrandAssets.data = mockBrandAssetCollection[brandId].slice();
                        getBrandAssetsFirstCallDeferred.resolve(mockRemoteBrandAssets);

                        $rootScope.$digest();
                    });

                    it("should set the brand assets", function () {
                        expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(mockBrandAssetCollection[brandId]);
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
                        expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith("GENERIC");
                        });

                    });

                    describe("when the brand assets are fetched successfully", function () {

                        var mockRemoteBrandAssets = {data: {}};

                        describe("when there is data in the response", function () {

                            beforeEach(function () {
                                mockRemoteBrandAssets.data = mockBrandAssetCollection[brandId].slice();
                                getBrandAssetsSecondCallDeferred.resolve(mockRemoteBrandAssets);

                                $rootScope.$digest();
                            });

                            it("should set the brand assets", function () {
                                expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(mockBrandAssetCollection[brandId]);
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
                                expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandsResource.getBrandAssets).toHaveBeenCalledWith("WEX");
                        });

                    });

                    describe("when the brand assets are fetched successfully", function () {

                        var mockRemoteBrandAssets = {data: {}};

                        describe("when there is data in the response", function () {

                            beforeEach(function () {
                                mockRemoteBrandAssets.data = mockBrandAssetCollection[brandId].slice();
                                getBrandAssetsSecondCallDeferred.resolve(mockRemoteBrandAssets);

                                $rootScope.$digest();
                            });

                            it("should set the brand assets", function () {
                                expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(mockBrandAssetCollection[brandId]);
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
                                expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandManager.getBrandAssets()).toEqual({});
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
                            expect(BrandManager.getBrandAssets()).toEqual({});
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
                    expect(BrandManager.getBrandAssets()).toEqual({});
                });

            });

        });

        describe("has a getBrandAssets function that", function () {

            it("should return the brand assets passed to setBrandAssets", function () {
                var result;

                BrandManager.setBrandAssets(mockBrandAssetCollection);
                result = BrandManager.getBrandAssets();

                expect(result).toEqual(mockBrandAssetCollection);
            }) ;

            // TODO: figure out how to test this without using setBrandAssets
        });

        describe("has a setBrandAssets function that", function () {

            it("should update the brand assets returned by getBrandAssets", function () {
                var result;

                BrandManager.setBrandAssets(mockBrandAssetCollection);
                result = BrandManager.getBrandAssets();

                expect(result).toEqual(mockBrandAssetCollection);
            }) ;

            // TODO: figure out how to test this without using getBrandAssets
        });

        describe("has a getBrandAssetsByBrand function that", function () {

            describe("when there are brand assets for the given brandId", function () {

                beforeEach(function () {
                    BrandManager.setBrandAssets(mockBrandAssetCollection);
                });

                it("should return the brand assets for the given brandId", function () {
                    expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(mockBrandAssetCollection[brandId]);
                });

                // TODO: figure out how to test this without using getBrandAssetsByBrand
            });

            describe("when there are NOT brand assets for the given brandId", function () {

                beforeEach(function () {
                    BrandManager.setBrandAssets({});
                });

                it("should return null", function () {
                    expect(BrandManager.getBrandAssetsByBrand(brandId)).toBeNull();
                });

                // TODO: figure out how to test this without using getBrandAssetsByBrand
            });
        });

        describe("has a storeBrandAssets function that", function () {
            var brandId,
                brandAssets;

            beforeEach(function () {
                brandId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                brandAssets = TestUtils.getRandomBrandAssets(BrandAssetModel);

                BrandManager.storeBrandAssets(brandId, brandAssets);
            });

            it("should store the brand assets in the cache", function () {
                expect(BrandManager.getBrandAssetsByBrand(brandId)).toEqual(brandAssets);
            });

            // TODO: figure out how to test this without using getBrandAssetsByBrand
        });

        describe("has a updateBrandAssets function that", function () {

            //TODO: Add these tests
        });

        describe("has a removeBrandAsset function that", function () {

            //TODO: Add these tests
        });

    });

})();