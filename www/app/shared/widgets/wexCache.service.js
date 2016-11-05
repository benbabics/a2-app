(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function WexCache(_, $localStorage, $q, Logger, UserManager) {
        var CACHE_KEY_GLOBAL = "GLOBAL",
            CACHE_KEY_PREFIX = "CACHE",
            CACHE_KEY_SEPARATOR = ".",
            CACHE_KEY_SHARED = "SHARED";

        var service = {
            clearPropertyValue: clearPropertyValue,
            getPropertyKey    : getPropertyKey,
            mergePropertyValue: mergePropertyValue,
            readPropertyValue : readPropertyValue,
            storePropertyValue: storePropertyValue,
            fetchPropertyValue: fetchPropertyValue
        };

        return service;
        ////////////////////
        //Public functions:

        function clearPropertyValue(property, options) {
            _.set($localStorage, getPropertyKey(property, options), undefined);
        }

        function getPropertyKey(property, options) {
            var user = UserManager.getUser(),
                keyParts = [CACHE_KEY_PREFIX],
                getViewName = function () {
                    return (_.get(options, "viewName") || CACHE_KEY_GLOBAL).replace(/\./g, "_");
                };

            keyParts = keyParts.concat([
                _.get(user, "username") || CACHE_KEY_SHARED,
                getViewName(),
                property
            ]);

            return keyParts.join(CACHE_KEY_SEPARATOR);
        }

        function mergePropertyValue(property, value, options) {
            return storePropertyValue(
                property,
                merge(readPropertyValue(property, options), value, _.get(options, "mergeBy")),
                options
            );
        }

        function readPropertyValue(property, options) {
            return _.get($localStorage, getPropertyKey(property, options), _.get(options, "defaultValue"));
        }

        function storePropertyValue(property, value, options) {
            _.set($localStorage, getPropertyKey(property, options), value);
            return value;
        }

        function fetchPropertyValue(property, loaderCallback, options) {
            var cachedPropertyValue = readPropertyValue(property, options),
                updatePropertyValue = function () {
                    return loaderCallback()
                        .then(_.partial(storePropertyValue, property, _, options))
                        .catch(function (callbackError) {
                            var error = "Failed to load cachable property '" + property + "'. ";

                            Logger.error(error + callbackError);
                            return $q.reject(callbackError);
                        });
                };

            if (_.isNil(cachedPropertyValue) || _.get(options, "forceUpdate")) {
                return updatePropertyValue();
            }
            else {
                var value;

                if (_.has(options, "ValueType")) {
                    value = new options.ValueType();
                    value.set(cachedPropertyValue);
                }
                else {
                    value = cachedPropertyValue;
                }

                return $q.resolve(value)
                    .finally(function () {
                        //update the cached value in the background
                        updatePropertyValue();
                    });
            }
        }
        /////////////////////
        //Private functions:

        function merge(dest, values, uniqueId) {

            if (_.isNil(dest)) {
                return values;
            }

            if (_.isArrayLike(dest)) {
                _.forEach(values, function (value, index) {
                    var searchKey,
                        existingValue;

                    if (uniqueId) {
                        searchKey = {};
                        searchKey[uniqueId] = value[uniqueId];
                    }

                    existingValue = _.find(dest, searchKey);

                    if (existingValue) {
                        dest[index] = value;
                    }
                    else {
                        dest.push(value);
                    }
                });
            }
            else if (_.isObjectLike(dest)) {
                dest = _.assign(dest, values);
            }
            else {
                throw new Error("Can't merge cache value: " + values + ". Unsupported type.");
            }

            return dest;
        }
    }

    angular
        .module("app.shared.widgets")
        .factory("WexCache", WexCache);
})();
