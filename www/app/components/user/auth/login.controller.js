(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function LoginController($ionicHistory, $scope, $state, $stateParams, globals, AuthenticationManager, CommonService, UserManager) {

        var _ = CommonService._,
            vm = this;
        vm.config = globals.USER_LOGIN.CONFIG;
        vm.user = {};
        vm.authenticateUser = authenticateUser;

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

                    //the login page seems to behave differently than other pages and usually doesn't emit a $ionicView.beforeLeave or $destroy event...
                    //the back button needs at least one of these events to function properly, so we have to broadcast one manually here
                    //TODO remove when this is no longer an issue?
                    $scope.$broadcast("$ionicView.beforeLeave");

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