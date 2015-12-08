(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function MenuController($state, $ionicSideMenuDelegate, globals, CommonService) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;

        vm.closeMenu = closeMenu;
        vm.logOut = logOut;

        function closeMenu() {
            $ionicSideMenuDelegate.toggleRight(false);
        }

        function logOut() {
            CommonService.logOut();

            $state.go(globals.LOGIN_STATE);
        }
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();
