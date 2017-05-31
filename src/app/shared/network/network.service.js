(function () {
    "use strict";

    /* jshint -W003, -W026, -W106 */

    /* @ngInject */
    function Network(_) {
        var SERVER_ERROR_CODES = [404, 500, 503];

        return {
            "isServerConnectionError": isServerConnectionError
        };
        //////////////////////
        //Public functions:
        //////////////////////

        function isServerConnectionError(errorObject) {
            return _.includes(SERVER_ERROR_CODES, _.get(errorObject, "status"));
        }
    }

    angular
        .module("app.shared.network")
        .factory("Network", Network);
})();
