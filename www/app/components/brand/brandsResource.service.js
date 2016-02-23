(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BrandsResource($q, globals, moment, ConfigurationApiRestangular) {

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

        function getBrandAssets(brandId, ifModifiedSinceDate) {
            var headers = {};

            if (ifModifiedSinceDate) {
                //we need to format the date into a format that the server expects
                headers["If-Modified-Since"] = moment(ifModifiedSinceDate).tz(moment.tz.guess()).format("ddd, DD MMM YYYY HH:mm:ss z");
            }

            return $q.when(forBrand(brandId).getList(globals.CONFIGURATION_API.BRANDS.ASSETS, {}, headers));
        }

    }

    angular
        .module("app.components.brand")
        .factory("BrandsResource", BrandsResource);
})();
