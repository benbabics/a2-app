(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LoginController($ionicHistory, $state, globals, AuthenticationManager, CommonService, UserManager) {

        var vm = this;
        vm.config = globals.USER_LOGIN.CONFIG;
        vm.user = {};
        vm.authenticateUser = authenticateUser;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            clearErrorMessage();

            $ionicHistory.clearHistory();
        }

        function authenticateUser() {
            clearErrorMessage();

            CommonService.loadingBegin();

            return AuthenticationManager.authenticate(vm.user.username, vm.user.password)
                .then(function () {
                    return UserManager.fetchCurrentUserDetails();
                })
                .then(function() {
                    // Do not allow backing up to the login page.
                    $ionicHistory.nextViewOptions(
                        {
                            disableBack: true
                        }
                    );

                    // transition to the landing page
                    $state.go("landing");
                })
                .catch(function (failedAuthenticationError) {
                    AuthenticationManager.logOut();
                    vm.globalError = vm.config.serverErrors[failedAuthenticationError.message] || vm.config.serverErrors.DEFAULT;
                })
                .finally(function () {
                    CommonService.loadingComplete();
                });
        }

        function clearErrorMessage() {
            //clear any previous error
            vm.globalError = false;
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());