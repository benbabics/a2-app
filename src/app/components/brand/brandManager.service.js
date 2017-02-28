(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:11

    /* @ngInject */
    function BrandManager( BrandsResource, UserManager, WexCache ) {

        // Revealed Public members
        var service = {
            fetchBrandLogo : fetchBrandLogo
        };

        return service;
        //////////////////////

        function fetchBrandLogo(){

            var userDetails = UserManager.getUser();
            return BrandsResource.fetchBrandLogo( userDetails.brand )
                   .then(function( resolvedValue ){
                        WexCache.storePropertyValue( "brandLogo", resolvedValue.data);
                        return resolvedValue.data;
                        });
        }

    }

    angular
        .module("app.components.brand")
        .factory("BrandManager", BrandManager);
})();
