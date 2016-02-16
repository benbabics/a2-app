(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function IndexedDatabase(Loki, globals) {
        var dataStore = globals.DATASTORE,
            db,
            collection,
            service = {
                addCollection : addCollection,
                getCollection : getCollection,
                loadCollection: loadCollection
            };

        activate();

        return service;
        //////////////////////

        function activate() {
            var adapter = new LokiIndexedAdapter(dataStore.APP_CONTEXT);
            db = new Loki(dataStore.DATABASE.NAME, {
                autosave        : true,
                autosaveInterval: 10000,
                adapter         : adapter
            });

            collection = loadCollection();
            if (collection === null) {
                collection = addCollection();
            }
        }

        function loadCollection() {
            return db.getCollection(dataStore.DATABASE.COLLECTION.name);
        }

        function addCollection() {
            return db.addCollection(dataStore.DATABASE.COLLECTION.name, {
                unique : [dataStore.DATABASE.COLLECTION.unique],
                indices: [dataStore.DATABASE.COLLECTION.index]
            });
        }

        function getCollection() {
            return collection;
        }
    }

    angular
        .module("app.shared.db")
        .factory("IndexedDatabase", IndexedDatabase);
})();