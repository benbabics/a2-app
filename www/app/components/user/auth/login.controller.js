(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:22

    /* @ngInject */
    function LoginController(_, $cordovaDialogs, $cordovaKeyboard, $ionicHistory, $interval, $localStorage, $q,
                             $rootScope, $scope, $state, $stateParams, globals, sessionCredentials, AnalyticsUtil,
                             Fingerprint, FingerprintProfileUtil, LoadingIndicator, LoginManager, PlatformUtil,
                             UserAuthorizationManager) {

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
        vm.rememberMeToggle = false;
        vm.timedOut = false;
        vm.user = { password: "" };
        vm.getFingerprintDisabledLabel = getFingerprintDisabledLabel;
        vm.isKeyboardVisible = isKeyboardVisible;
        vm.logInUser = logInUser;
        vm.verifyFingerprintRemoval = verifyFingerprintRemoval;

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
                    if (_.get(error, "isDeviceSupported")) {
                        clearFingerprintProfile(vm.user.username);

                        showUserSettingsPopup()
                            .finally(doFingerprintAuthCheck);
                    }
                });
        }

        function clearFingerprintProfile(username) {
            vm.fingerprintProfileAvailable = false;

            return FingerprintProfileUtil.clearProfile(username);
        }

        function doFingerprintAuthCheck() {
            return Fingerprint.isAvailable()
                .then(function () {
                    //enable fingerprint login if there is an existing fingerprint profile for this user
                    return FingerprintProfileUtil.getProfile(vm.user.username)
                        .then(_.partial(_.set, vm, "fingerprintProfileAvailable", true))
                        .finally(_.partial(_.set, vm, "fingerprintAuthAvailable", true));
                });
        }

        function logInUser(useFingerprintAuth) {
            var clientId = _.toLower(vm.user.username),
                clientSecret = vm.user.password,
                acceptTermsListener, rejectTermsListener;

            vm.isLoggingIn = true;

            clearErrorMessage();

            if (!useFingerprintAuth) {
                //remove the previous fingerprint profile for this user (if any)
                clearFingerprintProfile(clientId);
            }

            // track accepted/rejected terms
            acceptTermsListener = $rootScope.$on("FingerprintAuthTerms.accepted", function() { trackEvent( "acceptTerms" ); });
            rejectTermsListener = $rootScope.$on("FingerprintAuthTerms.rejected", function() { trackEvent( "declineTerms" ); });

            return UserAuthorizationManager.verify({
                    clientId: clientId,
                    clientSecret: clientSecret,
                    method: useFingerprintAuth ? USER_AUTHORIZATION_TYPES.FINGERPRINT : USER_AUTHORIZATION_TYPES.SECRET
                })
                .then(LoadingIndicator.begin)
                .then(LoginManager.logIn)
                .then(function () {
                    // track if login was biometric or manual
                    if ( vm.fingerprintAuthAvailable && vm.fingerprintProfileAvailable ) {
                        trackEvent( "successfulLoginBiometric" );
                    }
                    else { trackEvent( "successfulLoginManual" ); }

                    // persist session credentials for one-click fingerprint auth in settings
                    // NOTE: sessionCredentials service (itself) will listen for "app:logout" event
                    // and handle clearing these credentials from the session.
                    if (vm.fingerprintProfileAvailable) {
                        FingerprintProfileUtil.getProfile(clientId).then(function (clientSecret) {
                            sessionCredentials.set({clientId: clientId, clientSecret: clientSecret});
                        });
                    }
                    else {
                        sessionCredentials.set({clientId: clientId, clientSecret: clientSecret});
                    }

                    // Store the Username or not based on Remember Me checkbox
                    rememberUsername(vm.rememberMeToggle, vm.user.username);

                    // Do not allow backing up to the login page.
                    $ionicHistory.nextViewOptions({disableBack: true});

                    // transition to the next page
                    $state.go($stateParams.toState || "landing");

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

                    // remove listeners for accepted/rejected terms
                    acceptTermsListener();
                    rejectTermsListener();
                });
        }

        function clearErrorMessage() {
            //clear any previous error
            vm.globalError = false;

            //clear any timeout warnings
            vm.timedOut = false;
        }

        function clearForm() {
            vm.rememberMe = vm.rememberMeToggle = false;
            vm.user.username = "";
            vm.user.password = "";

            rememberUsername(false);
        }

        function getFingerprintDisabledLabel() {
            switch (_.toLower(PlatformUtil.getPlatform())) {
                case "android":
                    return _.get(vm, "config.touchId.disabled.labelAndroid");
                case "ios":
                    return _.get(vm, "config.touchId.disabled.labelIos");
                default:
                    return _.get(vm, "config.touchId.disabled.labelAndroid");
            }
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
            vm.rememberMe = vm.rememberMeToggle = false;

            // if the Remember Me option was selected previously
            // populate the Username and set the checkbox
            if (_.has($localStorage, USERNAME_KEY)) {
                vm.user.username = $localStorage[USERNAME_KEY];
                vm.rememberMe = vm.rememberMeToggle = true;
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
                trackEvent( errorEvent );
            }
        }

        function trackEvent(eventId) {
            _.spread( AnalyticsUtil.trackEvent )( vm.config.ANALYTICS.events[ eventId ] );
        }

        function verifyFingerprintRemoval(model) {
            var getFingerprintWarningPromptText = function () {
                switch (_.toLower(PlatformUtil.getPlatform())) {
                    case "android":
                        return _.get(vm, "config.touchId.warningPrompt.messageAndroid");
                    case "ios":
                        return _.get(vm, "config.touchId.warningPrompt.messageIos");
                    default:
                        return _.get(vm, "config.touchId.warningPrompt.messageAndroid");
                }
            };

            if (vm.fingerprintProfileAvailable) {
                //delay the unchecking of the remember me box
                if (model === "rememberMe") {
                    vm.rememberMeToggle = true;
                }

                return $cordovaDialogs.confirm(
                    getFingerprintWarningPromptText(),
                    vm.config.touchId.warningPrompt.title, [
                        vm.config.touchId.warningPrompt.buttons.ok,
                        vm.config.touchId.warningPrompt.buttons.cancel
                    ])
                    .then(function (result) {
                        if (result === 1) {
                            clearFingerprintProfile(vm.user.username);
                            clearForm();
                        }
                    });
            }
            else {
                if (model === "rememberMe") {
                    vm.rememberMe = vm.rememberMeToggle;
                }
            }
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());
