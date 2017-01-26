(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us
    // jshint maxparams:8

    /* @ngInject */
    function BrandUtil(_, $localStorage, $q, $window, globals, moment, FileUtil, LoggerUtil) {
        // Private members
        var LAST_BRAND_UPDATE_DATE = globals.LOCALSTORAGE.KEYS.LAST_BRAND_UPDATE_DATE;

        // Revealed Public members
        var service = {
            "cacheAssetResourceData"        : cacheAssetResourceData,
            "getAssetBySubtype"             : getAssetBySubtype,
            "getAssetResourceData"          : getAssetResourceData,
            "getAssetResourceDirectory"     : getAssetResourceDirectory,
            "getAssetResourceFile"          : getAssetResourceFile,
            "getAssetResourceFilePath"      : getAssetResourceFilePath,
            "getLastBrandUpdateDate"        : getLastBrandUpdateDate,
            "loadBundledAsset"              : loadBundledAsset,
            "removeAssetResourceFile"       : removeAssetResourceFile,
            "setLastBrandUpdateDate"        : setLastBrandUpdateDate,
            "storeAssetResourceFile"        : storeAssetResourceFile
        };

        return service;
        //////////////////////

        function cacheAssetResourceData(brandAsset, forceUpdate) {
            var checkFileExists;

            try {
                checkFileExists = forceUpdate ? $q.reject() : FileUtil.checkFileExists(getAssetResourceSubPath(brandAsset));
            }
            catch (error) {
                return $q.reject(error);
            }

            return checkFileExists.catch(function () {
                //fetch and cache the current asset resource
                return brandAsset.fetchResource()
                    .then(function (resourceData) {
                        return storeAssetResourceFile(brandAsset, resourceData);
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
            var resourceSubPath;

            try {
                resourceSubPath = getAssetResourceSubPath(brandAsset);
            }
            catch (error) {
                return $q.reject(error);
            }

            return FileUtil.checkFileExists(resourceSubPath)
                .then(function () {
                    //get the resource data from the cached file if it exists
                    return getAssetResourceFile(brandAsset, binary);
                })
                .catch(function () {
                    return $q.reject("Resource data file not found for brand asset: " + brandAsset.assetSubtypeId);
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
            var resourcePath;

            try {
                resourcePath = getAssetResourceSubPath(brandAsset);
            }
            catch (error) {
                return $q.reject(error);
            }

            return FileUtil.checkFileExists(resourcePath)
                .then(function () {
                    return FileUtil.readFile(resourcePath, binary);
                })
                .catch(function (error) {
                    return $q.reject("Failed to get brand asset resource file '" + resourcePath + "': " + LoggerUtil.getErrorMessage(error));
                });
        }

        function getAssetResourceFilePath(brandAsset) {
            var deferred = $q.defer(),
                resourcePath;

            try {
                resourcePath = getAssetResourceSubPath(brandAsset);
            }
            catch (error) {
                return $q.reject(error);
            }

            $window.resolveLocalFileSystemURL(resourcePath, (entry) => deferred.resolve(entry.toInternalURL()));

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

        function loadBundledAsset(brandAsset, bundledAssetDirectory) {
            bundledAssetDirectory = bundledAssetDirectory || getDefaultBundledBrandPath();

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
                    return storeAssetResourceFile(brandAsset, resourceData);
                })
                .catch(function (error) {
                    return $q.reject("Failed to load bundled brand asset with subtype '" + brandAsset.assetSubtypeId + "': " + LoggerUtil.getErrorMessage(error));
                });
        }

        function removeAssetResourceFile(brandAsset) {
            var resourcePath;

            try {
                resourcePath = getAssetResourceSubPath(brandAsset);
            }
            catch (error) {
                return $q.reject(error);
            }

            return FileUtil.checkFileExists(resourcePath)
                .then(function () {
                    return FileUtil.removeFile(resourcePath);
                })
                .catch(function (error) {
                    return $q.reject("Failed to remove asset resource file " + resourcePath + ": " + LoggerUtil.getErrorMessage(error));
                });
        }

        function setLastBrandUpdateDate(brandName, date) {
            date = date || moment().toDate();

            if (!_.has($localStorage, LAST_BRAND_UPDATE_DATE)) {
                $localStorage[LAST_BRAND_UPDATE_DATE] = {};
            }

            $localStorage[LAST_BRAND_UPDATE_DATE][brandName] = date;
        }

        function storeAssetResourceFile(brandAsset, resourceData) {
            var resourceDirectory,
                resourcePath;

            try {
                resourceDirectory = getAssetResourceDirectory(brandAsset);
                resourcePath = getAssetResourceSubPath(brandAsset);
            }
            catch (error) {
                return $q.reject(error);
            }

            return FileUtil.checkDirectoryExists(resourceDirectory)
                .catch(function () {
                    return FileUtil.createDirectory(resourceDirectory);
                })
                .then(function () {
                    return FileUtil.writeFile(resourcePath, resourceData, true);
                })
                .then(function () {
                    return resourceData;
                })
                .catch(function (error) {
                    if (error) {
                        return $q.reject("Failed to store brand asset resource file '" + resourcePath + "': " + LoggerUtil.getErrorMessage(error));
                    }
                });
        }
    }

    angular
        .module("app.components.util")
        .factory("BrandUtil", BrandUtil);

})();