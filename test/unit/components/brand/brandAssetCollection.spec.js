(function () {
    "use strict";

    var BrandAssetCollection,
        DataStore,
        globals,
        BrandAssetModel,
        brandAssetCollection = {
            name : "brandAssetCollection",
            data : []
        },
        result;

    describe("A BrandAssetCollection", function () {

        beforeEach(function () {

            inject(function (_BrandAssetCollection_, _globals_, _BrandAssetModel_, _DataStore_) {
                BrandAssetCollection = _BrandAssetCollection_;
                globals = _globals_;
                BrandAssetModel = _BrandAssetModel_;
                DataStore = _DataStore_;
            });

            spyOn(DataStore, "getCollection");
            spyOn(DataStore, "addCollection");
        });

        describe("has a getCollection function that", function () {

            describe("when DataStore.getCollection returns brandAssetCollection", function () {

                beforeEach(function() {
                    brandAssetCollection.data[0] = TestUtils.getRandomBrandAsset(BrandAssetModel);
                    DataStore.getCollection.and.returnValue(brandAssetCollection);
                    result = BrandAssetCollection.getCollection();
                });

                it("should call DataStore.getCollection", function () {
                    expect(DataStore.getCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTION);
                });

                it("should return a result equal to brandAssetCollection", function () {
                    expect(result).toEqual(brandAssetCollection);
                });
            });

            describe("when DataStore.getCollection returns null", function () {
                beforeEach(function () {
                    DataStore.getCollection.and.returnValue(null);
                });

                describe("when DataStore.addCollection returns brandAssetCollection", function () {
                    beforeEach(function () {
                        DataStore.addCollection.and.returnValue(brandAssetCollection);
                        result = BrandAssetCollection.getCollection();
                    });

                    it("should call DataStore.getCollection", function () {
                        expect(DataStore.getCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTION);
                    });

                    it("should call DataStore.addCollection", function () {
                        expect(DataStore.addCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTION);
                    });

                    it("should return a result equal to brandAssetCollection", function () {
                        expect(result).toEqual(brandAssetCollection);
                    });
                });

                describe("when DataStore.addCollection returns null", function () {
                    beforeEach(function () {
                        DataStore.addCollection.and.returnValue(null);
                        result = BrandAssetCollection.getCollection();
                    });

                    it("should call DataStore.getCollection", function () {
                        expect(DataStore.getCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTION);
                    });

                    it("should call DataStore.addCollection", function () {
                        expect(DataStore.addCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTION);
                    });

                    it("should return null", function () {
                        expect(result).toEqual(null);
                    });
                });
            });
        });
    });

})();
