(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function MenuController($state, globals, AuthenticationManager) {

        var vm = this;
        vm.config = globals.MENU.CONFIG;
        vm.logOut = logOut;


        function logOut() {
            AuthenticationManager.logOut();

            $state.go("user.auth.login");
        }
    }

    angular.module("app.components.menu")
        .controller("MenuController", MenuController);
})();