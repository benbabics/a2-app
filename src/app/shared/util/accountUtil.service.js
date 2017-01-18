(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AccountUtil(_) {
        // Revealed Public members
        var service = {
            "maskAccountNumber": maskAccountNumber
        };

        return service;
        //////////////////////

        function maskAccountNumber(accountNumber) {

            var maskedNumber = "";

            if (!_.isEmpty(accountNumber)) {
                // Replace all but the last 4 characters with *
                maskedNumber = accountNumber.replace(/.(?=.{4})/g, "*");
            }

            return maskedNumber;
        }
    }

    angular
        .module("app.shared.util")
        .factory("AccountUtil", AccountUtil);
})();
