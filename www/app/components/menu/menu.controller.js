(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function MenuController($state, $ionicSideMenuDelegate, globals, AuthenticationManager) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;

        vm.closeMenu = closeMenu;
        vm.logOut = logOut;

        function closeMenu() {
            $ionicSideMenuDelegate.toggleRight(false);
        }


        function logOut() {
            AuthenticationManager.logOut();

            $state.go(globals.LOGIN_STATE);
        }
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();