(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function AuthApiRestangular(Restangular, $base64, globals) {

        // Constants
        var AUTH_API = globals.AUTH_API;

        // Revealed Public members
        var service = Restangular.withConfig(setUpConfiguration);

        return service;
        //////////////////////

        function setUpConfiguration(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(AUTH_API.BASE_URL);

            RestangularConfigurer.setFullResponse(true);

            RestangularConfigurer.setDefaultHeaders({
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + $base64.encode(
                    AUTH_API.CLIENT_CREDENTIALS.CLIENT_ID + ":" + AUTH_API.CLIENT_CREDENTIALS.CLIENT_SECRET)
            });
        }

    }

    angular
        .module("app.shared.api")
        .factory("AuthApiRestangular", AuthApiRestangular);
})();
