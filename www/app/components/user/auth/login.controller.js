(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:17

    /* @ngInject */
    function LoginController(_, $cordovaKeyboard, $ionicHistory, $localStorage, $q, $rootScope, $scope, $state, $stateParams,
                             globals, AnalyticsUtil, Fingerprint, LoadingIndicator, LoginManager, PlatformUtil, SecureStorage, UserAuthorizationManager) {

        var BAD_CREDENTIALS = "BAD_CREDENTIALS",
            USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION_TYPES,
            USERNAME_KEY = globals.LOCALSTORAGE.KEYS.USERNAME,
            vm = this;

        vm.config = globals.USER_LOGIN.CONFIG;
        vm.fingerprintAuthAvailable = false;
        vm.fingerprintProfileAvailable = false;
        vm.setupFingerprintAuth = false;
        vm.rememberMe = false;
        vm.timedOut = false;
        vm.user = { password: "" };
        vm.isKeyboardVisible = isKeyboardVisible;
        vm.logInUser = logInUser;

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
            $scope.$on("$destroy", toggleDisableScroll);
        }

        function addKeyboardOpenClass() {
            document.body.classList.add("keyboard-open");
        }

        function toggleDisableScroll(shouldDisabled) {
            if ( !!window.cordova ) {
                cordova.plugins.Keyboard.disableScroll( !!shouldDisabled );
            }
        }

        function beforeEnter() {
            clearErrorMessage();
            toggleDisableScroll( true );

            $ionicHistory.clearHistory();

            setupUsername();

            if (_.has($stateParams, "errorReason") && _.isString($stateParams.errorReason)) {
                vm.globalError = vm.config.serverErrors[$stateParams.errorReason];

                trackErrorEvent($stateParams.errorReason);
            }

            vm.timedOut = $stateParams.timedOut;

            Fingerprint.isAvailable()
                .then(function () {
                    var clientId = _.toLower(vm.user.username);

                    //enable fingerprint login if there is an existing fingerprint profile for this user
                    SecureStorage.get(clientId)
                        .then(_.partial(_.set, vm, "fingerprintProfileAvailable", true))
                        .finally(_.partial(_.set, vm, "fingerprintAuthAvailable", true));
                })
                .catch(function (error) {
                    if (error.isDeviceSupported) {
                        //TODO - Show native fingerprint settings dialog
                    }
                });
        }

        function clearFingerprintProfile(clientId) {
            vm.fingerprintProfileAvailable = false;

            return SecureStorage.remove(clientId);
        }

        function logInUser(useFingerprintAuth) {
            var clientId = _.toLower(vm.user.username);

            clearErrorMessage();

            if (!useFingerprintAuth) {
                //remove the previous fingerprint profile for this user (if any)
                clearFingerprintProfile(clientId);
            }

            return UserAuthorizationManager.verify({
                    clientId: clientId,
                    clientSecret: vm.user.password,
                    method: useFingerprintAuth ? USER_AUTHORIZATION_TYPES.FINGERPRINT : USER_AUTHORIZATION_TYPES.SECRET
                })
                .then(LoadingIndicator.begin)
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

                    return $q.reject(errorReason)
                        .finally(function () {
                            vm.globalError = vm.config.serverErrors[errorReason];

                            LoginManager.logOut();
                            trackErrorEvent(errorReason);

                            if (useFingerprintAuth && loginError.message === BAD_CREDENTIALS) {
                                //user needs to update the auth profile since their password has changed
                                return clearFingerprintProfile(clientId);
                            }
                        });
                })
                .finally(LoadingIndicator.complete);
        }

        function clearErrorMessage() {
            //clear any previous error
            vm.globalError = false;

            //clear any timeout warnings
            vm.timedOut = false;
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
