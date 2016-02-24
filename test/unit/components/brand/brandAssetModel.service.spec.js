(function () {
    "use strict";

    describe("A BrandAsset Model Service", function () {

        var _,
            brandAsset,
            HateoasResource,
            moment,
            globals;

        beforeEach(function () {
            module("app.shared");
            module("app.components.brand");

            inject(function (_globals_, _moment_, BrandAssetModel, CommonService, _HateoasResource_) {
                HateoasResource = _HateoasResource_;
                _ = CommonService._;
                globals = _globals_;
                moment = _moment_;

                brandAsset = new BrandAssetModel();
            });
        });

        it("should extend HateoasResource", function () {
            expect(brandAsset instanceof HateoasResource).toBeTruthy();
        });

        describe("has a set function that", function () {

            var brandAssetResource,
                brandAssetModelKeys,
                brandAssetResourceKeys;

            beforeEach(inject(function (BrandAssetModel) {
                brandAssetResource = angular.extend(TestUtils.getRandomBrandAsset(BrandAssetModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in brandAsset) {
                    if (_.has(brandAsset, property)) {
                        brandAsset[property] = "default";
                    }
                }

                brandAssetModelKeys = _.keys(brandAsset);
                brandAssetResourceKeys = _.keys(brandAssetResource);
            }));

            it("should set the BrandAsset object with the fields from the passed in brandResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(brandAssetModelKeys, brandAssetResourceKeys);

                brandAsset.set(brandAssetResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(brandAsset[key]).toEqual(brandAssetResource[key]);
                }
            });

            it("should NOT change the BrandAsset object fields that the brandResource object does not have", function () {
                var key,
                    keysDifference = _.difference(brandAssetModelKeys, brandAssetResourceKeys);

                brandAsset.set(brandAssetResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(brandAsset[key]).toEqual("default");
                }
            });

            it("should extend the BrandAsset object with the fields from the passed in brandResource object that the BrandAsset does not have", function () {
                var key,
                    keysDifference = _.difference(brandAssetResourceKeys, brandAssetModelKeys);

                brandAsset.set(brandAssetResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(brandAsset, key)).toBeTruthy();
                    expect(brandAsset[key]).toEqual(brandAssetResource[key]);
                }
            });

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
