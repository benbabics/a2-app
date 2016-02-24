(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:10

    /* @ngInject */
    function BrandUtil($localStorage, $q, $window, globals, moment,
                       BrandAssetModel, BrandManager, CommonService, FileUtil, Logger) {
        // Private members
        var LAST_BRAND_UPDATE_DATE = globals.LOCALSTORAGE.KEYS.LAST_BRAND_UPDATE_DATE,
            _ = CommonService._;

        // Revealed Public members
        var service = {
            "fetchAssetResourceData"           : fetchAssetResourceData,
            "getAssetBySubtype"                : getAssetBySubtype,
            "getAssetResourceData"             : getAssetResourceData,
            "getAssetResourceDirectory"        : getAssetResourceDirectory,
            "getAssetResourceFile"             : getAssetResourceFile,
            "getAssetResourceFilePath"         : getAssetResourceFilePath,
            "getGenericBrandAssets"            : getGenericBrandAssets,
            "getLastBrandUpdateDate"           : getLastBrandUpdateDate,
            "getWexBrandAssets"                : getWexBrandAssets,
            "loadBundledBrand"                 : loadBundledBrand,
            "removeAssetResourceFile"          : removeAssetResourceFile,
            "removeExpiredAssets"              : removeExpiredAssets,
            "setLastBrandUpdateDate"           : setLastBrandUpdateDate,
            "storeAssetResourceFile"           : storeAssetResourceFile,
            "updateBrandCache"                 : updateBrandCache
        };

        return service;
        //////////////////////

        function cacheAssetResourceData(brandAsset, forceUpdate) {
            var checkFileExists = forceUpdate ? $q.reject() : FileUtil.checkFileExists(getAssetResourceSubPath(brandAsset));

            return checkFileExists.catch(function () {
                //fetch and cache the current asset resource
                return fetchAssetResourceData(brandAsset);
            });
        }

        function fetchAssetResourceData(brandAsset) {
            return brandAsset.fetchResource()
                .then(function (resourceData) {
                    return storeAssetResourceFile(brandAsset, resourceData)
                        .then(function () {
                            return resourceData;
                        });
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

        function getAssetResourceData(brandAsset, binary) {
            return FileUtil.checkFileExists(getAssetResourceSubPath(brandAsset))
                .then(function () {
                    //get the resource data from the cached file if it exists
                    return getAssetResourceFile(brandAsset, binary);
                })
                .catch(function () {
                    //resource data hasn't been cached yet so we need to go and fetch the resource data
                    return fetchAssetResourceData(brandAsset);
                })
                .catch(function () {
                    //TODO - check for 400/422/500 responses and correctly handle each status

                    //fetching the resource failed, so try to get a generic equivalent instead
                    return getGenericAssetResourceData(brandAsset, binary);
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

        function getGenericAssetResourceData(brandAsset, binary) {
            var genericBrandAssets = getGenericBrandAssets(),
                genericAsset;

            if (genericBrandAssets) {
                //find an equivalent generic brand asset
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

        function getLastBrandUpdateDate(brandName) {
            var updateDates;

            if (_.has($localStorage, LAST_BRAND_UPDATE_DATE)) {
                updateDates = $localStorage[LAST_BRAND_UPDATE_DATE];

                if (_.has(updateDates, brandName)) {
                    return updateDates[brandName];
                }
            }

            return null;
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

        function loadBundledBrand(brandName, brandResource) {
            var brandAssets = [],
                promises = [];

            _.forEach(brandResource, function (brandAssetResource) {
                var brandAsset = new BrandAssetModel(),
                    bundledAssetDirectory = getDefaultBundledBrandPath();

                brandAsset.set(brandAssetResource);

                //if the current asset has a resource then we need to load it
                if (brandAsset.hasResource()) {
                    promises.push(loadBundledAsset(brandAsset, bundledAssetDirectory));
                }

                brandAssets.push(brandAsset);
            });

            //cache the asset list
            BrandManager.storeBrandAssets(brandName, brandAssets);

            return $q.all(promises)
                .catch(function (error) {
                    var logError = "Failed to load bundled brand '" + brandName + "': " + CommonService.getErrorMessage(error);

                    Logger.error(logError);
                    return $q.reject(logError);
                });
        }

        function removeAssetResourceFile(brandAsset) {
            var resourcePath = getAssetResourceSubPath(brandAsset);

            return FileUtil.checkFileExists(resourcePath)
                .then(function () {
                    return FileUtil.removeFile(resourcePath);
                })
                .catch(function (error) {
                    throw new Error("Failed to remove asset resource file " + resourcePath + ": " + CommonService.getErrorMessage(error));
                });
        }

        function removeExpiredAssets(brandName) {
            return $q.all(_.map(BrandManager.getBrandAssetsByBrand(brandName), function (brandAsset) {

                if (brandAsset.isExpired()) {
                    return removeAssetResourceFile(brandAsset)
                        .then(function () {
                            BrandManager.removeBrandAsset(brandAsset);
                        });
                }

                return $q.resolve();
            }));
        }

        function setLastBrandUpdateDate(brandName, date) {
            date = date || moment().toDate();

            if (!_.has($localStorage, LAST_BRAND_UPDATE_DATE)) {
                $localStorage[LAST_BRAND_UPDATE_DATE] = {};
            }

            $localStorage[LAST_BRAND_UPDATE_DATE][brandName] = date;
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

        function updateBrandAssetResourcesCache(brandAssets, forceUpdate) {
            var promises = [];

            forceUpdate = _.isUndefined(forceUpdate) ? false : forceUpdate;

            _.forEach(brandAssets, function (brandAsset) {

                //cache any missing asset resources
                if (brandAsset.hasResource()) {
                    promises.push(cacheAssetResourceData(brandAsset, forceUpdate));
                }
            });

            return $q.all(promises);
        }

        function updateBrandCache(brandName) {
            var lastUpdateDate = getLastBrandUpdateDate(brandName),
                fetchBrandAssets = function () {
                    if (lastUpdateDate) {
                        return BrandManager.fetchBrandAssets(brandName, lastUpdateDate);
                    }
                    else {
                        return BrandManager.fetchBrandAssets(brandName);
                    }
                },
                updateBrandAssetResources = function (brandAssets) {
                    //force updates if we're updating existing resources
                    return updateBrandAssetResourcesCache(brandAssets, !!lastUpdateDate);
                };

            return fetchBrandAssets()
                .then(updateBrandAssetResources)
                .then(function () {
                    //update the last brand update date
                    setLastBrandUpdateDate(brandName);
                })
                .catch(function (error) {
                    throw new Error("Failed to update brand cache: " + CommonService.getErrorMessage(error));
                });
        }
    }

    angular
        .module("app.components.util")
        .factory("BrandUtil", BrandUtil);

})();