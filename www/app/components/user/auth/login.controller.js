(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LoginController(globals) {

        var vm = this;
        vm.config = globals.USER_LOGIN.CONFIG;
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());