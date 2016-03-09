(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:10

    /* @ngInject */
    function BrandManager($q, globals, BrandAssetModel, BrandAssetCollection, BrandUtil, BrandsResource,
                          CommonService, Logger, PromiseUtil, UserManager) {

        // Private members
        var _ = CommonService._,
            ASSET_SUBTYPES = globals.BRAND.ASSET_SUBTYPES,
            brandAssets = null;

        // Revealed Public members
        var service = {
            fetchBrandAssets             : fetchBrandAssets,
            getBrandAssets               : getBrandAssets,
            getBrandAssetsByBrand        : getBrandAssetsByBrand,
            getGenericBrandAssetBySubtype: getGenericBrandAssetBySubtype,
            getGenericBrandAssets        : getGenericBrandAssets,
            getGenericAnalyticsTrackingId: getGenericAnalyticsTrackingId,
            getUserBrandAssetBySubtype   : getUserBrandAssetBySubtype,
            getUserBrandAssets           : getUserBrandAssets,
            getWexBrandAssetBySubtype    : getWexBrandAssetBySubtype,
            getWexBrandAssets            : getWexBrandAssets,
            getWexAnalyticsTrackingId    : getWexAnalyticsTrackingId,
            loadBundledBrand             : loadBundledBrand,
            removeBrandAsset             : removeBrandAsset,
            removeExpiredBrandAssets     : removeExpiredBrandAssets,
            setBrandAssets               : setBrandAssets,
            storeBrandAssets             : storeBrandAssets,
            updateBrandCache             : updateBrandCache
        };

        return service;
        //////////////////////

        function cacheBrandAssetResource(brandAsset, forceUpdate) {
            return BrandUtil.cacheAssetResourceData(brandAsset, forceUpdate)
                .catch(function (error) {
                    var genericEquivalent = getGenericBrandAssetBySubtype(brandAsset.assetSubtypeId),
                        promise;

                    //TODO - check for 400/422/500 responses and correctly handle each status

                    //caching the resource failed, so try to cache a generic equivalent instead
                    if (genericEquivalent) {
                        promise = BrandUtil.cacheAssetResourceData(genericEquivalent, true);
                    }

                    //pass the rejection up the chain since caching failed
                    return PromiseUtil.rejectAfter(promise, error);
                });
        }

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
                        return storeBrandAssets(_.map(brandAssetsResponse.data, createBrandAsset));
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

            if (results) {
                //map each result resource to a BrandAssetModel
                return _.map(results, createBrandAsset);
            }

            return null;
        }

        function getGenericBrandAssetBySubtype(assetSubtypeId) {
            return BrandUtil.getAssetBySubtype(getGenericBrandAssets(), assetSubtypeId);
        }

        function getGenericBrandAssets() {
            return getBrandAssetsByBrand(globals.BRAND.GENERIC);
        }

        function getGenericAnalyticsTrackingId() {
            var trackingId = BrandUtil.getAssetBySubtype(globals.BRANDS.GENERIC, ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);

            if (trackingId) {
                return trackingId.assetValue;
            }
            else {
                return null;
            }
        }

        function getUserBrandAssetBySubtype(assetSubtypeId) {
            return BrandUtil.getAssetBySubtype(getUserBrandAssets(), assetSubtypeId) || getGenericBrandAssetBySubtype(assetSubtypeId);
        }

        function getUserBrandAssets() {
            var user = UserManager.getUser();

            if (user) {
                return getBrandAssetsByBrand(user.brand);
            }
            else {
                throw new Error("User must be logged in to get user brand assets");
            }
        }

        function getWexBrandAssetBySubtype(assetSubtypeId) {
            return BrandUtil.getAssetBySubtype(getWexBrandAssets(), assetSubtypeId);
        }

        function getWexBrandAssets() {
            return getBrandAssetsByBrand(globals.BRAND.WEX);
        }

        function getWexAnalyticsTrackingId() {
            var trackingId = BrandUtil.getAssetBySubtype(globals.BRANDS.WEX, ASSET_SUBTYPES.GOOGLE_ANALYTICS_TRACKING_ID);

            if (trackingId) {
                return trackingId.assetValue;
            }
            else {
                return null;
            }
        }

        function loadBundledBrand(brandName, brandResource) {
            var brandAssets = [],
                promises = [];

            _.forEach(brandResource, function (brandAssetResource) {
                var brandAsset = new BrandAssetModel();

                brandAsset.set(brandAssetResource);

                //if the current asset has a resource then we need to load it
                if (brandAsset.hasResource()) {
                    promises.push(BrandUtil.loadBundledAsset(brandAsset));
                }

                brandAssets.push(brandAsset);
            });

            //cache the asset list
            storeBrandAssets(brandAssets);

            return $q.all(promises)
                .catch(function (error) {
                    throw new Error("Failed to load bundled brand '" + brandName + "': " + CommonService.getErrorMessage(error));
                });
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

        function removeExpiredBrandAssets(brandName) {
            return $q.all(_.map(getBrandAssetsByBrand(brandName), function (brandAsset) {

                if (brandAsset.isExpired()) {
                    return BrandUtil.removeAssetResourceFile(brandAsset)
                        .then(function () {
                            removeBrandAsset(brandAsset);
                        });
                }

                return $q.resolve();
            }));
        }

        // Caution against using this as it replaces the collection versus setting properties or extending
        // each of the models in the collections
        function setBrandAssets(brandAssetsInfo) {
            brandAssets = brandAssetsInfo;
        }

        function storeBrandAssets(brandAssetsForBrand) {
            _.forEach(brandAssetsForBrand, function (brandAsset) {
                updateBrandAsset(brandAsset);
            });

            return brandAssetsForBrand;
        }

        function updateBrandAsset(brandAsset) {
            var existingAsset = getBrandAssets().by("brandAssetId", brandAsset.brandAssetId);

            if (existingAsset && _.has(existingAsset, "brandAssetId")) {
                angular.extend(existingAsset, brandAsset);
                getBrandAssets().update(existingAsset);
            }
            else {
                getBrandAssets().insert(brandAsset);
            }
        }

        function updateBrandAssetResourcesCache(brandAssets, forceUpdate) {
            return PromiseUtil.allFinished(_.map(brandAssets, function (brandAsset) {

                if (brandAsset.hasResource()) {
                    return cacheBrandAssetResource(brandAsset, forceUpdate);
                }
                else {
                    return $q.resolve();
                }
            }));
        }

        function updateBrandCache(brandName) {
            var lastUpdateDate = BrandUtil.getLastBrandUpdateDate(brandName);

            removeExpiredBrandAssets(brandName);

            return fetchBrandAssets(brandName, lastUpdateDate)
                .then(function (brandAssets) {
                    //force updates if we're updating existing resources
                    return updateBrandAssetResourcesCache(brandAssets, !!lastUpdateDate);
                })
                .then(function () {
                    //update the last brand update date on successful cache update
                    BrandUtil.setLastBrandUpdateDate(brandName);
                })
                .catch(function (error) {
                    throw new Error("Failed to update brand cache: " + CommonService.getErrorMessage(error));
                });
        }
    }

    angular
        .module("app.components.brand")
        .factory("BrandManager", BrandManager);
})();
