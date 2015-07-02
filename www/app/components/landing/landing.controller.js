(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LandingController(globals) {

        var vm = this;
        vm.config = globals.LANDING.CONFIG;
    }


    angular.module("app.components.landing")
        .controller("LandingController", LandingController);
})();