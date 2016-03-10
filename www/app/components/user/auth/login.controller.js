(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:13

    /* @ngInject */
    function LoginController(_, $cordovaKeyboard, $ionicHistory, $rootScope, $scope, $state, $stateParams,
                             globals, AnalyticsUtil, AuthenticationManager, LoadingIndicator, LoginManager, PlatformUtil) {

        var vm = this;
        vm.config = globals.USER_LOGIN.CONFIG;
        vm.user = {};
        vm.authenticateUser = authenticateUser;
        vm.isKeyboardVisible = isKeyboardVisible;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);

            //note: Ionic adds and removes this class by default, but it adds a 400ms delay first which is unacceptable here.
            //see http://ionicframework.com/docs/api/page/keyboard/
            var removeKeyboardShowListener = $rootScope.$on("$cordovaKeyboard:show", addKeyboardOpenClass);
            var removeKeyboardHideListener = $rootScope.$on("$cordovaKeyboard:hide", removeKeyboardOpenClass);

            $scope.$on("$destroy", removeKeyboardShowListener);
            $scope.$on("$destroy", removeKeyboardHideListener);
        }

        function addKeyboardOpenClass() {
            document.body.classList.add("keyboard-open");
        }

        function beforeEnter() {
            clearErrorMessage();

            $ionicHistory.clearHistory();

            if (_.has($stateParams, "reason") && _.isString($stateParams.reason)) {
                vm.globalError = vm.config.serverErrors[$stateParams.reason];

                trackErrorEvent($stateParams.reason);
            }
        }

        function authenticateUser() {
            clearErrorMessage();

            LoadingIndicator.begin();

            return AuthenticationManager.authenticate(vm.user.username, vm.user.password)
                .then(LoginManager.logIn)
                .then(function () {
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
                .catch(function (loginError) {
                    var errorReason = "DEFAULT";

                    //use the more specific error code if it is a trackable error
                    if (_.has(loginError, "message") && _.has(vm.config.serverErrors, loginError.message)) {
                        errorReason = loginError.message;
                    }

                    vm.globalError = vm.config.serverErrors[errorReason];

                    LoginManager.logOut();
                    trackErrorEvent(errorReason);
                })
                .finally(LoadingIndicator.complete);
        }

        function clearErrorMessage() {
            //clear any previous error
            vm.globalError = false;
        }

        function isKeyboardVisible() {
            return PlatformUtil.platformHasCordova() && $cordovaKeyboard.isVisible();
        }

        function removeKeyboardOpenClass() {
            document.body.classList.remove("keyboard-open");
        }

        function trackErrorEvent(errorReason) {
            var errorEvent;
            if (_.has(vm.config.ANALYTICS.errorEvents, errorReason)) {
                errorEvent = vm.config.ANALYTICS.errorEvents[errorReason];

                _.spread(AnalyticsUtil.trackEvent)(vm.config.ANALYTICS.events[errorEvent]);
            }
        }

        function trackSuccessEvent() {
            _.spread(AnalyticsUtil.trackEvent)(vm.config.ANALYTICS.events.successfulLogin);
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());
