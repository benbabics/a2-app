(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:10

    /* @ngInject */
    function LoginController($cordovaGoogleAnalytics, $cordovaKeyboard, $ionicHistory, $scope, $state, $stateParams,
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

                trackErrorEvent($stateParams.reason);
            }

            CommonService.waitForCordovaPlatform(function () {
                $cordovaGoogleAnalytics.trackView(vm.config.ANALYTICS.pageName);
            });
        }

        function authenticateUser() {
            clearErrorMessage();

            CommonService.loadingBegin();

            return AuthenticationManager.authenticate(vm.user.username, vm.user.password)
                .then(UserManager.fetchCurrentUserDetails)
                .then(function() {
                    trackSuccessEvent();

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
                    var errorReason = "DEFAULT";
                    if (_.has(vm.config.serverErrors, failedAuthenticationError.message)) {
                        errorReason = failedAuthenticationError.message;
                    }

                    vm.globalError = vm.config.serverErrors[errorReason];

                    CommonService.logOut();
                    trackErrorEvent(errorReason);
                })
                .finally(CommonService.loadingComplete);
        }

        function clearErrorMessage() {
            //clear any previous error
            vm.globalError = false;
        }

        function keyboardIsVisible() {
            return CommonService.platformHasCordova() && $cordovaKeyboard.isVisible();
        }

        function trackErrorEvent(errorReason) {
            CommonService.waitForCordovaPlatform(function () {
                var errorEvent;
                if (_.has(vm.config.ANALYTICS.errorEvents, errorReason)) {
                    errorEvent = vm.config.ANALYTICS.errorEvents[errorReason];

                    _.spread($cordovaGoogleAnalytics.trackEvent)(vm.config.ANALYTICS.events[errorEvent]);
                }
            });
        }

        function trackSuccessEvent() {
            CommonService.waitForCordovaPlatform(function () {
                _.spread($cordovaGoogleAnalytics.trackEvent)(vm.config.ANALYTICS.events.successfulLogin);
            });
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());
