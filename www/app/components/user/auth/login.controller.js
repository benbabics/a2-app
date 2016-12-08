(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:23

    /* @ngInject */
    function LoginController(_, $cordovaDialogs, $cordovaKeyboard, $cordovaStatusbar, $ionicHistory, $localStorage, $q,
                             $rootScope, $scope, $state, $stateParams, $window, globals, sessionCredentials, AnalyticsUtil,
                             Fingerprint, FingerprintProfileUtil, FlowUtil, LoadingIndicator, LoginManager, Logger,
                             Network, PlatformUtil, UserAuthorizationManager, wexTruncateStringFilter) {

        var BAD_CREDENTIALS = "BAD_CREDENTIALS",
            PASSWORD_CHANGED = "PASSWORD_CHANGED",
            CONNECTION_ERROR = "CONNECTION_ERROR",
            USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION.TYPES,
            USER_AUTHORIZATION_ERRORS = globals.USER_AUTHORIZATION.ERRORS,
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
        vm.maskableUsername = maskableUsername;
        vm.onClearInput = onClearInput;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);

            //note: Ionic adds and removes this class by default, but it adds a 400ms delay first which is unacceptable here.
            //see http://ionicframework.com/docs/api/page/keyboard/
            var removeKeyboardShowListener = $rootScope.$on("$cordovaKeyboard:show", addKeyboardOpenClass),
                removeCordovaPauseListener = $rootScope.$on("app:cordovaPause", handleOnCordovaPause),
                removeCordovaResumeListener = $rootScope.$on("app:cordovaResume", handleOnCordovaResume);

            FlowUtil.onPageLeave(removeKeyboardShowListener, $scope);
            FlowUtil.onPageLeave(removeCordovaPauseListener, $scope);
            FlowUtil.onPageLeave(removeCordovaResumeListener, $scope);
            FlowUtil.onPageLeave(toggleDisableScroll, $scope);
        }

        function toggleStatusBarOverlaysWebView(shouldOverlay) {
            PlatformUtil.waitForCordovaPlatform(function () {
                $cordovaStatusbar.overlaysWebView(shouldOverlay);
            });
        }

        function addKeyboardOpenClass() {
            document.body.classList.add("keyboard-open");
        }

        function toggleDisableScroll(shouldDisabled) {
            PlatformUtil.waitForCordovaPlatform(function () {
                $cordovaKeyboard.disableScroll(shouldDisabled);
            });
        }

        function beforeEnter() {
            // toggle StatusBar as overlay, make fullscreen
            $window.ionic.Platform.fullScreen(true, true);
            toggleStatusBarOverlaysWebView(true);

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
                        //show the fingerprint prompt
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
            var acceptTermsListener, rejectTermsListener,
                clientId = _.toLower(vm.user.username),
                clientSecret = vm.user.password,
                settingUpFingerprintAuth = useFingerprintAuth && !vm.fingerprintProfileAvailable;

            vm.isLoggingIn = true;

            clearErrorMessage();

            // track accepted/rejected terms
            acceptTermsListener = $rootScope.$on("FingerprintAuthTerms.accepted", function() { trackEvent( "acceptTerms" ); });
            rejectTermsListener = $rootScope.$on("FingerprintAuthTerms.rejected", function() { trackEvent( "declineTerms" ); });


            return $q.when(settingUpFingerprintAuth ? clearFingerprintProfile(clientId) : true)
                .catch($q.resolve)
                .then(function () {
                    // Set fullscreen to false so the modal displays correctly.
                    $window.ionic.Platform.fullScreen(false, true);
                    return UserAuthorizationManager.verify({
                        clientId: clientId,
                        clientSecret: clientSecret,
                        method: useFingerprintAuth ? USER_AUTHORIZATION_TYPES.FINGERPRINT : USER_AUTHORIZATION_TYPES.SECRET
                    });
                })
                .then(LoadingIndicator.begin)
                .then(LoginManager.logIn)
                .then(function () {
                    // track if login was biometric or manual
                    if (vm.fingerprintAuthAvailable && vm.fingerprintProfileAvailable) {
                        trackEvent("successfulLoginBiometric");
                    }
                    else {
                        trackEvent("successfulLoginManual");
                    }

                    // Store the Username or not based on Remember Me checkbox
                    rememberUsername(vm.rememberMeToggle, vm.user.username);

                    // Do not allow backing up to the login page.
                    $ionicHistory.nextViewOptions({disableBack: true});

                    // toggle StatusBar as fixed
                    toggleStatusBarOverlaysWebView(false);

                    return FingerprintProfileUtil.getProfile(clientId)
                        .then(function (fingerprintProfile) {
                            clientSecret = fingerprintProfile.clientSecret;
                        })
                        .catch(function () {
                            settingUpFingerprintAuth = false;

                            return $q.resolve();
                        })
                        .finally(function () {
                            // persist session credentials for one-click fingerprint auth in settings
                            // NOTE: sessionCredentials service (itself) will listen for "app:logout" event
                            // and handle clearing these credentials from the session.
                            sessionCredentials.set({clientId: clientId, clientSecret: clientSecret});

                            // transition to the next page
                            if ($stateParams.toState) {
                                $state.go($stateParams.toState);
                            }
                            else {
                                $state.go("landing", {showFingerprintBanner: settingUpFingerprintAuth});
                            }
                        });
                })
                .catch(function (loginError) {
                    // Set fullscreen back to true for any error banners that may display.
                    $window.ionic.Platform.fullScreen(true, true);

                    var IGNORED_USER_AUTH_ERRORS = [
                            USER_AUTHORIZATION_ERRORS.USER_CANCELED,
                            USER_AUTHORIZATION_ERRORS.EXCEEDED_ATTEMPTS
                        ],
                        errorMessageCode = _.get(loginError, "data.message");

                    if (Network.isServerConnectionError(loginError.data) || loginError.reason === USER_AUTHORIZATION_ERRORS.TERMS_LOG_FAILED) {
                        errorMessageCode = CONNECTION_ERROR;
                    }
                    else if (useFingerprintAuth && !settingUpFingerprintAuth && errorMessageCode === BAD_CREDENTIALS) {
                        errorMessageCode = PASSWORD_CHANGED;

                        //user needs to update the auth profile since their password has changed
                        clearFingerprintProfile(clientId);
                    }
                    else if (!_.has(vm.config.serverErrors, errorMessageCode)) {
                        //use less specific error code if it is not a trackable error
                        errorMessageCode = "DEFAULT";
                    }

                    if (!_.includes(IGNORED_USER_AUTH_ERRORS, loginError.reason)) {
                        vm.globalError = vm.config.serverErrors[errorMessageCode];

                        Logger.error(vm.globalError);
                        trackErrorEvent(errorMessageCode);
                    }

                    return $q.reject(errorMessageCode)
                        .finally(function () {
                            LoginManager.logOut();
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

        // Clears the contents of and refocuses on an input.
        function onClearInput(inputName) {
            var input = document.querySelector("input[name=" + inputName + "]");

            if (_.isNil(input)) {
                var error = "Unknown input name: '" + inputName + "'";
                Logger.error(error);
                throw new Error(error);
            }

            if (input.name === "userName") {
                vm.user.username = "";
            }
            else if (input.name === "password") {
                vm.user.password = "";
            }

            setTimeout(function() { input.focus(); });
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

        function handleOnCordovaPause() {
            //clear any previous error
            $scope.$apply(function() {
                vm.globalError = false;
            });
        }

        function handleOnCordovaResume() {
            //show the fingerprint login prompt if there's a fingerprint profile
            if (vm.fingerprintProfileAvailable && !vm.isLoggingIn) {
                logInUser(true);
            }
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

        // Combination getter/setter. Passing a parameter invokes the setter.
        // Passing no parameters gets a masked or unmasked value depending on if the input is in focus.
        function maskableUsername() {
            if (arguments.length > 0) {
                vm.user.username = arguments[0];
            }
            else {
                if (vm.usernameIsFocused) {
                    return vm.user.username;
                }
                else {
                    return wexTruncateStringFilter(vm.user.username);
                }
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
