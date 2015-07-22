(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function MenuController(globals) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();