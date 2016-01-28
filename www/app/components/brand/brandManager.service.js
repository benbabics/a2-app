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
            setBrandAssets       : setBrandAssets
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            clearCachedValues();
        }

        function clearCachedValues() {
            brandAssets = [];
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
                        brandAssets = _.map(brandAssetsResponse.data, createBrandAsset);

                        return brandAssets;
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
                    if (failureResponse.status === 400 && brandId !== globals.BRAND.GENERIC) {
                        Logger.warn("There was an error getting the brand assets for brandId: " + brandId + " trying GENERIC");

                        return fetchBrandAssets(globals.BRAND.GENERIC);
                    }
                    if (failureResponse.status === 422 && brandId !== globals.BRAND.WEX) {
                        Logger.warn("There was an error getting the brand assets for brandId: " + brandId + " trying WEX");

                        return fetchBrandAssets(globals.BRAND.WEX);
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

        // Caution against using this as it replaces the collection versus setting properties or extending
        // each of the models in the collections
        function setBrandAssets(brandAssetsInfo) {
            brandAssets = brandAssetsInfo;
        }

    }

    angular
        .module("app.components.brand")
        .factory("BrandManager", BrandManager);
})();
