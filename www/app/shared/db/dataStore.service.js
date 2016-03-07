(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function DataStore(globals, CommonService, Loki) {
        var _ = CommonService._,
            collections = [],
            dataStore = globals.DATASTORE,
            db,
            service = {
                addCollection       : addCollection,
                getCollection       : getCollection,
                setStoredCollections: setStoredCollections
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            db = new Loki(dataStore.NAME, {
                autoload         : true,
                autoloadCallback : loadHandler,
                autosave         : true,
                autosaveInterval : 10000
            });
        }

        function addCollection(collection) {
            if (collection && collection.NAME) {
                return db.addCollection(collection.NAME, configurationOptions(collection));
            }
            return null;
        }

        function configurationOptions(collection) {
            var options = {};
            if (collection && collection.OPTIONS) {
                _.forEach(collection.OPTIONS, function (value, key) {

                    if (key === "indices") {
                        options.indices = value;
                    }
                    if (key === "unique") {
                        options.unique = value;
                    }
                    if (key === "asyncListeners") {
                        options.asyncListeners = value;
                    }
                    if (key === "clone") {
                        options.clone = value;
                    }
                    if (key === "disableChangesApi") {
                        options.disableChangesApi = value;
                    }
                    if (key === "transactional") {
                        options.transactional = value;
                    }

                    return options;

                });
            }

            return options;
        }

        function getCollection(collection) {
            if (collection && collection.NAME) {
                var foundCollection =  _.find(collections, {name : collection.NAME});
                return _.isUndefined(foundCollection) ? null : foundCollection;
            }
            return null;
        }

        function loadHandler() {
            collections = _.map(db.listCollections(), function (collection) {
                return db.getCollection(collection.name);
            });
        }

        // This is only here for testing purposes
        function setStoredCollections(updatedCollections) {
            collections = updatedCollections;
        }
    }

    angular
        .module("app.shared.db")
        .factory("DataStore", DataStore);
})();
