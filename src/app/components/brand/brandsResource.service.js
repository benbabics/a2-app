(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function BrandsResource( globals, ConfigurationApiRestangular) {

        // Private members


        // Revealed Public members
        var service = {
            fetchBrandLogo: fetchBrandLogo
        };

        activate();

        return service;
        //////////////////////

        function activate() {}


        function fetchBrandLogo(brandName){
            var logoUrl = `${globals.CONFIGURATION_API.BASE_URL}/logo/${brandName}.svg`;
            return ConfigurationApiRestangular.oneUrl("brandLogo", logoUrl).get();

        }
        


    }

    angular
        .module("app.components.brand")
        .factory("BrandsResource", BrandsResource);
})();
