(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:14

    /* @ngInject */
    function LoginController(_, $cordovaKeyboard, $ionicHistory, $localStorage, $rootScope, $scope, $state, $stateParams,
                             globals, AnalyticsUtil, AuthenticationManager, LoadingIndicator, LoginManager, PlatformUtil) {

        var USERNAME_KEY = globals.LOCALSTORAGE.KEYS.USERNAME,
            vm = this;

        vm.config = globals.USER_LOGIN.CONFIG;
        vm.rememberMe = false;
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

            setupUsername();

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

                    // Store the Username or not based on Remember Me checkbox
                    rememberUsername(vm.rememberMe, vm.user.username);

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

        function rememberUsername(shouldRemember, username) {
            if (shouldRemember) {
                $localStorage[USERNAME_KEY] = username;
            }
            else {
                delete $localStorage[USERNAME_KEY];
            }
        }

        function removeKeyboardOpenClass() {
            document.body.classList.remove("keyboard-open");
        }

        function setupUsername() {
            // default the checkbox to false
            vm.rememberMe = false;

            // if the Remember Me option was selected previously
            // populate the Username and set the checkbox
            if (_.has($localStorage, USERNAME_KEY)) {
                vm.user.username = $localStorage[USERNAME_KEY];
                vm.rememberMe = true;
            }
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
