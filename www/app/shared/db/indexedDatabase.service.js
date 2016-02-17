(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function IndexedDatabase(Loki, globals, CommonService) {
        var _ = CommonService._,
            collections = [],
            dataStore = globals.DATASTORE,
            db,
            service = {
                addCollection : addCollection,
                getCollection : getCollection
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            var adapter = new LokiIndexedAdapter(dataStore.APP_CONTEXT);
            db = new Loki(dataStore.DATABASE.NAME, {
                autoload         : true,
                autoloadCallback : loadHandler,
                autosave         : true,
                autosaveInterval : 10000,
                adapter          : adapter
            });
        }
        function loadHandler() {
            collections = _.map(db.listCollections(), function (coll) {
                return db.getCollection(coll.name);
            });
        }

        function addCollection(collection) {
            if (collection && collection.NAME) {
                return db.addCollection(collection.NAME, configurationOptions(collection));
            }
            return null;
        }

        function getCollection(collection) {
            if (collection && collection.NAME) {
                var foundCollection =  _.find(collections, {name : collection.NAME});
                return foundCollection === undefined ? null : foundCollection;
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
    }

    angular
        .module("app.shared.db")
        .factory("IndexedDatabase", IndexedDatabase);
})();