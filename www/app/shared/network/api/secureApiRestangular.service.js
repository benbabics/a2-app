(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function SecureApiRestangular(Restangular, AuthorizationHeaderRequestInterceptor,
                                  CommonService, DataExtractorResponseInterceptor) {

        // Private members
        var _ = CommonService._;

        // Revealed Public members
        var service = Restangular.withConfig(setUpConfiguration);

        service.customizeConfiguration = customizeConfiguration;

        activate();

        return service;
        //////////////////////

        function activate() {
            customizeConfiguration(service);
        }

        function setUpConfiguration(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);

            // jshint maxparams:5
            RestangularConfigurer.addFullRequestInterceptor(function (element, operation, what, url, headers) { // args: element, operation, what, url, headers, params
                return AuthorizationHeaderRequestInterceptor.request(headers);
            });

            RestangularConfigurer.addResponseInterceptor(function (data, operation) { // args: data, operation, what, url, response, deferred
                return DataExtractorResponseInterceptor.response(data, operation);
            });
        }

        function customizeConfiguration(newConfig) {
            newConfig.configuration.getIdFromElem = getIdFromElem;
            newConfig.configuration.setIdToElem = setIdToElem;
        }

        function getFieldId(route) {

            if (_.isUndefined(route)) {
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
        .factory("SecureApiRestangular", SecureApiRestangular);
})();
