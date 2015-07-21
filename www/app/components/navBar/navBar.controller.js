(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function NavBarController(globals) {

        var vm = this;
        vm.config = globals.NAV_BAR.CONFIG;
    }

    angular.module("app.components.navBar")
        .controller("NavBarController", NavBarController);
})();