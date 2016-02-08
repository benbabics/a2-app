(function () {
    "use strict";

    describe("A BrandAsset Model Service", function () {

        var _,
            brandAsset,
            HateoasResource;

        beforeEach(function () {
            module("app.shared");
            module("app.components.brand");

            inject(function (BrandAssetModel, CommonService, _HateoasResource_) {
                HateoasResource = _HateoasResource_;
                _ = CommonService._;
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

    });

})();
