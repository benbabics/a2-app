(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function WexCache(_, $localStorage, $q, LoadingIndicator, Logger) {
        var CACHE_KEY_GLOBAL = "GLOBAL",
            CACHE_KEY_PREFIX = "CACHE",
            CACHE_KEY_SEPARATOR = "_";

        var service = {
            clearPropertyValue: clearPropertyValue,
            getPropertyKey    : getPropertyKey,
            mergePropertyValue: mergePropertyValue,
            readPropertyValue : readPropertyValue,
            storePropertyValue: storePropertyValue,
            waitForProperty   : waitForProperty
        };

        return service;
        ////////////////////
        //Public functions:

        function clearPropertyValue(property, options) {
            delete $localStorage[getPropertyKey(property, _.get(options, "viewName"))];
        }

        function getPropertyKey(property, options) {
            return (CACHE_KEY_PREFIX +
            CACHE_KEY_SEPARATOR +
            (_.get(options, "viewName") || CACHE_KEY_GLOBAL) +
            CACHE_KEY_SEPARATOR +
            property).replace(/\./g, CACHE_KEY_SEPARATOR);
        }

        function mergePropertyValue(property, value, options) {
            return storePropertyValue(
                property,
                merge(readPropertyValue(property, options) || [], value, _.get(options, "mergeBy")),
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

        function waitForProperty(property, loaderCallback, options) {
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

            if (_.isNil(cachedPropertyValue)) {
                LoadingIndicator.begin();

                return updatePropertyValue()
                    .finally(LoadingIndicator.complete);
            }
            else {
                var value;

                if (_.get(options, "ValueType")) {
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

        function merge(dest, values, id) {

            if (!_.isArrayLike(dest)) {
                throw new Error("Destination cache property must be array-like.");
            }

            _.forEach(values, function (value, index) {
                var searchKey,
                    existingValue;

                if (id) {
                    searchKey = {};
                    searchKey[id] = value[id];
                }

                existingValue = _.find(dest, searchKey);

                if (existingValue) {
                    dest[index] = value;
                }
                else {
                    dest.push(value);
                }
            });

            return dest;
        }
    }

    angular
        .module("app.shared.widgets")
        .factory("WexCache", WexCache);
})();
