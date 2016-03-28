(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function ApiRestangular(_, Restangular, DataExtractorResponseInterceptor) {

        // Revealed Public members
        var service = Restangular.withConfig(setUpConfiguration);

        service.customizeConfiguration = customizeConfiguration;
        service.setUpConfiguration = setUpConfiguration;

        activate();

        return service;
        //////////////////////

        function activate() {
            customizeConfiguration(service);
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

        function setUpConfiguration(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);

            RestangularConfigurer.addResponseInterceptor(function (data, operation) { // args: data, operation, what, url, response, deferred
                return DataExtractorResponseInterceptor.response(data, operation);
            });
        }

    }

    angular
        .module("app.shared.api")
        .factory("ApiRestangular", ApiRestangular);
})();
