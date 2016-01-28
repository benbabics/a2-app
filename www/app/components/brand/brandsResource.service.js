(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BrandsResource($q, globals, ConfigurationApiRestangular) {

        // Private members
        var brandsResource;

        // Revealed Public members
        var service = {
            getBrandAssets: getBrandAssets
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            brandsResource = ConfigurationApiRestangular.service(globals.CONFIGURATION_API.BRANDS.BASE);
        }

        function forBrand(brandId) {
            return brandsResource.one(brandId);
        }

        function getBrandAssets(brandId) {
            return $q.when(forBrand(brandId).getList(globals.CONFIGURATION_API.BRANDS.ASSETS));
        }

    }

    angular
        .module("app.components.brand")
        .factory("BrandsResource", BrandsResource);
})();
