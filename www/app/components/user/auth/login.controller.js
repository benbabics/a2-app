(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:23

    /* @ngInject */
    function LoginController(_, $cordovaDialogs, $cordovaKeyboard, $cordovaStatusbar, $ionicHistory, $localStorage, $q,
                             $rootScope, $scope, $state, $stateParams, $window, globals, sessionCredentials, AnalyticsUtil,
                             Fingerprint, FingerprintProfileUtil, FlowUtil, LoadingIndicator, LoginManager, Logger, Modal,
                             Network, PlatformUtil, StatusBar, UserAuthorizationManager, VersionManager, wexTruncateStringFilter) {

        var BAD_CREDENTIALS = "BAD_CREDENTIALS",
            PASSWORD_CHANGED = "PASSWORD_CHANGED",
            CONNECTION_ERROR = "CONNECTION_ERROR",
            USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION.TYPES,
            USER_AUTHORIZATION_ERRORS = globals.USER_AUTHORIZATION.ERRORS,
            USERNAME_KEY = globals.LOCALSTORAGE.KEYS.USERNAME,
            vm = this,
            versionModal;

        vm.config = globals.USER_LOGIN.CONFIG;
        vm.fingerprintAuthAvailable = false;
        vm.fingerprintProfileAvailable = false;
        vm.isLoggingIn = false;
        vm.setupFingerprintAuth = false;
        vm.rememberMe = false;
        vm.timedOut = false;
        vm.user = { password: "" };
        vm.getFingerprintDisabledLabel = getFingerprintDisabledLabel;
        vm.isKeyboardVisible = isKeyboardVisible;
        vm.logInUser = logInUser;
        vm.verifyFingerprintRemoval = verifyFingerprintRemoval;
        vm.maskableUsername = maskableUsername;
        vm.onClearInput = onClearInput;
        vm.rememberMeToggle = rememberMeToggle;
        vm.setupFingerprintAuthToggle = setupFingerprintAuthToggle;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            LoadingIndicator.begin();

            VersionManager.determineVersionStatus()
                .then(createVersionCheckModal)
                .finally(LoadingIndicator.complete);

            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
            $scope.$on("$ionicView.afterEnter", afterEnter);

            var removeCordovaPauseListener = $rootScope.$on("app:cordovaPause", handleOnCordovaPause),
                removeCordovaResumeListener = $rootScope.$on("app:cordovaResume", handleOnCordovaResume);

            $window.addEventListener('native.keyboardshow', onKeyboardOpenFn);
            $window.addEventListener('native.keyboardhide', onKeyboardCloseFn);

            FlowUtil.onPageLeave(removeCordovaPauseListener, $scope);
            FlowUtil.onPageLeave(removeCordovaResumeListener, $scope);
            FlowUtil.onPageLeave(toggleDisableScroll, $scope);
        }

        function onKeyboardOpenFn(event) {
            //note: Ionic adds and removes this class by default, but it adds a 400ms delay first which is unacceptable here.
            //see http://ionicframework.com/docs/api/page/keyboard/
            getScrollContent().addClass("keyboard-open");

            getKeyboardPlaceHolder().css("height", event.keyboardHeight + "px");
        }

        function onKeyboardCloseFn() {
            getScrollContent().removeClass("keyboard-open");

            getKeyboardPlaceHolder().css("height", "0px");
        }

        function getKeyboardPlaceHolder() {
            return angular.element(document.querySelector("#keyboard-spacer"));
        }

        function getScrollContent() {
            return angular.element(document.querySelector(".scroll-content"));
        }

        function toggleDisableScroll(shouldDisabled) {
            PlatformUtil.waitForCordovaPlatform(function () {
                $cordovaKeyboard.disableScroll(shouldDisabled);
            });
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

        function afterEnter() {
            // set status bar to overlay, make fullscreen
            $window.ionic.Platform.fullScreen(true, true);
            StatusBar.setOverlaysApp(true);
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
                    // Set fullscreen to false when the modal will display, so that the styling is correct.
                    // Leave fullscreen true when the modal will NOT display, or the changed styling could show through the system's Touch ID dialog.
                    if (settingUpFingerprintAuth) {
                        $window.ionic.Platform.fullScreen(false, true);
                    }
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
                    rememberUsername(vm.rememberMe, vm.user.username);

                    // Do not allow backing up to the login page.
                    $ionicHistory.nextViewOptions({disableBack: true});

                    // set status bar to solid, set fullscreen to false
                    $window.ionic.Platform.fullScreen(false, true);
                    StatusBar.setOverlaysApp(false);

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
            vm.rememberMe = false;
            vm.user.username = "";
            vm.user.password = "";

            rememberUsername(false);
        }

        // Clears the contents of and refocuses on an input.
        function onClearInput($event) {
            var input = $event.target;

            if (!input.disabled && input.offsetWidth - $event.layerX < 20) {
                if (input.name === "userName") {
                    vm.user.username = "";
                }
                else if (input.name === "password") {
                    vm.user.password = "";
                }
            }
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
            vm.rememberMe = false;

            // if the Remember Me option was selected previously
            // populate the Username and set the checkbox
            if (_.has($localStorage, USERNAME_KEY)) {
                vm.user.username = $localStorage[USERNAME_KEY];
                vm.rememberMe = true;
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

        function verifyFingerprintRemoval() {
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
                return $q.resolve();
            }
        }

        function rememberMeToggle(rememberMe) {
            if (_.isUndefined(rememberMe)) {
                return vm.rememberMe;
            }
            else {
                if (!rememberMe && vm.fingerprintProfileAvailable) {
                    verifyFingerprintRemoval();
                }
                else {
                    vm.rememberMe = rememberMe;
                }
            }
        }

        function setupFingerprintAuthToggle(setupFingerprintAuth) {
            if (_.isUndefined(setupFingerprintAuth)) {
                return vm.setupFingerprintAuth;
            }
            else {
                if (setupFingerprintAuth) {
                    //automatically enable remember me
                    vm.rememberMe = true;
                }

                vm.setupFingerprintAuth = setupFingerprintAuth;
            }
        }

        function createVersionCheckModal(versionStatus) {
            var VERSION_STATUS = globals.MODAL_TYPES.VERSION_CHECK.options.scopeVars,
                scopeVars = {};

            if (versionStatus.status === globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.CAN_UPDATE) {
                scopeVars.CONFIG = VERSION_STATUS.WARN;
            }
            else if (versionStatus.status === globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.MUST_UPDATE) {
                scopeVars.CONFIG = VERSION_STATUS.FAIL;
            }
            else {
                return;
            }

            scopeVars.skipUpdate = skipVersionUpdate;
            scopeVars.update = versionUpdate;

            return Modal.createByType(globals.MODAL_TYPES.VERSION_CHECK, {
                scopeVars: scopeVars
            })
                .then(function (modal) {
                    modal.show();
                    versionModal = modal;
                });
        }

        function skipVersionUpdate() {
            versionModal.hide();
        }

        function versionUpdate() {
            var VERSION_STATUS = globals.MODAL_TYPES.VERSION_CHECK.options.scopeVars,
                platform = PlatformUtil.getPlatform().toLowerCase(),
                url = VERSION_STATUS.APP_STORES[platform];

            if (url) {
                PlatformUtil.waitForCordovaPlatform()
                    .then(function () {
                        window.cordova.plugins.market.open(url);
                    });
            }
        }
    }

    angular.module("app.components.user.auth")
        .controller("LoginController", LoginController);
}());
