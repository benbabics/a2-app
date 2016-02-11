(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:5

    /* @ngInject */
    function BrandManager(globals, BrandAssetModel, BrandsResource, CommonService, Logger) {

        // Private members
        var _ = CommonService._,
            brandAssets = {};

        // Revealed Public members
        var service = {
            clearCachedValues    : clearCachedValues,
            fetchBrandAssets     : fetchBrandAssets,
            getBrandAssets       : getBrandAssets,
            getBrandAssetsByBrand: getBrandAssetsByBrand,
            setBrandAssets       : setBrandAssets,
            storeBrandAssets     : storeBrandAssets
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            clearCachedValues();
        }

        function clearCachedValues() {
            brandAssets = {};
        }

        function createBrandAsset(brandAssetResource) {
            var brandAssetModel = new BrandAssetModel();
            brandAssetModel.set(brandAssetResource);

            return brandAssetModel;
        }

        function fetchBrandAssets(brandId) {

            return BrandsResource.getBrandAssets(brandId)
                .then(function (brandAssetsResponse) {
                    if (brandAssetsResponse && brandAssetsResponse.data) {
                        // map the brand assets data to model objects
                        brandAssets[brandId] = _.map(brandAssetsResponse.data, createBrandAsset);

                        return brandAssets[brandId];
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

                        return fetchBrandAssets(globals.BRAND.GENERIC)
                            .then(function (fetchedBrandAssets) {
                                //cache the Generic brand for this brand id
                                brandAssets[brandId] = fetchedBrandAssets;

                                return fetchedBrandAssets;
                            });
                    }

                    // A 422 status code means that the brand does not have any assets so we should use the "WEX" brand
                    // All brands that should not use the "WEX" brand must be mapped to use the "GENERIC" brand in the configuration services
                    if (failureResponse.status === 422 && brandId !== globals.BRAND.WEX) {
                        Logger.warn("There was an error getting the brand assets for brandId: " + brandId + " trying WEX");

                        return fetchBrandAssets(globals.BRAND.WEX)
                            .then(function (fetchedBrandAssets) {
                                //cache the WEX brand for this brand id
                                brandAssets[brandId] = fetchedBrandAssets;

                                return fetchedBrandAssets;
                            });
                    }

                    // There was some unknown problem
                    var error = "There was an error getting the brand assets for brandId: " + brandId +
                        " - " + CommonService.getErrorMessage(failureResponse);

                    Logger.error(error);
                    throw new Error(error);
                });
        }

        function getBrandAssets() {
            return brandAssets;
        }

        function getBrandAssetsByBrand(brandId) {
            if (_.has(brandAssets, brandId)) {
                return brandAssets[brandId];
            }
            else {
                return null;
            }
        }

        // Caution against using this as it replaces the collection versus setting properties or extending
        // each of the models in the collections
        function setBrandAssets(brandAssetsInfo) {
            brandAssets = brandAssetsInfo;
        }

        function storeBrandAssets(brandId, brandAssetsForBrand) {
            brandAssets[brandId] = brandAssetsForBrand;
        }

    }

    angular
        .module("app.components.brand")
        .factory("BrandManager", BrandManager);
})();
