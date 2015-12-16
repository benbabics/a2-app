(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function LoginController($ionicHistory, $scope, $state, $stateParams, $cordovaKeyboard,
                             globals, AuthenticationManager, CommonService, UserManager) {

        var _ = CommonService._,
            vm = this;
        vm.config = globals.USER_LOGIN.CONFIG;
        vm.user = {};
        vm.authenticateUser = authenticateUser;
        vm.keyboardIsVisible = keyboardIsVisible;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            clearErrorMessage();

            $ionicHistory.clearHistory();

            if (_.has($stateParams, "reason") && _.isString($stateParams.reason)) {
                vm.globalError = vm.config.serverErrors[$stateParams.reason];
            }
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
                    CommonService.logOut();
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

        function keyboardIsVisible() {
            return CommonService.platformHasCordova() && $cordovaKeyboard.isVisible();
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());
