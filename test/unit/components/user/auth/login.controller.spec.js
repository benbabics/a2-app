(function () {
    "use strict";

    var $ionicHistory,
        $localStorage,
        $q,
        $rootScope,
        $scope,
        $state,
        $stateParams = {},
        $cordovaDialogs,
        $cordovaKeyboard,
        $interval,
        authenticateDeferred,
        ctrl,
        logInDeferred,
        AuthenticationManager,
        Fingerprint,
        UserAuthorizationManager,
        Network,
        FingerprintProfileUtil,
        fingerprintAvailableDeferred,
        sessionCredentials,
        cordovaPluginsKeyboard,
        cordovaPluginSettings,
        globals,
        config,
        self;

    describe("A Login Controller", function () {

        beforeEach(function () {
            self = this;

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["authenticate"]);
            $state = jasmine.createSpyObj("state", ["go"]);
            $cordovaKeyboard = jasmine.createSpyObj("$cordovaKeyboard", ["isVisible"]);
            Fingerprint = jasmine.createSpyObj("Fingerprint", ["isAvailable"]);
            UserAuthorizationManager = jasmine.createSpyObj("UserAuthorizationManager", ["verify"]);
            FingerprintProfileUtil = jasmine.createSpyObj("FingerprintProfileUtil", ["getProfile", "clearProfile"]);
            sessionCredentials = jasmine.createSpyObj( "sessionCredentials", ["set"] );
            $cordovaDialogs = jasmine.createSpyObj("$cordovaDialogs", ["confirm"]);
            cordovaPluginsKeyboard = jasmine.createSpyObj("cordova.plugins.Keyboard", ["disableScroll"]);
            cordovaPluginSettings = jasmine.createSpyObj("cordova.plugins.settings", ["openSetting", "open"]);
            Network = jasmine.createSpyObj("Network", ["isServerConnectionError"]);

            _.set(window, "cordova.plugins.settings", cordovaPluginSettings);
            _.set(window, "cordova.plugins.Keyboard", cordovaPluginsKeyboard);

            inject(function (_$rootScope_, $controller, _$ionicHistory_, _$interval_,  _$localStorage_, _$q_, BrandAssetModel, UserAccountModel, UserModel,
                             _globals_) {
                $ionicHistory = _$ionicHistory_;
                $localStorage = _$localStorage_;
                $scope = _$rootScope_.$new();
                $q = _$q_;
                $rootScope = _$rootScope_;
                $interval = _$interval_;
                globals = _globals_;
                authenticateDeferred = $q.defer();

                config = globals.USER_LOGIN.CONFIG;

                ctrl = $controller("LoginController", {
                    $localStorage           : $localStorage,
                    $scope                  : $scope,
                    $state                  : $state,
                    $stateParams            : $stateParams,
                    AnalyticsUtil           : this.AnalyticsUtil,
                    $cordovaDialogs         : $cordovaDialogs,
                    $cordovaKeyboard        : $cordovaKeyboard,
                    AuthenticationManager   : AuthenticationManager,
                    LoginManager            : this.LoginManager,
                    Logger                  : this.Logger,
                    PlatformUtil            : this.PlatformUtil,
                    Fingerprint             : Fingerprint,
                    UserAuthorizationManager: UserAuthorizationManager,
                    FingerprintProfileUtil  : FingerprintProfileUtil,
                    sessionCredentials      : sessionCredentials,
                    Network                 : Network
                });

                //setup spies:
                logInDeferred = $q.defer();
                fingerprintAvailableDeferred = $q.defer();

                //setup mocks:
                this.LoginManager.logIn.and.returnValue(logInDeferred.promise);
                Fingerprint.isAvailable.and.returnValue(fingerprintAvailableDeferred.promise);
            });

        });

        afterEach(function () {
            self = null;
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                spyOn($ionicHistory, "clearHistory");

                //setup an existing values to test them being modified
                ctrl.globalError = "This is a previous error";

                UserAuthorizationManager.verify.and.returnValue($q.resolve());
            });

            it("should set timedOut to $stateParams.timedOut", function () {
                $stateParams.timedOut = TestUtils.getRandomBoolean();
                $scope.$broadcast("$ionicView.beforeEnter");
                $rootScope.$digest();

                expect(ctrl.timedOut).toEqual($stateParams.timedOut);
            });

            describe("when the Username is stored in Local Storage", function () {

                beforeEach(function() {
                    $localStorage.USERNAME = TestUtils.getRandomStringThatIsAlphaNumeric(20);

                    // clear the username field so we can validate what it gets set to
                    ctrl.user.username = null;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should set the username with the value from Local Storage", function () {
                    expect(ctrl.user.username).toEqual($localStorage.USERNAME);
                });

                it("should set the rememberMe option to true", function () {
                    expect(ctrl.rememberMeToggle).toBeTruthy();
                });

            });

            describe("when the Username is NOT stored in Local Storage", function () {

                beforeEach(function() {
                    delete $localStorage.USERNAME;

                    // clear the username field so we can validate what it gets set to
                    ctrl.user.username = null;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should NOT set the username", function () {
                    expect(ctrl.user.username).toBeNull();
                });

                it("should set the rememberMe option to false", function () {
                    expect(ctrl.rememberMeToggle).toBeFalsy();
                });

            });

            describe("when fingerprint authentication is available", function () {

                beforeEach(function () {
                    fingerprintAvailableDeferred.resolve();

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                describe("when the user has a stored fingerprint profile", function () {

                    beforeEach(function () {
                        FingerprintProfileUtil.getProfile.and.returnValue($q.resolve());
                    });

                    it("should set vm.fingerprintProfileAvailable to true", function () {
                        $rootScope.$digest();

                        expect(ctrl.fingerprintProfileAvailable).toBe(true);
                    });

                    it("should set vm.fingerprintAuthAvailable to true", function () {
                        $rootScope.$digest();

                        expect(ctrl.fingerprintAuthAvailable).toBe(true);
                    });

                    describe("when the user was logged out", function () {

                        beforeEach(function () {
                            $stateParams.logOut = true;

                            $rootScope.$digest();
                        });

                        it("should NOT start the fingerprint login process", function () {
                            expect(UserAuthorizationManager.verify).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the user was NOT logged out", function () {

                        beforeEach(function () {
                            $stateParams.logOut = false;

                            $rootScope.$digest();
                        });

                        it("should start the fingerprint login process", function () {
                            expect(UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                                method: globals.USER_AUTHORIZATION.TYPES.FINGERPRINT
                            }));
                        });
                    });
                });

                describe("when the user does NOT have a stored fingerprint profile", function () {

                    beforeEach(function () {
                        FingerprintProfileUtil.getProfile.and.returnValue($q.reject());
                        $rootScope.$digest();
                    });

                    it("should NOT set vm.fingerprintProfileAvailable to true", function () {
                        expect(ctrl.fingerprintProfileAvailable).toBe(false);
                    });

                    it("should set vm.fingerprintAuthAvailable to true", function () {
                        expect(ctrl.fingerprintAuthAvailable).toBe(true);
                    });

                    it("should NOT start the fingerprint login process", function () {
                        expect(UserAuthorizationManager.verify).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when fingerprint authentication is NOT available", function () {
                var error;

                beforeEach(function () {
                    error = {
                        isDeviceSupported: false,
                        isSetup: false
                    };
                });

                describe("when the device supports fingerprint auth", function () {
                    var platform;

                    describe("when the platform is Android", function () {

                        beforeEach(function () {
                            platform = "android";
                            this.PlatformUtil.getPlatform.and.returnValue(platform);
                        });

                        describe("will behave such that", commonTests);
                    });

                    describe("when the platform is NOT Android", function () {
                        beforeEach(function () {
                            platform = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                            this.PlatformUtil.getPlatform.and.returnValue(platform);
                        });

                        describe("will behave such that", commonTests);
                    });

                    function commonTests() {
                        var confirmDeferred;

                        beforeEach(function () {
                            confirmDeferred = $q.defer();
                            error.isDeviceSupported = true;

                            $cordovaDialogs.confirm.and.returnValue(confirmDeferred.promise);

                            fingerprintAvailableDeferred.reject(error);

                            $scope.$broadcast("$ionicView.beforeEnter");
                            $rootScope.$digest();
                        });

                        it("should call FingerprintProfileUtil.clearProfile with the expected value", function () {
                            expect(FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(ctrl.user.username);
                        });

                        it("should call $cordovaDialogs.confirm with the expected values", function () {
                            expect($cordovaDialogs.confirm).toHaveBeenCalledWith(
                                getFingerprintSettingsPromptText(platform),
                                config.touchId.settingsPrompt.title, [
                                    config.touchId.settingsPrompt.buttons.settings,
                                    config.touchId.settingsPrompt.buttons.cancel
                                ]);
                        });

                        describe("when the user confirms the dialog", function () {

                            beforeEach(function () {
                                confirmDeferred.resolve(1);
                                $rootScope.$digest();
                            });

                            it("should open the platform's setting menu", function () {
                                testPlatformSettingsWereOpened(platform);
                            });
                        });

                        describe("when the user cancels the dialog", function () {

                            beforeEach(function () {
                                confirmDeferred.resolve(0);
                                $rootScope.$digest();
                            });

                            it("should NOT open the platform's setting menu", function () {
                                testPlatformSettingsWereNotOpened(platform);
                            });
                        });

                        function testPlatformSettingsWereOpened(platform) {
                            switch (_.toLower(platform)) {
                                case "android":
                                    expect(cordovaPluginSettings.openSetting).toHaveBeenCalledWith("security");
                                    break;
                                default:
                                    expect(cordovaPluginSettings.open).toHaveBeenCalledWith();
                            }
                        }

                        function testPlatformSettingsWereNotOpened(platform) {
                            switch (_.toLower(platform)) {
                                case "android":
                                    expect(cordovaPluginSettings.openSetting).not.toHaveBeenCalled();
                                    break;
                                default:
                                    expect(cordovaPluginSettings.open).not.toHaveBeenCalled();
                            }
                        }
                    }
                });

                describe("when the device does NOT support fingerprint auth", function () {

                    beforeEach(function () {
                        error.isDeviceSupported = false;

                        fingerprintAvailableDeferred.reject(error);

                        $scope.$broadcast("$ionicView.beforeEnter");
                    });
                });
            });

            describe("when $stateParams.errorReason is TOKEN_EXPIRED", function () {

                beforeEach(function() {
                    $stateParams.errorReason = "TOKEN_EXPIRED";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should set the error", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.TOKEN_EXPIRED);
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is an object", function () {

                beforeEach(function() {
                    $stateParams.errorReason = {
                        randomProperty       : "Property value",
                        anotherRandomProperty: "Another property value"
                    };

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is empty string", function () {

                beforeEach(function() {
                    $stateParams.errorReason = "";

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is null", function () {

                beforeEach(function() {
                    $stateParams.errorReason = null;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is undefined", function () {

                beforeEach(function() {
                    delete $stateParams.errorReason;

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect($ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a app:cordovaPause event handler function that", function () {

            beforeEach(function () {
                ctrl.globalError = "an existing error.";
            });

            it("should set globalError property to false", function () {
                $rootScope.$broadcast("app:cordovaPause");
                $rootScope.$digest();

                expect(ctrl.globalError).toBe(false);
            });
        });

        describe("has a app:cordovaResume event handler function that", function () {

            beforeEach(function () {
                UserAuthorizationManager.verify.and.returnValue($q.resolve());
            });

            describe("when there is a fingerprint profile set", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;
                });

                describe("when the user is logging in", function () {

                    beforeEach(function () {
                        ctrl.isLoggingIn = true;
                        $rootScope.$broadcast("app:cordovaResume");
                        $rootScope.$digest();
                    });

                    it("should NOT start the fingerprint login process", function () {
                        expect(UserAuthorizationManager.verify).not.toHaveBeenCalled();
                    });
                });

                describe("when the user is NOT logging in", function () {

                    beforeEach(function () {
                        ctrl.isLoggingIn = false;
                        $rootScope.$broadcast("app:cordovaResume");
                        $rootScope.$digest();
                    });

                    it("should start the fingerprint login process", function () {
                        expect(UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                            method: globals.USER_AUTHORIZATION.TYPES.FINGERPRINT
                        }));
                    });
                });
            });

            describe("when there is NOT a fingerprint profile set", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;
                    $rootScope.$digest();
                });

                it("should NOT start the fingerprint login process", function () {
                    expect(UserAuthorizationManager.verify).not.toHaveBeenCalled();
                });
            });
        });

        describe("has a $cordovaKeyboard:show event handler function that", function () {

            beforeEach(function () {
                document.body.classList.remove("keyboard-open");
            });

            beforeEach(function () {
                $rootScope.$broadcast("$cordovaKeyboard:show");
                $rootScope.$digest();
            });

            it("should add the 'keyboard-open' class to the body", function () {
                expect(document.body.classList.contains("keyboard-open")).toBeTruthy();
            });
        });

        describe("has an logInUser function that", function () {

            beforeEach(function () {
                // clear Local Storage to start
                delete $localStorage.USERNAME;

                UserAuthorizationManager.verify.and.returnValue(authenticateDeferred.promise);

                this.userDetails = {
                    username: _.toLower(TestUtils.getRandomStringThatIsAlphaNumeric(10)),
                    password: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                _.set(ctrl, "user.username", this.userDetails.username);
            });

            describe("when using fingerprint authentication", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;
                    ctrl.fingerprintAuthAvailable    = true;
                    this.usingFingerprintAuth = true;
                    this.settingUpFingerprintAuth = false;
                    ctrl.logInUser(true);
                });

                it("should authorize the User", function () {
                    expect(UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                        clientId: this.userDetails.username,
                        method: globals.USER_AUTHORIZATION.TYPES.FINGERPRINT
                    }));
                });

                it("should NOT set vm.fingerprintProfileAvailable to false", function () {
                    expect(ctrl.fingerprintProfileAvailable).not.toBe(false);
                });

                it("should NOT call FingerprintProfileUtil.clearProfile with the expected value", function () {
                    expect(FingerprintProfileUtil.clearProfile).not.toHaveBeenCalled();
                });

                describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {
                    var errorObjectArg = {data: {message: "BAD_CREDENTIALS"}};

                    beforeEach(function () {
                        authenticateDeferred.reject(errorObjectArg);
                        $scope.$digest();
                    });

                    it("should set vm.fingerprintProfileAvailable to false", function () {
                        expect(ctrl.fingerprintProfileAvailable).toBe(false);
                    });

                    it("should call FingerprintProfileUtil.clearProfile with the expected value", function () {
                        expect(FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(this.userDetails.username);
                    });
                });

                describe("when authorizing", logInUserAuthTests);
            });

            describe("when NOT using fingerprint authentication", function () {

                beforeEach(function () {
                    this.usingFingerprintAuth = false;
                    this.settingUpFingerprintAuth = false;

                    _.set(ctrl, "user.password", this.userDetails.password);

                    ctrl.logInUser(false);
                });

                it("should authorize the User", function () {
                    expect(UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                        clientId: this.userDetails.username,
                        clientSecret: this.userDetails.password,
                        method: globals.USER_AUTHORIZATION.TYPES.SECRET
                    }));
                });

                it("should set vm.fingerprintProfileAvailable to false", function () {
                    expect(ctrl.fingerprintProfileAvailable).toBe(false);
                });

                it("should call FingerprintProfileUtil.clearProfile with the expected value", function () {
                    expect(FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(this.userDetails.username);
                });

                describe("when authorizing", logInUserAuthTests);
            });
        });

        function logInUserAuthTests() {

            it("should set globalError to false", function () {
                expect(ctrl.globalError).toBeFalsy();
            });

            it("should set timedOut to false", function () {
                expect(ctrl.timedOut).toBeFalsy();
            });

            describe("when the User is Authorized successfully", function () {

                beforeEach(function () {
                    //return a promise object and resolve it
                    authenticateDeferred.resolve();
                    $rootScope.$digest();
                });

                it("should call this.LoginManager.logIn", function () {
                    expect(this.LoginManager.logIn).toHaveBeenCalled();
                });

                describe("when FingerprintAuthTerms dialog is presented", function () {
                    it("should call AnalyticsUtil.trackEvent with the expected events", function () {
                        $rootScope.$emit( "FingerprintAuthTerms.accepted" );
                        $rootScope.$digest();
                        verifyEventTracked( config.ANALYTICS.events.acceptTerms );

                        $rootScope.$emit( "FingerprintAuthTerms.rejected" );
                        $rootScope.$digest();
                        verifyEventTracked( config.ANALYTICS.events.declineTerms );
                    });
                });

                describe("when the login completes successfully", function () {

                    beforeEach(function () {
                        spyOn($ionicHistory, "nextViewOptions");
                        FingerprintProfileUtil.getProfile.and.returnValue($q.resolve({clientSecret: this.userDetails.password}));

                        logInDeferred.resolve();
                    });

                    describe("when the Remember Me option is checked", function () {

                        beforeEach(function () {
                            ctrl.rememberMe = ctrl.rememberMeToggle = true;
                        });

                        it("should set the username in Local Storage", function () {
                            $scope.$digest();
                            expect($localStorage.USERNAME).toEqual(this.userDetails.username);
                        });

                        it("should store credentials in sessionCredentials service", function () {
                            $scope.$digest();

                            expect(sessionCredentials.set).toHaveBeenCalledWith({
                                clientId: this.userDetails.username,
                                clientSecret: this.userDetails.password
                            });
                        });

                        it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                            var eventId = ctrl.fingerprintProfileAvailable ? "successfulLoginBiometric" : "successfulLoginManual";
                            $scope.$digest();
                            verifyEventTracked(config.ANALYTICS.events[ eventId ]);
                        });

                        it("should call disable backing up to the login page", function () {
                            $scope.$digest();
                            expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                        });

                        it("should NOT have an error message", function () {
                            $scope.$digest();
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        describe("when there is a toState", function () {
                            var toState;

                            beforeEach(function () {
                                $stateParams.toState = toState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                                $scope.$digest();
                            });

                            it("should navigate to the given page", function () {
                                expect($state.go).toHaveBeenCalledWith(toState);
                            });
                        });

                        describe("when there is NOT a toState", function () {

                            beforeEach(function () {
                                delete $stateParams.toState;
                                $scope.$digest();
                            });

                            it("should navigate to the landing page", function () {
                                expect($state.go).toHaveBeenCalledWith("landing", {showFingerprintBanner: this.settingUpFingerprintAuth});
                            });
                        });
                    });

                    describe("when the Remember Me option is NOT checked", function () {

                        beforeEach(function () {
                            ctrl.rememberMe = ctrl.rememberMeToggle = false;
                        });

                        it("should Remove the username from Local Storage", function () {
                            $scope.$digest();
                            expect($localStorage.USERNAME).not.toBeDefined();
                        });

                        it("should store credentials in sessionCredentials service", function () {
                            $scope.$digest();

                            expect(sessionCredentials.set).toHaveBeenCalledWith({
                                clientId: this.userDetails.username,
                                clientSecret: this.userDetails.password
                            });
                        });

                        it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                            var eventId = ctrl.fingerprintProfileAvailable ? "successfulLoginBiometric" : "successfulLoginManual";
                            $scope.$digest();
                            verifyEventTracked(config.ANALYTICS.events[ eventId ]);
                        });

                        it("should call disable backing up to the login page", function () {
                            $scope.$digest();
                            expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                        });

                        it("should NOT have an error message", function () {
                            $scope.$digest();
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        describe("when there is a toState", function () {
                            var toState;

                            beforeEach(function () {
                                $stateParams.toState = toState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                                $scope.$digest();
                            });

                            it("should navigate to the given page", function () {
                                expect($state.go).toHaveBeenCalledWith(toState);
                            });
                        });

                        describe("when there is NOT a toState", function () {

                            beforeEach(function () {
                                delete $stateParams.toState;
                                $scope.$digest();
                            });

                            it("should navigate to the landing page", function () {
                                expect($state.go).toHaveBeenCalledWith("landing", {showFingerprintBanner: this.settingUpFingerprintAuth});
                            });
                        });
                    });

                });

                describe("when the login does NOT complete successfully", function () {

                    describe("when the user auth error reason is USER_CANCELED", function () {

                        beforeEach(function () {
                            this.errorObjectArg = {reason: globals.USER_AUTHORIZATION.ERRORS.USER_CANCELED};

                            //reject with an error message
                            logInDeferred.reject(this.errorObjectArg);
                            $scope.$digest();
                        });

                        it("should call this.LoginManager.logOut", function () {
                            expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                        });

                        it("should NOT have an error message", function () {
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        it("should NOT navigate away from the login page", function () {
                            expect($state.go).not.toHaveBeenCalled();
                        });

                        it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                            expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the user auth error reason is EXCEEDED_ATTEMPTS", function () {

                        beforeEach(function () {
                            this.errorObjectArg = {reason: globals.USER_AUTHORIZATION.ERRORS.EXCEEDED_ATTEMPTS};

                            //reject with an error message
                            logInDeferred.reject(this.errorObjectArg);
                            $scope.$digest();
                        });

                        it("should call this.LoginManager.logOut", function () {
                            expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                        });

                        it("should NOT have an error message", function () {
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        it("should NOT navigate away from the login page", function () {
                            expect($state.go).not.toHaveBeenCalled();
                        });

                        it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                            expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the user auth error reason is NOT ignored", function () {
                        var errorObjectArg = new Error("Something bad happened");

                        beforeEach(function () {
                            //reject with an error message
                            logInDeferred.reject(errorObjectArg);
                            $scope.$digest();
                        });

                        it("should call this.LoginManager.logOut", function () {
                            expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                        });

                        it("should have an error message", function () {
                            expect(ctrl.globalError).toEqual(config.serverErrors.DEFAULT);
                        });

                        it("should NOT navigate away from the login page", function () {
                            expect($state.go).not.toHaveBeenCalled();
                        });

                        it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                            verifyEventTracked(config.ANALYTICS.events.wrongCredentialsStatus);
                        });
                    });
                });
            });

            describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {

                var errorObjectArg = {data: {message: "BAD_CREDENTIALS"}};

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(_.get(config.serverErrors, this.usingFingerprintAuth ? "PASSWORD_CHANGED" : "DEFAULT"));
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(_.get(config.ANALYTICS.events, this.usingFingerprintAuth ? "passwordChangedStatus" : "wrongCredentialsStatus"));
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_NOT_ACTIVE error", function () {

                var errorObjectArg = {data: {message: "USER_NOT_ACTIVE"}};

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.USER_NOT_ACTIVE);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(config.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_ACCEPT_TERMS error", function () {

                var errorObjectArg = {data: {message: "USER_MUST_ACCEPT_TERMS"}};

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.USER_MUST_ACCEPT_TERMS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(config.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_SETUP_SECURITY_QUESTIONS error", function () {

                var errorObjectArg = {data: {message: "USER_MUST_SETUP_SECURITY_QUESTIONS"}};

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.USER_MUST_SETUP_SECURITY_QUESTIONS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(config.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a PASSWORD_EXPIRED error", function () {

                var errorObjectArg = {data: {message: "PASSWORD_EXPIRED"}};

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.PASSWORD_EXPIRED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_LOCKED error", function () {

                var errorObjectArg = {data: {message: "USER_LOCKED"}};

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.USER_LOCKED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(config.ANALYTICS.events.lockedPasswordStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a AUTHORIZATION_FAILED error", function () {

                var errorObjectArg = {data: {message: "AUTHORIZATION_FAILED"}};

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.AUTHORIZATION_FAILED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(config.ANALYTICS.events.accountNotReadyStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a server error", function () {

                var errorObjectArg = {data: {message: TestUtils.getRandomStringThatIsAlphaNumeric(10)}};

                beforeEach(function () {
                    Network.isServerConnectionError.and.returnValue(true);

                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.CONNECTION_ERROR);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(config.ANALYTICS.events.connectionErrorStatus);
                });
            });

            describe("when the User is NOT Authenticated successfully with an error reason of TERMS_LOG_FAILED", function () {

                beforeEach(function () {
                    this.errorObjectArg = {reason: globals.USER_AUTHORIZATION.ERRORS.TERMS_LOG_FAILED};

                    //reject with an error message
                    authenticateDeferred.reject(this.errorObjectArg);
                    $scope.$digest();
                });

                it("should call this.LoginManager.logOut", function () {
                    expect(this.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(config.serverErrors.CONNECTION_ERROR);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(config.ANALYTICS.events.connectionErrorStatus);
                });
            });
        }

        describe("has an isKeyboardVisible function that", function () {

            describe("when Cordova is available", function () {

                beforeEach(function () {
                    this.PlatformUtil.platformHasCordova.and.returnValue(true);
                });

                describe("when the keyboard is visible", function () {

                    beforeEach(function () {
                        $cordovaKeyboard.isVisible.and.returnValue(true);
                    });

                    it("should return true", function () {
                        expect(ctrl.isKeyboardVisible()).toBeTruthy();
                    });
                });

                describe("when the keyboard is NOT visible", function () {

                    beforeEach(function () {
                        $cordovaKeyboard.isVisible.and.returnValue(false);
                    });

                    it("should return false", function () {
                        expect(ctrl.isKeyboardVisible()).toBeFalsy();
                    });
                });
            });

            describe("when Cordova is NOT available", function () {

                beforeEach(function () {
                    this.PlatformUtil.platformHasCordova.and.returnValue(false);
                });

                it("should return false", function () {
                    expect(ctrl.isKeyboardVisible()).toBeFalsy();
                });
            });
        });

        describe("has a verifyFingerprintRemoval function that", function () {
            var model;

            describe("when a fingerprint profile is available", function () {
                var platform,
                    confirmDeferred,
                    username,
                    password,
                    result;

                beforeEach(function () {
                    platform = TestUtils.getRandomBoolean() ? "android" : "ios";
                    confirmDeferred = $q.defer();

                    this.PlatformUtil.getPlatform.and.returnValue(platform);
                    $cordovaDialogs.confirm.and.returnValue(confirmDeferred.promise);
                });

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;
                    ctrl.user.username = username = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    ctrl.user.password = password = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                describe("when the model is 'rememberMe'", function () {

                    beforeEach(function () {
                        model = "rememberMe";

                        ctrl.verifyFingerprintRemoval(model);
                    });

                    it("should set rememberMeToggle to true", function () {
                        expect(ctrl.rememberMeToggle).toBe(true);
                    });

                    describe("should behave such that", commonTests);
                });

                describe("when the model is NOT 'rememberMe'", function () {

                    beforeEach(function () {
                        model = TestUtils.getRandomStringThatIsAlphaNumeric(12);

                        ctrl.verifyFingerprintRemoval(model);
                    });

                    describe("should behave such that", commonTests);
                });

                function commonTests() {

                    it("should call $cordovaDialogs.confirm with the expected values", function () {
                        expect($cordovaDialogs.confirm).toHaveBeenCalledWith(
                            getFingerprintWarningPromptText(platform),
                            config.touchId.warningPrompt.title, [
                                config.touchId.warningPrompt.buttons.ok,
                                config.touchId.warningPrompt.buttons.cancel
                            ]
                        );
                    });

                    describe("when the user confirms", function () {

                        beforeEach(function () {
                            result = 1;
                            confirmDeferred.resolve(result);
                            $rootScope.$digest();
                        });

                        it("should call FingerprintProfileUtil.clearProfile", function () {
                            expect(FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(username);
                        });

                        it("should clear the form", function () {
                            expect(ctrl.rememberMe).toBe(false);
                            expect(ctrl.rememberMeToggle).toBe(false);
                            expect(ctrl.user.username).toEqual("");
                            expect(ctrl.user.password).toEqual("");
                            expect($localStorage.USERNAME).not.toBeDefined();
                        });
                    });

                    describe("when the user rejects", function () {

                        beforeEach(function () {
                            result = 0;
                            confirmDeferred.resolve(result);
                            $rootScope.$digest();
                        });

                        it("should NOT call FingerprintProfileUtil.clearProfile", function () {
                            expect(FingerprintProfileUtil.clearProfile).not.toHaveBeenCalled();
                        });

                        it("should NOT clear the form", function () {
                            expect(ctrl.user.username).not.toEqual("");
                            expect(ctrl.user.password).not.toEqual("");
                        });
                    });
                }

                function getFingerprintWarningPromptText(platform) {
                    switch (_.toLower(platform)) {
                        case "android":
                            return _.get(config, "touchId.warningPrompt.messageAndroid");
                        case "ios":
                            return _.get(config, "touchId.warningPrompt.messageIos");
                        default:
                            return _.get(config, "touchId.warningPrompt.messageAndroid");
                    }
                }
            });

            describe("when a fingerprint profile is NOT available", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = false;
                    ctrl.rememberMeToggle = TestUtils.getRandomBoolean();
                });

                describe("when the model is 'rememberMe'", function () {

                    beforeEach(function () {
                        model = "rememberMe";

                        ctrl.verifyFingerprintRemoval(model);
                    });

                    it("should set rememberMe to the value of rememberMeToggle", function () {
                        expect(ctrl.rememberMe).toEqual(ctrl.rememberMeToggle);
                    });
                });
            });
        });

        describe("has a getFingerprintDisabledLabel function that", function () {
            var platform;

            beforeEach(function () {
                platform = TestUtils.getRandomBoolean() ? "android" : "ios";

                this.PlatformUtil.getPlatform.and.returnValue(platform);
            });

            it("should return the correct label for the current platform", function () {
                expect(ctrl.getFingerprintDisabledLabel(platform)).toEqual(getFingerprintDisabledLabel(platform));
            });

            function getFingerprintDisabledLabel(platform) {
                switch (_.toLower(platform)) {
                    case "android":
                        return _.get(config, "touchId.disabled.labelAndroid");
                    case "ios":
                        return _.get(config, "touchId.disabled.labelIos");
                    default:
                        return _.get(config, "touchId.disabled.labelAndroid");
                }
            }
        });
    });

    function getFingerprintSettingsPromptText(platform) {
        switch (_.toLower(platform)) {
            case "android":
                return _.get(config, "touchId.settingsPrompt.messageAndroid");
            case "ios":
                return _.get(config, "touchId.settingsPrompt.messageIos");
            default:
                return _.get(config, "touchId.settingsPrompt.messageAndroid");
        }
    }

    function verifyEventTracked(event) {
        expect(self.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());
