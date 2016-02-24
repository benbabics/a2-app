(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function BrandManager(globals, BrandAssetModel, BrandsResource, CommonService, Logger, BrandAssetCollection) {

        // Private members
        var _ = CommonService._,
            brandAssets = null;

        // Revealed Public members
        var service = {
            fetchBrandAssets     : fetchBrandAssets,
            getBrandAssets       : getBrandAssets,
            getBrandAssetsByBrand: getBrandAssetsByBrand,
            removeBrandAsset     : removeBrandAsset,
            setBrandAssets       : setBrandAssets,
            storeBrandAssets     : storeBrandAssets,
            updateBrandAssets    : updateBrandAssets
        };

        return service;
        //////////////////////


        function createBrandAsset(brandAssetResource) {
            var brandAssetModel = new BrandAssetModel();
            brandAssetModel.set(brandAssetResource);

            return brandAssetModel;
        }

        function fetchBrandAssets(brandId, ifModifiedSinceDate) {

            return BrandsResource.getBrandAssets(brandId, ifModifiedSinceDate)
                .then(function (brandAssetsResponse) {
                    if (brandAssetsResponse && brandAssetsResponse.data) {
                        // map the brand assets data to model objects and update the collection
                        return updateBrandAssets(_.map(brandAssetsResponse.data, createBrandAsset));
                    }
                    // no data in the response
                    else {
                        Logger.error("No data in Response from getting the Brand Assets");
                        throw new Error("No data in Response from getting the Brand Assets");
                    }
                })
                // getting brand assets failed
                .catch(function (failureResponse) {
                    // this only gets fired if the error is not caught by any HTTP Response Error Interceptors

                    //TODO - Handle (hopefully) unlikely event that getting the GENERIC brand gets a 422 status and getting the WEX brand gets a 400 status resulting in an infinite loop

                    // A 400 status code means that an illegal brand was requested so we should use the "GENERIC" brand as we do not want to show the WEX logo inappropriately
                    if (failureResponse.status === 400 && brandId !== globals.BRAND.GENERIC) {
                        Logger.warn("There was an error getting the brand assets for brandId: " + brandId + " trying GENERIC");

                        return fetchBrandAssets(globals.BRAND.GENERIC);
                    }

                    // A 422 status code means that the brand does not have any assets so we should use the "WEX" brand
                    // All brands that should not use the "WEX" brand must be mapped to use the "GENERIC" brand in the configuration services
                    if (failureResponse.status === 422 && brandId !== globals.BRAND.WEX) {
                        Logger.warn("There was an error getting the brand assets for brandId: " + brandId + " trying WEX");

                        return fetchBrandAssets(globals.BRAND.WEX);
                    }

                    // A status of 304 means there are no updated assets, so don't throw an error for it
                    if (failureResponse.status !== 304) {
                        // There was some unknown problem
                        var error = "There was an error getting the brand assets for brandId: " + brandId +
                            " - " + CommonService.getErrorMessage(failureResponse);

                        Logger.error(error);
                        throw new Error(error);
                    }
                });
        }

        function getBrandAssets() {
            if (brandAssets === null) {
                brandAssets = BrandAssetCollection.getCollection();
            }
            return brandAssets;
        }

        function getBrandAssetsByBrand(brandId) {
            // for case-insensitive searching
            var searchRegex = new RegExp(brandId, "i"),
                results = getBrandAssets().find({"clientBrandName" :{"$regex" : searchRegex}});

            //map each result resource to a BrandAssetModel
            return _.map(results, createBrandAsset);
        }

        function removeBrandAsset(brandAsset) {
            var existingAsset = getBrandAssets().by("brandAssetId", brandAsset.brandAssetId);

            if (existingAsset) {
                getBrandAssets().remove(existingAsset);
            }
            else {
                throw new Error("Failed to remove brand asset: " + brandAsset.asset + " not found");
            }
        }

        // Caution against using this as it replaces the collection versus setting properties or extending
        // each of the models in the collections
        function setBrandAssets(brandAssetsInfo) {
            brandAssets = brandAssetsInfo;
        }

        function storeBrandAssets(brandId, brandAssetsForBrand) {
            if (_.size(brandAssetsForBrand)) {
                _.forEach(brandAssetsForBrand, function (fetchedAsset) {
                    storeBrandAsset(fetchedAsset);
                });
            }
            else {
                storeBrandAsset(brandAssetsForBrand);
            }

            return getBrandAssetsByBrand(brandId);
        }

        function storeBrandAsset(brandAsset) {
            try {
                getBrandAssets().insert(brandAsset);
            }
            catch (err) {
                // TODO: Figure out what to do, as the brandAsset (per brandAssetId) is already in the document
            }
        }

        function updateBrandAssets(brandAssetsForBrand) {
            if (_.size(brandAssetsForBrand)) {
                _.forEach(brandAssetsForBrand, function (brandAsset) {
                    updateBrandAsset(brandAsset);
                });
            }
            else {
                updateBrandAsset(brandAssetsForBrand);
            }

            return brandAssetsForBrand;
        }

        function updateBrandAsset(brandAsset) {
            var existingAsset = getBrandAssets().by("brandAssetId", brandAsset.brandAssetId);

            if (existingAsset) {
                angular.extend(existingAsset, brandAsset);
                getBrandAssets().update(existingAsset);
            }
            else {
                getBrandAssets().insert(brandAsset);
            }
        }
    }

    angular
        .module("app.components.brand")
        .factory("BrandManager", BrandManager);
})();
