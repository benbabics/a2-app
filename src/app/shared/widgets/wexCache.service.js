(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function WexCache(_, $localStorage, $q, moment, Logger, UserManager) {
        var CACHE_KEY_DATE = "DATE",
            CACHE_KEY_GLOBAL = "GLOBAL",
            CACHE_KEY_PREFIX = "CACHE",
            CACHE_KEY_SEPARATOR = ".",
            CACHE_KEY_SHARED = "SHARED",
            CACHE_KEY_TTL = "$TTL",
            DEFAULT_TTL = 0, //no ttl
            TTL_UNITS = "m";

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
            var clearLocalStorageValue = function (keyOptions) {
                _.set($localStorage, getPropertyKey(property, _.assign({}, options, keyOptions)), undefined);
            };

            clearLocalStorageValue();
            clearLocalStorageValue({cacheDateKey: true});
            clearLocalStorageValue({ttlKey: true});
        }

        function getPropertyKey(property, options) {
            var user = UserManager.getUser(),
                keyParts = [CACHE_KEY_PREFIX],
                getViewName = function () {
                    return (_.get(options, "viewName") || CACHE_KEY_GLOBAL).replace(/\./g, "_");
                };

            if (_.get(options, "ttlKey") || _.get(options, "cacheDateKey")) {
                keyParts.push(CACHE_KEY_TTL);

                if (options.cacheDateKey) {
                    keyParts.push(CACHE_KEY_DATE);
                }
            }

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
            var keyOptions = options;

            //get the ttl/date of the value instead of the value if true
            if (_.get(options, "ttl") === true || _.get(options, "cacheDate") === true) {
                if (options.cacheDate === true) {
                    keyOptions = _.assign({}, keyOptions, {cacheDateKey: true});
                }
                else {
                    keyOptions = _.assign({}, keyOptions, {ttlKey: true});
                }
            }
            else {
                //clear expired properties
                removeStaleProperty(property);
            }

            return _.get($localStorage, getPropertyKey(property, keyOptions), _.get(options, "defaultValue"));
        }

        function storePropertyValue(property, value, options) {
            var setLocalStorageValue = function (value, keyOptions) {
                _.set($localStorage, getPropertyKey(property, _.assign({}, options, keyOptions)), value);
            };

            setLocalStorageValue(value);
            setLocalStorageValue(new Date(), {cacheDateKey: true});
            setLocalStorageValue(_.isNumber(_.get(options, "ttl")) ? options.ttl : DEFAULT_TTL, {ttlKey: true});

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

        function propertyIsStale(property) {
            //get the last update date and the ttl
            var cacheDate = readPropertyValue(property, {cacheDate: true}),
                ttl = readPropertyValue(property, {
                    ttl: true,
                    defaultValue: 0
                });

            //property is stale if there's a ttl > 0 and it has elapsed since the last update date
            return _.every([
                ttl > 0,
                !_.isNil(cacheDate),
                moment(cacheDate).add(ttl, TTL_UNITS).isBefore(new Date())
            ]);
        }

        function removeStaleProperty(property) {
            if (propertyIsStale(property)) {
                Logger.info("Stale cached property removed: " + property);

                clearPropertyValue(property);
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .factory("WexCache", WexCache);
})();
