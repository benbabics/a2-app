(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function ContactUsController(globals) {

        var vm = this;
        vm.config = globals.CONTACT_US.CONFIG;

        //////////////////////

    }

    angular.module("app.components.contactUs")
        .controller("ContactUsController", ContactUsController);
})();
