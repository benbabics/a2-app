(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LoginController(globals, AuthenticationManager, CommonService, UserManager) {

        var vm = this;
        vm.config = globals.USER_LOGIN.CONFIG;
        vm.user = UserManager.getNewUser();
        vm.authenticateUser = authenticateUser;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            clearErrorMessage();
        }

        function clearErrorMessage() {
            //clear any previous error
            vm.globalError = false;
        }

        function authenticateUser() {
            clearErrorMessage();

            CommonService.loadingBegin();

            return AuthenticationManager.authenticate(vm.user.username, vm.user.password)
                .then(function() {
                    // transition to the landing page
                    //TODO - $state.go("");
                })
                .catch(function (failedAuthenticateError) {
                    //TODO - vm.globalError = vm.config.serverErrors[failedAuthenticateError];
                })
                .finally(function () {
                    CommonService.loadingComplete();
                });
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());