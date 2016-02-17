(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BrandAssetCollection(IndexedDatabase, globals) {
        var collection,
            service = {
                getCollection: getCollection
            };

        return service;
        //////////////////////

        function getCollection() {
            collection = IndexedDatabase.getCollection(globals.BRAND_ASSET_COLLECTIOM);
            if (collection === null) {
                collection = IndexedDatabase.addCollection(globals.BRAND_ASSET_COLLECTIOM);
            }
            return collection;
        }

    }

    angular
        .module("app.components.brand")
        .factory("BrandAssetCollection", BrandAssetCollection);
})();