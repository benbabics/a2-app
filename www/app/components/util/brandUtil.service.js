(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:7

    /* @ngInject */
    function BrandUtil($q, $window, globals, BrandManager, CommonService, FileUtil, UserManager) {
        // Private members
        var _ = CommonService._;

        // Revealed Public members
        var service = {
            "fetchAssetResourceData"           : fetchAssetResourceData,
            "getAssetResourceData"             : getAssetResourceData,
            "getAssetResourceDataBySubtype"    : getAssetResourceDataBySubtype,
            "getAssetResourceDirectory"        : getAssetResourceDirectory,
            "getAssetResourceFile"             : getAssetResourceFile,
            "getAssetResourceFileBySubtype"    : getAssetResourceFileBySubtype,
            "getAssetResourceFilePath"         : getAssetResourceFilePath,
            "getAssetResourceFilePathBySubtype": getAssetResourceFilePathBySubtype,
            "storeAssetResourceFile"           : storeAssetResourceFile
        };

        return service;
        //////////////////////

        function fetchAssetResourceData (brandAsset, binary) {
            return brandAsset.fetchResource()
                .catch(function () {
                    return fetchGenericAssetResource(brandAsset, binary);
                })
                .then(function (resourceData) {
                    return storeAssetResourceFile(brandAsset, resourceData)
                        .then(function () {
                            return resourceData;
                        });
                });
        }

        function fetchGenericAssetResource(brandAsset, binary) {
            return BrandManager.fetchBrandAssets(globals.BRAND.GENERIC)
                .then(function (genericBrandAssets) {
                    var genericAsset = _.find(genericBrandAssets, {assetSubtypeId: brandAsset.assetSubtypeId});

                    if (genericAsset) {
                        return getAssetResourceData(genericAsset, binary);
                    }
                    else {
                        throw new Error("Failed to find generic brand asset resource for asset subtype '" + brandAsset.assetSubtypeId + "'");
                    }
                });
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

        function getAssetResourceDataBySubtype (assetSubtypeId, binary) {
            var user = UserManager.getUser(),
                brandAsset;

            if (user) {
                brandAsset = user.getBrandAssetBySubtype(assetSubtypeId);

                if (brandAsset) {
                    return getAssetResourceData(brandAsset, binary);
                }
            }

            throw new Error("Failed to get brand asset resource data from asset subtype: '" + assetSubtypeId + "'");
        }

        function getAssetResourceDirectory() {
            var user = UserManager.getUser();

            if (user) {
                return user.brand + "/";
            }
            else {
                throw new Error("Failed to get brand asset resource directory. User must be logged in.");
            }
        }

        function getAssetResourceSubPath(brandAsset) {
            return getAssetResourceDirectory() + brandAsset.assetValue;
        }

        function getAssetResourceFile(brandAsset, binary) {
            var resourcePath = getAssetResourceSubPath(brandAsset);

            return FileUtil.checkFileExists(resourcePath)
                .then(function () {
                    return FileUtil.readFile(resourcePath, binary);
                })
                .catch(function (error) {
                    throw new Error("Failed to get brand asset resource file '" + resourcePath + "': " + error.message);
                });
        }

        function getAssetResourceFileBySubtype(assetSubtypeId, binary) {
            var user = UserManager.getUser(),
                brandAsset;

            if (user) {
                brandAsset = user.getBrandAssetBySubtype(assetSubtypeId);

                if (brandAsset) {
                    return getAssetResourceFile(brandAsset, binary);
                }
            }

            throw new Error("Failed to get brand asset resource file path from asset subtype: '" + assetSubtypeId + "'");
        }

        function getAssetResourceFilePath(brandAsset) {
            var deferred = $q.defer();

            $window.resolveLocalFileSystemURL(getAssetResourceSubPath(brandAsset), function (entry) {
                deferred.resolve(entry.toInternalURL());
            });

            return deferred.promise;
        }

        function getAssetResourceFilePathBySubtype(assetSubtypeId) {
            var user = UserManager.getUser(),
                brandAsset;

            if (user) {
                brandAsset = user.getBrandAssetBySubtype(assetSubtypeId);

                if (brandAsset) {
                    return getAssetResourceFilePath(brandAsset);
                }
            }

            throw new Error("Failed to get brand asset resource file path from asset subtype: '" + assetSubtypeId + "'");
        }

        function storeAssetResourceFile(brandAsset, resourceData) {
            var resourceDirectory = getAssetResourceDirectory(),
                resourcePath = getAssetResourceSubPath(brandAsset);

            return FileUtil.checkDirectoryExists(resourceDirectory)
                .catch(function () {
                    return FileUtil.createDirectory(resourceDirectory);
                })
                .then(function () {
                    return FileUtil.writeFile(resourcePath, resourceData, true);
                })
                .catch(function (error) {
                    throw new Error("Failed to store brand asset resource file '" + resourcePath + "': " + error.message);
                });
        }
    }

    angular
        .module("app.components.util")
        .factory("BrandUtil", BrandUtil);

})();