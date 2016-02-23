(function () {
    "use strict";

    var BrandAssetCollection,
        IndexedDatabase,
        globals,
        BrandAssetModel,
        brandAssetCollection = {
            name : "brandAssetCollection",
            data : []
        },
        result;

    describe("A BrandAssetCollection", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.components.brand");

            inject(function (_BrandAssetCollection_, _globals_, _BrandAssetModel_, _IndexedDatabase_) {
                BrandAssetCollection = _BrandAssetCollection_;
                globals = _globals_;
                BrandAssetModel = _BrandAssetModel_;
                IndexedDatabase = _IndexedDatabase_;
            });

            spyOn(IndexedDatabase, "getCollection");
            spyOn(IndexedDatabase, "addCollection");
        });

        describe("has a getCollection function that", function () {

            describe("when IndexedDatabase.getCollection returns brandAssetCollection", function () {

                beforeEach(function() {
                    brandAssetCollection.data[0] = TestUtils.getRandomBrandAsset(BrandAssetModel);
                    IndexedDatabase.getCollection.and.returnValue(brandAssetCollection);
                    result = BrandAssetCollection.getCollection();
                });

                it("should call IndexedDatabase.getCollection", function () {
                    expect(IndexedDatabase.getCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTIOM);
                });

                it("should return a result equal to brandAssetCollection", function () {
                    expect(result).toEqual(brandAssetCollection);
                });
            });

            describe("when IndexedDatabase.getCollection returns null", function () {
                beforeEach(function () {
                    IndexedDatabase.getCollection.and.returnValue(null);
                });

                describe("when IndexedDatabase.addCollection returns brandAssetCollection", function () {
                    beforeEach(function () {
                        IndexedDatabase.addCollection.and.returnValue(brandAssetCollection);
                        result = BrandAssetCollection.getCollection();
                    });

                    it("should call IndexedDatabase.getCollection", function () {
                        expect(IndexedDatabase.getCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTIOM);
                    });

                    it("should call IndexedDatabase.addCollection", function () {
                        expect(IndexedDatabase.addCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTIOM);
                    });

                    it("should return a result equal to brandAssetCollection", function () {
                        expect(result).toEqual(brandAssetCollection);
                    });
                });

                describe("when IndexedDatabase.addCollection returns null", function () {
                    beforeEach(function () {
                        IndexedDatabase.addCollection.and.returnValue(null);
                        result = BrandAssetCollection.getCollection();
                    });

                    it("should call IndexedDatabase.getCollection", function () {
                        expect(IndexedDatabase.getCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTIOM);
                    });

                    it("should call IndexedDatabase.addCollection", function () {
                        expect(IndexedDatabase.addCollection).toHaveBeenCalledWith(globals.BRAND_ASSET_COLLECTIOM);
                    });

                    it("should return null", function () {
                        expect(result).toEqual(null);
                    });
                });
            });
        });
    });

})();