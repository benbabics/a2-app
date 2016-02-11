(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:8

    /* @ngInject */
    function BrandUtil($q, $window, globals, BrandAssetModel, BrandManager, CommonService, FileUtil, Logger) {
        // Private members
        var _ = CommonService._;

        // Revealed Public members
        var service = {
            "fetchAssetResourceData"           : fetchAssetResourceData,
            "getAssetBySubtype"                : getAssetBySubtype,
            "getAssetResourceData"             : getAssetResourceData,
            "getAssetResourceDirectory"        : getAssetResourceDirectory,
            "getAssetResourceFile"             : getAssetResourceFile,
            "getAssetResourceFilePath"         : getAssetResourceFilePath,
            "getGenericBrandAssets"            : getGenericBrandAssets,
            "getWexBrandAssets"                : getWexBrandAssets,
            "loadBundledBrand"                 : loadBundledBrand,
            "storeAssetResourceFile"           : storeAssetResourceFile
        };

        return service;
        //////////////////////

        function fetchAssetResourceData (brandAsset, binary) {
            return brandAsset.fetchResource()
                .then(function (resourceData) {
                    return storeAssetResourceFile(brandAsset, resourceData)
                        .then(function () {
                            return resourceData;
                        });
                })
                .catch(function () {
                    return getGenericAssetResource(brandAsset, binary);
                });
        }

        function getAssetBySubtype(brandAssets, assetSubtypeId) {
            if (brandAssets) {
                return _.find(brandAssets, {assetSubtypeId: assetSubtypeId}) || null;
            }
            else {
                return null;
            }
        }

        function getAssetResourceData (brandAsset, binary) {
            return FileUtil.checkFileExists(getAssetResourceSubPath(brandAsset))
                .then(function () {
                    return getAssetResourceFile(brandAsset, binary);
                })
                .catch(function () {
                    return fetchAssetResourceData(brandAsset, binary);
                });
        }

        function getAssetResourceDirectory(brandAsset) {
            if (brandAsset) {
                return brandAsset.clientBrandName + "/";
            }
            else {
                throw new Error("Failed to get brand asset resource directory.");
            }
        }

        function getAssetResourceSubPath(brandAsset) {
            if (brandAsset) {
                return getAssetResourceDirectory(brandAsset) + brandAsset.assetValue;
            }
            else {
                throw new Error("Failed to get brand asset resource sub-path.");
            }
        }

        function getAssetResourceFile(brandAsset, binary) {
            var resourcePath = getAssetResourceSubPath(brandAsset);

            return FileUtil.checkFileExists(resourcePath)
                .then(function () {
                    return FileUtil.readFile(resourcePath, binary);
                })
                .catch(function (error) {
                    throw new Error("Failed to get brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error));
                });
        }

        function getAssetResourceFilePath(brandAsset) {
            var deferred = $q.defer();

            $window.resolveLocalFileSystemURL(getAssetResourceSubPath(brandAsset), function (entry) {
                deferred.resolve(entry.toInternalURL());
            });

            return deferred.promise;
        }

        function getDefaultBundledBrandPath() {
            if (_.has(window, "cordova.file.applicationDirectory")) {
                return cordova.file.applicationDirectory + "www/";
            }
            else {
                return "cdvfile:///www/";
            }
        }

        function getGenericAssetResource(brandAsset, binary) {
            var genericBrandAssets = getGenericBrandAssets(),
                genericAsset;

            if (genericBrandAssets) {
                genericAsset = getAssetBySubtype(genericBrandAssets, brandAsset.assetSubtypeId);

                if (genericAsset && genericAsset !== brandAsset) {
                    return getAssetResourceData(genericAsset, binary);
                }
            }

            return $q.reject("Failed to find generic equivalent for brand asset: " + brandAsset.assetSubtypeId);
        }

        function getGenericBrandAssets() {
            return BrandManager.getBrandAssetsByBrand(globals.BRAND.GENERIC);
        }

        function getWexBrandAssets() {
            return BrandManager.getBrandAssetsByBrand(globals.BRAND.WEX);
        }

        function loadBundledAsset(brandAsset, bundledAssetDirectory) {
            //first check to see if the bundled file resource can be opened on the file system
            return FileUtil.checkFileExists(brandAsset.getResourceLink(), bundledAssetDirectory)
                .then(function () {
                    //the bundled resource exists so open it and read it
                    return FileUtil.readFile(brandAsset.getResourceLink(), true, bundledAssetDirectory);
                })
                .catch(function () {
                    //something happened while trying to read the resource so we need to fetch it instead
                    return brandAsset.fetchResource();
                })
                .then(function (resourceData) {
                    //cache the bundled resource
                    return storeAssetResourceFile(brandAsset, resourceData)
                        .then(function () {
                            return resourceData;
                        });
                })
                .catch(function (error) {
                    var logError = "Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "': " + CommonService.getErrorMessage(error);

                    Logger.error(logError);
                    return $q.reject(logError);
                });
        }

        function loadBundledBrand(brandId, brandResource) {
            var brandAssets = [],
                promises = [];

            _.forEach(brandResource, function (brandAssetResource) {
                var brandAsset = new BrandAssetModel(),
                    bundledAssetDirectory = getDefaultBundledBrandPath();

                brandAsset.set(brandAssetResource);

                //if the current asset is a file asset we need to load it
                if (brandAsset.assetTypeId === globals.BRAND.ASSET_TYPES.FILE) {
                    promises.push(loadBundledAsset(brandAsset, bundledAssetDirectory));
                }

                brandAssets.push(brandAsset);
            });

            //cache the asset list
            BrandManager.storeBrandAssets(brandId, brandAssets);

            return $q.all(promises)
                .catch(function (error) {
                    var logError = "Failed to load bundled brand '" + brandId + "': " + CommonService.getErrorMessage(error);

                    Logger.error(logError);
                    return $q.reject(logError);
                });
        }

        function storeAssetResourceFile(brandAsset, resourceData) {
            var resourceDirectory = getAssetResourceDirectory(brandAsset),
                resourcePath = getAssetResourceSubPath(brandAsset);

            return FileUtil.checkDirectoryExists(resourceDirectory)
                .catch(function () {
                    return FileUtil.createDirectory(resourceDirectory);
                })
                .then(function () {
                    return FileUtil.writeFile(resourcePath, resourceData, true);
                })
                .catch(function (error) {
                    if (error) {
                        throw new Error("Failed to store brand asset resource file '" + resourcePath + "': " + CommonService.getErrorMessage(error));
                    }
                });
        }
    }

    angular
        .module("app.components.util")
        .factory("BrandUtil", BrandUtil);

})();