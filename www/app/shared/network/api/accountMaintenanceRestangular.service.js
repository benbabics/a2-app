(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AccountMaintenanceRestangular(Restangular, globals, AuthenticationErrorInterceptor,
                                           AuthorizationHeaderRequestInterceptor, DataExtractorResponseInterceptor,
                                           CommonService, Logger) {

        // Private members
        var _ = CommonService._;

        // Revealed Public members
        var service = Restangular.withConfig(setUpConfiguration);

        service.configuration.getIdFromElem = getIdFromElem;
        service.configuration.setIdToElem = setIdToElem;

        return service;
        //////////////////////

        function setUpConfiguration(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(globals.ACCOUNT_MAINTENANCE_API.BASE_URL);

            RestangularConfigurer.setFullResponse(true);

            RestangularConfigurer.addFullRequestInterceptor(function (element, operation, what, url, headers, params) {
                return AuthorizationHeaderRequestInterceptor.request(headers);
            });

            RestangularConfigurer.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                return DataExtractorResponseInterceptor.response(data, operation);
            });

            RestangularConfigurer.addErrorInterceptor(function(response, deferred, responseHandler) {
                return AuthenticationErrorInterceptor.responseError(response, deferred, responseHandler);
            });
        }

        function getFieldId(route) {

            if (_.isUndefined(route)) {
                Logger.warn("You're creating a Restangular entity without the path.");
                throw new Error("You're creating a Restangular entity without the path.");
            }

            // if route is secure/accounts ==> returns accounts
            var elementName = _.last(_.words(route));

            // if elementName is accounts ==> returns accountId
            return elementName.substring(0, elementName.length - 1) + "Id";
        }

        function getIdFromElem(elem) {
            return this.getFieldFromElem(getFieldId(elem.route), elem);
        }

        function setIdToElem(elem, id, route) {
            this.setFieldToElem(getFieldId(route), elem, id);
            return this;
        }

    }

    angular
        .module("app.shared.api")
        .factory("AccountMaintenanceRestangular", AccountMaintenanceRestangular);
})();
