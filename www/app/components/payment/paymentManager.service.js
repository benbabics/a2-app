(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function PaymentManager() {
        // Revealed Public members
        var service = {
        };

        activate();

        return service;
        //////////////////////

        function activate() {
        }

    }

    angular
        .module("app.components.payment")
        .factory("PaymentManager", PaymentManager);
})();