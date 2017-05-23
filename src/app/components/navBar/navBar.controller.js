(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function NavBarController(globals) {

        var vm = this;
        vm.config = globals.NAV_BAR.CONFIG;
    }

    angular.module("app.components.navBar")
        .controller("NavBarController", NavBarController);
})();
