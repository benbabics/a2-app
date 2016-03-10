(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function AddressUtil(_) {
        // Private members
        var POBOX_REGEX = new RegExp("([\\w\\s*\\W]*(P(OST)?(\\.)?\\s*O(FF(ICE)?)?(\\.)?\\s*B(OX)?))[\\w\\s*\\W]*");

        // Revealed Public members
        var service = {
            "isPoBox": isPoBox
        };

        return service;
        //////////////////////

        function isPoBox(addressLine) {
            return _.isString(addressLine) && addressLine.length > 0 && !!addressLine.toUpperCase().match(POBOX_REGEX);
        }
    }

    angular
        .module("app.shared.util")
        .factory("AddressUtil", AddressUtil);
})();
