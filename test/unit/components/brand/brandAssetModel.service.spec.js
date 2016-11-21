(function () {
    "use strict";

    describe("A BrandAsset Model Service", function () {

        var brandAsset,
            HateoasResource,
            moment,
            globals;

        beforeEach(function () {

            inject(function (_globals_, _moment_, BrandAssetModel, _HateoasResource_) {
                HateoasResource = _HateoasResource_;
                globals = _globals_;
                moment = _moment_;

                brandAsset = new BrandAssetModel();
            });
        });

        it("should extend HateoasResource", function () {
            expect(brandAsset instanceof HateoasResource).toBeTruthy();
        });

        describe("has a hasResource function that", function () {

            describe("when assetTypeId is FILE", function () {

                beforeEach(function () {
                    brandAsset.assetTypeId = globals.BRAND.ASSET_TYPES.FILE;
                });

                it("should return true", function () {
                    expect(brandAsset.hasResource()).toBeTruthy();
                });
            });

            describe("when assetTypeId is unrecognized", function () {

                beforeEach(function () {
                    brandAsset.assetTypeId = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return false", function () {
                    expect(brandAsset.hasResource()).toBeFalsy();
                });
            });

            describe("when assetTypeId is null", function () {

                beforeEach(function () {
                    brandAsset.assetTypeId = null;
                });

                it("should return false", function () {
                    expect(brandAsset.hasResource()).toBeFalsy();
                });
            });

            describe("when assetTypeId is undefined", function () {

                beforeEach(function () {
                    brandAsset.assetTypeId = undefined;
                });

                it("should return false", function () {
                    expect(brandAsset.hasResource()).toBeFalsy();
                });
            });
        });

        describe("has an isExpired function that", function () {

            describe("when the endDate is before the current date", function () {

                beforeEach(function () {
                    brandAsset.endDate = moment().subtract(1, "days").toDate();
                });

                it("should return true", function () {
                    expect(brandAsset.isExpired()).toBeTruthy();
                });
            });

            describe("when the endDate is after the current date", function () {

                beforeEach(function () {
                    brandAsset.endDate = moment().add(1, "days").toDate();
                });

                it("should return false", function () {
                    expect(brandAsset.isExpired()).toBeFalsy();
                });
            });

            describe("when the endDate is null", function () {

                beforeEach(function () {
                    brandAsset.endDate = null;
                });

                it("should return false", function () {
                    expect(brandAsset.isExpired()).toBeFalsy();
                });
            });

            describe("when the endDate is undefined", function () {

                beforeEach(function () {
                    delete brandAsset.endDate;
                });

                it("should return false", function () {
                    expect(brandAsset.isExpired()).toBeFalsy();
                });
            });
        });

    });

})();
