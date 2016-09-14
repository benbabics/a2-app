(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:19

    /* @ngInject */
    function LoginController(_, $cordovaDialogs, $cordovaKeyboard, $ionicHistory, $interval, $localStorage, $q, $rootScope, $scope, $state, $stateParams,
                             globals, AnalyticsUtil, Fingerprint, LoadingIndicator, LoginManager, PlatformUtil, SecureStorage, UserAuthorizationManager) {

        var BAD_CREDENTIALS = "BAD_CREDENTIALS",
            FINGERPRINT_PROMPT_RESUME_DELAY = 2000,
            USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION_TYPES,
            USERNAME_KEY = globals.LOCALSTORAGE.KEYS.USERNAME,
            vm = this;

        vm.config = globals.USER_LOGIN.CONFIG;
        vm.fingerprintAuthAvailable = false;
        vm.fingerprintProfileAvailable = false;
        vm.isLoggingIn = false;
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
            var removeKeyboardShowListener = $rootScope.$on("$cordovaKeyboard:show", addKeyboardOpenClass),
                removeKeyboardHideListener = $rootScope.$on("$cordovaKeyboard:hide", removeKeyboardOpenClass),
                removeCordovaPauseListener = $rootScope.$on("app:cordovaPause",      handleOnCordovaPause);

            $scope.$on("$destroy", removeKeyboardShowListener);
            $scope.$on("$destroy", removeKeyboardHideListener);
            $scope.$on("$destroy", removeCordovaPauseListener);
            $scope.$on("$destroy", toggleDisableScroll);
        }

        function toggleStatusBarOverlaysWebView(shouldOverlay) {
            if ( !!window.StatusBar ) {
                StatusBar.overlaysWebView( !!shouldOverlay );
            }
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
            // toggle StatusBar as overlay
            toggleStatusBarOverlaysWebView( true );

            clearErrorMessage();
            toggleDisableScroll( true );

            $ionicHistory.clearHistory();

            setupUsername();

            if (_.has($stateParams, "errorReason") && _.isString($stateParams.errorReason)) {
                vm.globalError = vm.config.serverErrors[$stateParams.errorReason];

                trackErrorEvent($stateParams.errorReason);
            }

            vm.timedOut = $stateParams.timedOut;

            doFingerprintAuthCheck()
                .then(function () {
                    if (vm.fingerprintProfileAvailable && !$stateParams.logOut) {
                        logInUser(true);
                    }
                })
                .catch(function (error) {
                    var clientId = _.toLower(vm.user.username);

                    if (_.get(error, "isDeviceSupported")) {
                        clearFingerprintProfile(clientId);

                        showUserSettingsPopup()
                            .finally(doFingerprintAuthCheck);
                    }
                });
        }

        function clearFingerprintProfile(clientId) {
            vm.fingerprintProfileAvailable = false;

            return SecureStorage.remove(clientId);
        }

        function doFingerprintAuthCheck() {
            return Fingerprint.isAvailable()
                .then(function () {
                    var clientId = _.toLower(vm.user.username);

                    //enable fingerprint login if there is an existing fingerprint profile for this user
                    return SecureStorage.get(clientId)
                        .then(_.partial(_.set, vm, "fingerprintProfileAvailable", true))
                        .finally(_.partial(_.set, vm, "fingerprintAuthAvailable", true));
                });
        }

        function logInUser(useFingerprintAuth) {
            var clientId = _.toLower(vm.user.username);

            vm.isLoggingIn = true;

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

                    // toggle StatusBar as fixed
                    toggleStatusBarOverlaysWebView( false );
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
                .finally(function () {
                    LoadingIndicator.complete();

                    vm.isLoggingIn = false;
                });
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

        function handleOnCordovaPause() {
            //clear any previous error
            $scope.$apply(function() {
                vm.globalError = false;

                //show the fingerprint login prompt if there's a fingerprint profile
                //NOTE: A delay is needed as showing the prompt too early results in occasional app crashes.
                if (vm.fingerprintProfileAvailable && !vm.isLoggingIn) {
                    $interval(_.partial(logInUser, true), FINGERPRINT_PROMPT_RESUME_DELAY, 1);
                }
            });
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

        function showUserSettingsPopup() {
            var getFingerprintSettingsPromptText = function () {
                switch (_.toLower(PlatformUtil.getPlatform())) {
                    case "android":
                        return _.get(vm, "config.touchId.settingsPrompt.messageAndroid");
                    case "ios":
                        return _.get(vm, "config.touchId.settingsPrompt.messageIos");
                    default:
                        return _.get(vm, "config.touchId.settingsPrompt.messageAndroid");
                }
            };

            return $cordovaDialogs.confirm(
                getFingerprintSettingsPromptText(),
                vm.config.touchId.settingsPrompt.title, [
                    vm.config.touchId.settingsPrompt.buttons.settings,
                    vm.config.touchId.settingsPrompt.buttons.cancel
                ])
                .then(function (result) {
                    if (result === 1) {
                        switch (_.toLower(PlatformUtil.getPlatform())) {
                            case "android":
                                cordova.plugins.settings.openSetting("security");
                                break;
                            default:
                                cordova.plugins.settings.open();
                        }

                    }
                });
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
