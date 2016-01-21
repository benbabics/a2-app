(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function TermsOfUseController(globals) {

        var vm = this;
        vm.config = globals.TERMS_OF_USE.CONFIG;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
        }

    }

    angular.module("app.components.terms")
        .controller("TermsOfUseController", TermsOfUseController);
})();
