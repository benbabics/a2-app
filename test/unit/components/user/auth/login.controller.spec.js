(function () {
    "use strict";

    var ctrl,
        self,
        mocks = {};

    describe("A Login Controller", function () {

        module.sharedInjector();

        beforeAll(function () {
            this.includeDependencies({mocks: mocks}, this);

            // mock dependencies
            mocks.AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["authenticate"]);
            mocks.$state = jasmine.createSpyObj("state", ["go"]);
            mocks.$cordovaKeyboard = jasmine.createSpyObj("$cordovaKeyboard", ["isVisible"]);
            mocks.Fingerprint = jasmine.createSpyObj("Fingerprint", ["isAvailable"]);
            mocks.UserAuthorizationManager = jasmine.createSpyObj("UserAuthorizationManager", ["verify"]);
            mocks.FingerprintProfileUtil = jasmine.createSpyObj("FingerprintProfileUtil", ["getProfile", "clearProfile"]);
            mocks.sessionCredentials = jasmine.createSpyObj( "sessionCredentials", ["set"] );
            mocks.$cordovaDialogs = jasmine.createSpyObj("$cordovaDialogs", ["confirm"]);
            mocks.cordovaPluginsKeyboard = jasmine.createSpyObj("cordova.plugins.Keyboard", ["disableScroll"]);
            mocks.cordovaPluginSettings = jasmine.createSpyObj("cordova.plugins.settings", ["openSetting", "open"]);
            mocks.Network = jasmine.createSpyObj("Network", ["isServerConnectionError"]);
            mocks.FlowUtil = jasmine.createSpyObj("FlowUtil", ["onPageLeave"]);

            _.set(window, "cordova.plugins.settings", mocks.cordovaPluginSettings);
            _.set(window, "cordova.plugins.Keyboard", mocks.cordovaPluginsKeyboard);

            inject(function (_$rootScope_, $controller, _$ionicHistory_, _$interval_, _$q_, BrandAssetModel, UserAccountModel, UserModel, _wexTruncateStringFilter_, _globals_) {
                mocks.$ionicHistory = _$ionicHistory_;
                mocks.$scope = _$rootScope_.$new();
                mocks.$q = _$q_;
                mocks.$rootScope = _$rootScope_;
                mocks.$interval = _$interval_;
                mocks.globals = _globals_;
                mocks.$stateParams = {};
                mocks.$localStorage = {};
                mocks.wexTruncateStringFilter = _wexTruncateStringFilter_;

                ctrl = $controller("LoginController", {
                    $localStorage           : mocks.$localStorage,
                    $scope                  : mocks.$scope,
                    $state                  : mocks.$state,
                    $stateParams            : mocks.$stateParams,
                    $cordovaDialogs         : mocks.$cordovaDialogs,
                    $cordovaKeyboard        : mocks.$cordovaKeyboard,
                    AuthenticationManager   : mocks.AuthenticationManager,
                    Fingerprint             : mocks.Fingerprint,
                    UserAuthorizationManager: mocks.UserAuthorizationManager,
                    FingerprintProfileUtil  : mocks.FingerprintProfileUtil,
                    sessionCredentials      : mocks.sessionCredentials,
                    Network                 : mocks.Network,
                    FlowUtil                : mocks.FlowUtil
                });
            });
        });

        beforeEach(function () {
            self = this;

            //setup spies:
            mocks.authenticateDeferred = mocks.$q.defer();
            mocks.logInDeferred = mocks.$q.defer();
            mocks.fingerprintAvailableDeferred = mocks.$q.defer();
            mocks.LoginManager.logIn.and.returnValue(mocks.logInDeferred.promise);
            mocks.Fingerprint.isAvailable.and.returnValue(mocks.fingerprintAvailableDeferred.promise);

            //reinitialize controller values
            ctrl.config = mocks.globals.USER_LOGIN.CONFIG;
            ctrl.fingerprintAuthAvailable = false;
            ctrl.fingerprintProfileAvailable = false;
            ctrl.isLoggingIn = false;
            ctrl.setupFingerprintAuth = false;
            ctrl.rememberMe = false;
            ctrl.timedOut = false;
            ctrl.user = {password: ""};
        });

        afterEach(function () {
            var property;

            //reset all mocks
            _.forEach(mocks, TestUtils.resetMock);

            //reset local storage and state params
            for (property in mocks.$localStorage) {
                delete mocks.$localStorage[property];
            }

            for (property in mocks.$stateParams) {
                delete mocks.$stateParams[property];
            }

            self = null;
            property = null;
        });

        afterAll(function () {
            mocks = null;
            ctrl = null;
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                spyOn(mocks.$ionicHistory, "clearHistory");

                //setup an existing values to test them being modified
                ctrl.globalError = "This is a previous error";

                mocks.UserAuthorizationManager.verify.and.returnValue(mocks.$q.resolve());
            });

            it("should set timedOut to $stateParams.timedOut", function () {
                mocks.$stateParams.timedOut = TestUtils.getRandomBoolean();
                mocks.$scope.$broadcast("$ionicView.beforeEnter");
                mocks.$rootScope.$digest();

                expect(ctrl.timedOut).toEqual(mocks.$stateParams.timedOut);
            });

            describe("when the Username is stored in Local Storage", function () {

                beforeEach(function() {
                    mocks.$localStorage.USERNAME = TestUtils.getRandomStringThatIsAlphaNumeric(20);

                    // clear the username field so we can validate what it gets set to
                    ctrl.user.username = null;

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect(mocks.$ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should set the username with the value from Local Storage", function () {
                    expect(ctrl.user.username).toEqual(mocks.$localStorage.USERNAME);
                });

                it("should set the rememberMe option to true", function () {
                    expect(ctrl.rememberMe).toBeTruthy();
                });

            });

            describe("when the Username is NOT stored in Local Storage", function () {

                beforeEach(function() {
                    delete mocks.$localStorage.USERNAME;

                    // clear the username field so we can validate what it gets set to
                    ctrl.user.username = null;

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect(mocks.$ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should NOT set the username", function () {
                    expect(ctrl.user.username).toBeNull();
                });

                it("should set the rememberMe option to false", function () {
                    expect(ctrl.rememberMe).toBeFalsy();
                });

            });

            describe("when fingerprint authentication is available", function () {

                beforeEach(function () {
                    mocks.fingerprintAvailableDeferred.resolve();

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                describe("when the user has a stored fingerprint profile", function () {

                    beforeEach(function () {
                        mocks.FingerprintProfileUtil.getProfile.and.returnValue(mocks.$q.resolve());
                    });

                    it("should set vm.fingerprintProfileAvailable to true", function () {
                        mocks.$rootScope.$digest();

                        expect(ctrl.fingerprintProfileAvailable).toBe(true);
                    });

                    it("should set vm.fingerprintAuthAvailable to true", function () {
                        mocks.$rootScope.$digest();

                        expect(ctrl.fingerprintAuthAvailable).toBe(true);
                    });

                    describe("when the user was logged out", function () {

                        beforeEach(function () {
                            mocks.$stateParams.logOut = true;

                            mocks.$rootScope.$digest();
                        });

                        //TODO - Figure out why this fails when run with other tests
                        xit("should NOT start the fingerprint login process", function () {
                            expect(mocks.UserAuthorizationManager.verify).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the user was NOT logged out", function () {

                        beforeEach(function () {
                            mocks.$stateParams.logOut = false;

                            mocks.$rootScope.$digest();
                        });

                        it("should start the fingerprint login process", function () {
                            expect(mocks.UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                                method: mocks.globals.USER_AUTHORIZATION.TYPES.FINGERPRINT
                            }));
                        });
                    });
                });

                describe("when the user does NOT have a stored fingerprint profile", function () {

                    beforeEach(function () {
                        mocks.FingerprintProfileUtil.getProfile.and.returnValue(mocks.$q.reject());
                        mocks.$rootScope.$digest();
                    });

                    it("should NOT set vm.fingerprintProfileAvailable to true", function () {
                        expect(ctrl.fingerprintProfileAvailable).toBe(false);
                    });

                    it("should set vm.fingerprintAuthAvailable to true", function () {
                        expect(ctrl.fingerprintAuthAvailable).toBe(true);
                    });

                    it("should NOT start the fingerprint login process", function () {
                        expect(mocks.UserAuthorizationManager.verify).not.toHaveBeenCalled();
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

                afterAll(function () {
                    error = null;
                });

                describe("when the device supports fingerprint auth", function () {
                    var platform;

                    afterAll(function () {
                        platform = null;
                    });

                    describe("when the platform is Android", function () {

                        beforeEach(function () {
                            platform = "android";
                            mocks.PlatformUtil.getPlatform = jasmine.createSpy("getPlatform").and.returnValue(platform);
                        });

                        describe("will behave such that", commonTests);
                    });

                    describe("when the platform is NOT Android", function () {
                        beforeEach(function () {
                            platform = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                            mocks.PlatformUtil.getPlatform = jasmine.createSpy("getPlatform").and.returnValue(platform);
                        });

                        describe("will behave such that", commonTests);
                    });

                    function commonTests() {
                        var confirmDeferred;

                        beforeEach(function () {
                            confirmDeferred = mocks.$q.defer();
                            error.isDeviceSupported = true;

                            mocks.$cordovaDialogs.confirm.and.returnValue(confirmDeferred.promise);

                            mocks.fingerprintAvailableDeferred.reject(error);

                            mocks.$scope.$broadcast("$ionicView.beforeEnter");
                            mocks.$rootScope.$digest();
                        });

                        afterAll(function () {
                            confirmDeferred = null;
                        });

                        it("should call FingerprintProfileUtil.clearProfile with the expected value", function () {
                            expect(mocks.FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(ctrl.user.username);
                        });

                        it("should call $cordovaDialogs.confirm with the expected values", function () {
                            expect(mocks.$cordovaDialogs.confirm).toHaveBeenCalledWith(
                                getFingerprintSettingsPromptText(platform),
                                mocks.globals.USER_LOGIN.CONFIG.touchId.settingsPrompt.title, [
                                    mocks.globals.USER_LOGIN.CONFIG.touchId.settingsPrompt.buttons.settings,
                                    mocks.globals.USER_LOGIN.CONFIG.touchId.settingsPrompt.buttons.cancel
                                ]);
                        });

                        describe("when the user confirms the dialog", function () {

                            beforeEach(function () {
                                confirmDeferred.resolve(1);
                                mocks.$rootScope.$digest();
                            });

                            it("should open the platform's setting menu", function () {
                                testPlatformSettingsWereOpened(platform);
                            });
                        });

                        describe("when the user cancels the dialog", function () {

                            beforeEach(function () {
                                confirmDeferred.resolve(0);
                                mocks.$rootScope.$digest();
                            });

                            it("should NOT open the platform's setting menu", function () {
                                testPlatformSettingsWereNotOpened(platform);
                            });
                        });

                        function testPlatformSettingsWereOpened(platform) {
                            switch (_.toLower(platform)) {
                                case "android":
                                    expect(mocks.cordovaPluginSettings.openSetting).toHaveBeenCalledWith("security");
                                    break;
                                default:
                                    expect(mocks.cordovaPluginSettings.open).toHaveBeenCalledWith();
                            }
                        }

                        function testPlatformSettingsWereNotOpened(platform) {
                            switch (_.toLower(platform)) {
                                case "android":
                                    expect(mocks.cordovaPluginSettings.openSetting).not.toHaveBeenCalled();
                                    break;
                                default:
                                    expect(mocks.cordovaPluginSettings.open).not.toHaveBeenCalled();
                            }
                        }
                    }
                });

                describe("when the device does NOT support fingerprint auth", function () {

                    beforeEach(function () {
                        error.isDeviceSupported = false;

                        mocks.fingerprintAvailableDeferred.reject(error);

                        mocks.$scope.$broadcast("$ionicView.beforeEnter");
                    });
                });
            });

            describe("when $stateParams.errorReason is TOKEN_EXPIRED", function () {

                beforeEach(function() {
                    mocks.$stateParams.errorReason = "TOKEN_EXPIRED";

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect(mocks.$ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should set the error", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.TOKEN_EXPIRED);
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is an object", function () {

                beforeEach(function() {
                    mocks.$stateParams.errorReason = {
                        randomProperty       : "Property value",
                        anotherRandomProperty: "Another property value"
                    };

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect(mocks.$ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is empty string", function () {

                beforeEach(function() {
                    mocks.$stateParams.errorReason = "";

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect(mocks.$ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is null", function () {

                beforeEach(function() {
                    mocks.$stateParams.errorReason = null;

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect(mocks.$ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when $stateParams.errorReason is undefined", function () {

                beforeEach(function() {
                    delete mocks.$stateParams.errorReason;

                    mocks.$scope.$broadcast("$ionicView.beforeEnter");
                });

                it("should clear the ionic history", function () {
                    expect(mocks.$ionicHistory.clearHistory).toHaveBeenCalledWith();
                });

                it("should clear previous error", function () {
                    expect(ctrl.globalError).toBeFalsy();
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a app:cordovaPause event handler function that", function () {

            beforeEach(function () {
                ctrl.globalError = "an existing error.";
            });

            it("should set globalError property to false", function () {
                mocks.$rootScope.$broadcast("app:cordovaPause");
                mocks.$rootScope.$digest();

                expect(ctrl.globalError).toBe(false);
            });
        });

        describe("has a app:cordovaResume event handler function that", function () {

            beforeEach(function () {
                mocks.UserAuthorizationManager.verify.and.returnValue(mocks.$q.resolve());
            });

            describe("when there is a fingerprint profile set", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;
                });

                describe("when the user is logging in", function () {

                    beforeEach(function () {
                        ctrl.isLoggingIn = true;
                        mocks.$rootScope.$broadcast("app:cordovaResume");
                        mocks.$rootScope.$digest();
                    });

                    it("should NOT start the fingerprint login process", function () {
                        expect(mocks.UserAuthorizationManager.verify).not.toHaveBeenCalled();
                    });
                });

                describe("when the user is NOT logging in", function () {

                    beforeEach(function () {
                        ctrl.isLoggingIn = false;
                        mocks.$rootScope.$broadcast("app:cordovaResume");
                        mocks.$rootScope.$digest();
                    });

                    it("should start the fingerprint login process", function () {
                        expect(mocks.UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                            method: mocks.globals.USER_AUTHORIZATION.TYPES.FINGERPRINT
                        }));
                    });
                });
            });

            describe("when there is NOT a fingerprint profile set", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;
                    mocks.$rootScope.$digest();
                });

                it("should NOT start the fingerprint login process", function () {
                    expect(mocks.UserAuthorizationManager.verify).not.toHaveBeenCalled();
                });
            });
        });

        // todo $cordovaKeyboard:show event has been replaced with window native.keyboardshow / native.keyboardhide event
        xdescribe("has a $cordovaKeyboard:show event handler function that", function () {

            beforeEach(function () {
                document.body.classList.remove("keyboard-open");
            });

            beforeEach(function () {
                mocks.$rootScope.$broadcast("$cordovaKeyboard:show");
                mocks.$rootScope.$digest();
            });

            it("should add the 'keyboard-open' class to the body", function () {
                expect(document.body.classList.contains("keyboard-open")).toBeTruthy();
            });
        });

        describe("has an logInUser function that", function () {

            beforeEach(function () {
                // clear Local Storage to start
                delete mocks.$localStorage.USERNAME;

                mocks.UserAuthorizationManager.verify.and.returnValue(mocks.authenticateDeferred.promise);

                self.userDetails = {
                    username: _.toLower(TestUtils.getRandomStringThatIsAlphaNumeric(10)),
                    password: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                _.set(ctrl, "user.username", self.userDetails.username);
            });

            describe("when using fingerprint authentication", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = false;
                    ctrl.fingerprintAuthAvailable    = true;
                    self.usingFingerprintAuth = true;
                    self.settingUpFingerprintAuth = true;
                    ctrl.logInUser(true);
                    mocks.$rootScope.$digest();
                });

                it("should call FingerprintProfileUtil.clearProfile with the expected value", function () {
                    expect(mocks.FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(self.userDetails.username);
                });

                it("should authorize the User", function () {
                    expect(mocks.UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                        clientId: self.userDetails.username,
                        method: mocks.globals.USER_AUTHORIZATION.TYPES.FINGERPRINT
                    }));
                });

                describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {
                    var errorObjectArg = {data: {message: "BAD_CREDENTIALS"}};

                    beforeEach(function () {
                        mocks.authenticateDeferred.reject(errorObjectArg);
                        mocks.$scope.$digest();
                    });

                    afterAll(function () {
                        errorObjectArg = null;
                    });

                    it("should set vm.fingerprintProfileAvailable to false", function () {
                        expect(ctrl.fingerprintProfileAvailable).toBe(false);
                    });

                    it("should call FingerprintProfileUtil.clearProfile with the expected value", function () {
                        expect(mocks.FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(self.userDetails.username);
                    });
                });

                describe("when authorizing", logInUserAuthTests);
            });

            describe("when NOT using fingerprint authentication", function () {

                beforeEach(function () {
                    self.usingFingerprintAuth = false;
                    self.settingUpFingerprintAuth = false;

                    _.set(ctrl, "user.password", self.userDetails.password);

                    ctrl.logInUser(false);
                    mocks.$rootScope.$digest();
                });

                it("should authorize the User", function () {
                    expect(mocks.UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                        clientId: self.userDetails.username,
                        clientSecret: self.userDetails.password,
                        method: mocks.globals.USER_AUTHORIZATION.TYPES.SECRET
                    }));
                });

                it("should set vm.fingerprintProfileAvailable to false", function () {
                    expect(ctrl.fingerprintProfileAvailable).toBe(false);
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
                    mocks.authenticateDeferred.resolve();
                    mocks.$rootScope.$digest();
                });

                it("should call LoginManager.logIn", function () {
                    expect(mocks.LoginManager.logIn).toHaveBeenCalled();
                });

                describe("when FingerprintAuthTerms dialog is presented", function () {

                    it("should call AnalyticsUtil.trackEvent with the expected events", function () {
                        mocks.$rootScope.$emit( "FingerprintAuthTerms.accepted" );
                        mocks.$rootScope.$digest();
                        verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.acceptTerms);

                        mocks.$rootScope.$emit( "FingerprintAuthTerms.rejected" );
                        mocks.$rootScope.$digest();
                        verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.declineTerms);
                    });
                });

                describe("when the login completes successfully", function () {

                    beforeEach(function () {
                        spyOn(mocks.$ionicHistory, "nextViewOptions");
                        mocks.FingerprintProfileUtil.getProfile.and.returnValue(mocks.$q.resolve({clientSecret: self.userDetails.password}));

                        mocks.logInDeferred.resolve();
                    });

                    describe("when the Remember Me option is checked", function () {

                        beforeEach(function () {
                            ctrl.rememberMe = true;
                        });

                        it("should set the username in Local Storage", function () {
                            mocks.$scope.$digest();
                            expect(mocks.$localStorage.USERNAME).toEqual(self.userDetails.username);
                        });

                        it("should store credentials in sessionCredentials service", function () {
                            mocks.$scope.$digest();

                            expect(mocks.sessionCredentials.set).toHaveBeenCalledWith({
                                clientId: self.userDetails.username,
                                clientSecret: self.userDetails.password
                            });
                        });

                        it("should call self.AnalyticsUtil.trackEvent with the expected event", function () {
                            var eventId = ctrl.fingerprintProfileAvailable ? "successfulLoginBiometric" : "successfulLoginManual";
                            mocks.$scope.$digest();
                            verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events[eventId]);
                        });

                        it("should call disable backing up to the login page", function () {
                            mocks.$scope.$digest();
                            expect(mocks.$ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                        });

                        it("should NOT have an error message", function () {
                            mocks.$scope.$digest();
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        describe("when there is a toState", function () {
                            var toState;

                            beforeEach(function () {
                                mocks.$stateParams.toState = toState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                                mocks.$scope.$digest();
                            });

                            afterAll(function () {
                                toState = null;
                            });

                            it("should navigate to the given page", function () {
                                expect(mocks.$state.go).toHaveBeenCalledWith(toState);
                            });
                        });

                        describe("when there is NOT a toState", function () {

                            beforeEach(function () {
                                delete mocks.$stateParams.toState;
                                mocks.$scope.$digest();
                            });

                            it("should navigate to the landing page", function () {
                                expect(mocks.$state.go).toHaveBeenCalledWith("landing", {showFingerprintBanner: self.settingUpFingerprintAuth});
                            });
                        });
                    });

                    describe("when the Remember Me option is NOT checked", function () {

                        beforeEach(function () {
                            ctrl.rememberMe = false;
                        });

                        it("should Remove the username from Local Storage", function () {
                            mocks.$scope.$digest();
                            expect(mocks.$localStorage.USERNAME).not.toBeDefined();
                        });

                        it("should store credentials in sessionCredentials service", function () {
                            mocks.$scope.$digest();

                            expect(mocks.sessionCredentials.set).toHaveBeenCalledWith({
                                clientId: self.userDetails.username,
                                clientSecret: self.userDetails.password
                            });
                        });

                        it("should call self.AnalyticsUtil.trackEvent with the expected event", function () {
                            var eventId = ctrl.fingerprintProfileAvailable ? "successfulLoginBiometric" : "successfulLoginManual";
                            mocks.$scope.$digest();
                            verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events[eventId]);
                        });

                        it("should call disable backing up to the login page", function () {
                            mocks.$scope.$digest();
                            expect(mocks.$ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                        });

                        it("should NOT have an error message", function () {
                            mocks.$scope.$digest();
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        describe("when there is a toState", function () {
                            var toState;

                            beforeEach(function () {
                                mocks.$stateParams.toState = toState = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                                mocks.$scope.$digest();
                            });

                            afterAll(function () {
                                toState = null;
                            });

                            it("should navigate to the given page", function () {
                                expect(mocks.$state.go).toHaveBeenCalledWith(toState);
                            });
                        });

                        describe("when there is NOT a toState", function () {

                            beforeEach(function () {
                                delete mocks.$stateParams.toState;
                                mocks.$scope.$digest();
                            });

                            it("should navigate to the landing page", function () {
                                expect(mocks.$state.go).toHaveBeenCalledWith("landing", {showFingerprintBanner: self.settingUpFingerprintAuth});
                            });
                        });
                    });

                });

                describe("when the login does NOT complete successfully", function () {

                    describe("when the user auth error reason is USER_CANCELED", function () {

                        beforeEach(function () {
                            self.errorObjectArg = {reason: mocks.globals.USER_AUTHORIZATION.ERRORS.USER_CANCELED};

                            //reject with an error message
                            mocks.logInDeferred.reject(self.errorObjectArg);
                            mocks.$scope.$digest();
                        });

                        it("should call LoginManager.logOut", function () {
                            expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                        });

                        it("should NOT have an error message", function () {
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        it("should NOT navigate away from the login page", function () {
                            expect(mocks.$state.go).not.toHaveBeenCalled();
                        });

                        it("should NOT call AnalyticsUtil.trackEvent", function () {
                            expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the user auth error reason is EXCEEDED_ATTEMPTS", function () {

                        beforeEach(function () {
                            self.errorObjectArg = {reason: mocks.globals.USER_AUTHORIZATION.ERRORS.EXCEEDED_ATTEMPTS};

                            //reject with an error message
                            mocks.logInDeferred.reject(self.errorObjectArg);
                            mocks.$scope.$digest();
                        });

                        it("should call LoginManager.logOut", function () {
                            expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                        });

                        it("should NOT have an error message", function () {
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        it("should NOT navigate away from the login page", function () {
                            expect(mocks.$state.go).not.toHaveBeenCalled();
                        });

                        it("should NOT call AnalyticsUtil.trackEvent", function () {
                            expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                        });
                    });

                    describe("when the user auth error reason is NOT ignored", function () {
                        var errorObjectArg = new Error("Something bad happened");

                        beforeEach(function () {
                            //reject with an error message
                            mocks.logInDeferred.reject(errorObjectArg);
                            mocks.$scope.$digest();
                        });

                        afterAll(function () {
                            errorObjectArg = null;
                        });

                        it("should call LoginManager.logOut", function () {
                            expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                        });

                        it("should have an error message", function () {
                            expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.DEFAULT);
                        });

                        it("should NOT navigate away from the login page", function () {
                            expect(mocks.$state.go).not.toHaveBeenCalled();
                        });

                        it("should call this.AnalyticsUtil.trackEvent with the expected event", function () {
                            verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.wrongCredentialsStatus);
                        });
                    });
                });
            });

            describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {

                var errorObjectArg = {data: {message: "BAD_CREDENTIALS"}};

                beforeEach(function () {
                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(_.get(mocks.globals.USER_LOGIN.CONFIG.serverErrors, self.usingFingerprintAuth && !self.settingUpFingerprintAuth ? "PASSWORD_CHANGED" : "DEFAULT"));
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call self.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(_.get(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events, self.usingFingerprintAuth && !self.settingUpFingerprintAuth ? "passwordChangedStatus" : "wrongCredentialsStatus"));
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_NOT_ACTIVE error", function () {

                var errorObjectArg = {data: {message: "USER_NOT_ACTIVE"}};

                beforeEach(function () {
                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.USER_NOT_ACTIVE);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_ACCEPT_TERMS error", function () {

                var errorObjectArg = {data: {message: "USER_MUST_ACCEPT_TERMS"}};

                beforeEach(function () {
                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.USER_MUST_ACCEPT_TERMS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call self.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_SETUP_SECURITY_QUESTIONS error", function () {

                var errorObjectArg = {data: {message: "USER_MUST_SETUP_SECURITY_QUESTIONS"}};

                beforeEach(function () {
                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.USER_MUST_SETUP_SECURITY_QUESTIONS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call self.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a PASSWORD_EXPIRED error", function () {

                var errorObjectArg = {data: {message: "PASSWORD_EXPIRED"}};

                beforeEach(function () {
                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.PASSWORD_EXPIRED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(mocks.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_LOCKED error", function () {

                var errorObjectArg = {data: {message: "USER_LOCKED"}};

                beforeEach(function () {
                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.USER_LOCKED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.lockedPasswordStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a AUTHORIZATION_FAILED error", function () {

                var errorObjectArg = {data: {message: "AUTHORIZATION_FAILED"}};

                beforeEach(function () {
                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.AUTHORIZATION_FAILED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call self.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.accountNotReadyStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a server error", function () {

                var errorObjectArg = {data: {message: TestUtils.getRandomStringThatIsAlphaNumeric(10)}};

                beforeEach(function () {
                    mocks.Network.isServerConnectionError.and.returnValue(true);

                    //reject with an error message
                    mocks.authenticateDeferred.reject(errorObjectArg);
                    mocks.$scope.$digest();
                });

                afterEach(function () {
                    mocks.Network.isServerConnectionError.and.returnValue(false);
                });

                afterAll(function () {
                    errorObjectArg = null;
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.CONNECTION_ERROR);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.connectionErrorStatus);
                });
            });

            describe("when the User is NOT Authenticated successfully with an error reason of TERMS_LOG_FAILED", function () {

                beforeEach(function () {
                    self.errorObjectArg = {reason: mocks.globals.USER_AUTHORIZATION.ERRORS.TERMS_LOG_FAILED};

                    //reject with an error message
                    mocks.authenticateDeferred.reject(self.errorObjectArg);
                    mocks.$scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(mocks.LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mocks.globals.USER_LOGIN.CONFIG.serverErrors.CONNECTION_ERROR);
                });

                it("should NOT navigate away from the login page", function () {
                    expect(mocks.$state.go).not.toHaveBeenCalled();
                });

                it("should call self.AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mocks.globals.USER_LOGIN.CONFIG.ANALYTICS.events.connectionErrorStatus);
                });
            });
        }

        describe("has an isKeyboardVisible function that", function () {

            describe("when Cordova is available", function () {

                beforeEach(function () {
                    mocks.PlatformUtil.platformHasCordova.and.returnValue(true);
                });

                describe("when the keyboard is visible", function () {

                    beforeEach(function () {
                        mocks.$cordovaKeyboard.isVisible.and.returnValue(true);
                    });

                    it("should return true", function () {
                        expect(ctrl.isKeyboardVisible()).toBeTruthy();
                    });
                });

                describe("when the keyboard is NOT visible", function () {

                    beforeEach(function () {
                        mocks.$cordovaKeyboard.isVisible.and.returnValue(false);
                    });

                    it("should return false", function () {
                        expect(ctrl.isKeyboardVisible()).toBeFalsy();
                    });
                });
            });

            describe("when Cordova is NOT available", function () {

                beforeEach(function () {
                    mocks.PlatformUtil.platformHasCordova.and.returnValue(false);
                });

                it("should return false", function () {
                    expect(ctrl.isKeyboardVisible()).toBeFalsy();
                });
            });
        });

        describe("has a verifyFingerprintRemoval function that", function () {
            var model;

            afterAll(function () {
                model = null;
            });

            describe("when a fingerprint profile is available", function () {
                var platform,
                    confirmDeferred,
                    username,
                    password,
                    result;

                beforeEach(function () {
                    platform = TestUtils.getRandomBoolean() ? "android" : "ios";
                    confirmDeferred = mocks.$q.defer();

                    mocks.PlatformUtil.getPlatform.and.returnValue(platform);
                    mocks.$cordovaDialogs.confirm.and.returnValue(confirmDeferred.promise);
                });

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;
                    ctrl.user.username = username = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    ctrl.user.password = password = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                afterAll(function () {
                    platform = null;
                    confirmDeferred = null;
                    username = null;
                    password = null;
                    result = null;
                });

                //TODO - Move tests to rememberMeToggle tests
                xdescribe("when the model is 'rememberMe'", function () {

                    beforeEach(function () {
                        ctrl.verifyFingerprintRemoval();
                    });

                    it("should set rememberMe to true", function () {
                        expect(ctrl.rememberMe).toBe(true);
                    });

                    describe("should behave such that", commonTests);
                });

                beforeEach(function () {
                    ctrl.verifyFingerprintRemoval();
                });

                describe("should behave such that", commonTests);

                function commonTests() {

                    it("should call $cordovaDialogs.confirm with the expected values", function () {
                        expect(mocks.$cordovaDialogs.confirm).toHaveBeenCalledWith(
                            getFingerprintWarningPromptText(platform),
                            mocks.globals.USER_LOGIN.CONFIG.touchId.warningPrompt.title, [
                                mocks.globals.USER_LOGIN.CONFIG.touchId.warningPrompt.buttons.ok,
                                mocks.globals.USER_LOGIN.CONFIG.touchId.warningPrompt.buttons.cancel
                            ]
                        );
                    });

                    describe("when the user confirms", function () {

                        beforeEach(function () {
                            result = 1;
                            confirmDeferred.resolve(result);
                            mocks.$rootScope.$digest();
                        });

                        it("should call FingerprintProfileUtil.clearProfile", function () {
                            expect(mocks.FingerprintProfileUtil.clearProfile).toHaveBeenCalledWith(username);
                        });

                        it("should clear the form", function () {
                            expect(ctrl.rememberMe).toBe(false);
                            expect(ctrl.user.username).toEqual("");
                            expect(ctrl.user.password).toEqual("");
                            expect(mocks.$localStorage.USERNAME).not.toBeDefined();
                        });
                    });

                    describe("when the user rejects", function () {

                        beforeEach(function () {
                            result = 0;
                            confirmDeferred.resolve(result);
                            mocks.$rootScope.$digest();
                        });

                        it("should NOT call FingerprintProfileUtil.clearProfile", function () {
                            expect(mocks.FingerprintProfileUtil.clearProfile).not.toHaveBeenCalled();
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
                            return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.warningPrompt.messageAndroid");
                        case "ios":
                            return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.warningPrompt.messageIos");
                        default:
                            return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.warningPrompt.messageAndroid");
                    }
                }
            });

            describe("when a fingerprint profile is NOT available", function () {

                beforeEach(function () {
                    this.resolveHandler = jasmine.createSpy("resolveHandler");
                    this.rejectHandler = jasmine.createSpy("rejectHandler");
                    ctrl.fingerprintProfileAvailable = false;

                    ctrl.verifyFingerprintRemoval()
                        .then(this.resolveHandler)
                        .catch(this.rejectHandler);

                    mocks.$rootScope.$digest();
                });

                it("should resolve", function () {
                    expect(this.resolveHandler).toHaveBeenCalled();
                });
            });
        });

        describe("has a getFingerprintDisabledLabel function that", function () {
            var platform;

            beforeEach(function () {
                platform = TestUtils.getRandomBoolean() ? "android" : "ios";

                mocks.PlatformUtil.getPlatform.and.returnValue(platform);
            });

            afterAll(function () {
                platform = null;
            });

            it("should return the correct label for the current platform", function () {
                expect(ctrl.getFingerprintDisabledLabel(platform)).toEqual(getFingerprintDisabledLabel(platform));
            });

            function getFingerprintDisabledLabel(platform) {
                switch (_.toLower(platform)) {
                    case "android":
                        return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.disabled.labelAndroid");
                    case "ios":
                        return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.disabled.labelIos");
                    default:
                        return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.disabled.labelAndroid");
                }
            }
        });

        describe("has a maskableUsername function that", function() {

            beforeEach(function() {
                self.userDetails = {
                    username: _.toLower(TestUtils.getRandomStringThatIsAlphaNumeric(10)),
                    password: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                _.set(ctrl, "user.username", self.userDetails.username);
            });

            describe("when called with a parameter", function() {
                it("sets the username to the given value", function() {
                    var newUsername = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                    ctrl.maskableUsername(newUsername);
                    expect(ctrl.user.username).toEqual(newUsername);
                });
            });

            describe("when called without a parameter", function() {
                describe("when the username input is focused", function() {
                    beforeEach(function() {
                        ctrl.usernameIsFocused = true;
                    });

                    it("returns the unmasked username", function() {
                        expect(ctrl.maskableUsername()).toEqual(ctrl.user.username);
                    });
                });

                describe("when the username input is NOT focused", function() {
                    beforeEach(function() {
                        ctrl.usernameIsFocused = false;
                    });

                    it("returns the masked username", function() {
                        expect(ctrl.maskableUsername()).toEqual(mocks.wexTruncateStringFilter(ctrl.user.username));
                    });
                });
            });
        });

        // todo need to refactor to take mock click event with layerX property defined
        xdescribe("has an onClearInput function that", function() {

            beforeEach(function() {
                self.userDetails = {
                    username: _.toLower(TestUtils.getRandomStringThatIsAlphaNumeric(10)),
                    password: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                };

                _.set(ctrl, "user.username", self.userDetails.username);
                _.set(ctrl, "user.password", self.userDetails.password);

                jasmine.clock().install();
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            describe("for the userName input", function() {
                var query = "input[name=userName]";
                var mockInput;

                beforeEach(function() {
                    mockInput = createInput(query);
                    spyOn(document, "querySelector").and.returnValue(mockInput);
                    spyOn(mockInput, "focus");
                });

                it("should clear the username field", function() {
                    expect(ctrl.user.username !== "");
                    ctrl.onClearInput("userName");
                    expect(document.querySelector).toHaveBeenCalledWith(query);
                    expect(ctrl.user.username === "");
                });

                it("should focus on the userName input", function() {
                    ctrl.onClearInput("userName");
                    jasmine.clock().tick(1);
                    expect(mockInput.focus).toHaveBeenCalled();
                });
            });

            describe("for the password input", function() {
                var query = "input[name=password]";
                var mockInput;

                beforeEach(function() {
                    mockInput = createInput(query);
                    spyOn(document, "querySelector").and.returnValue(mockInput);
                    spyOn(mockInput, "focus");
                });

                it("should clear the password field", function() {
                    expect(ctrl.user.password !== "");
                    ctrl.onClearInput("password");
                    expect(ctrl.user.password === "");
                });

                it("should focus on the password input", function() {
                    ctrl.onClearInput("password");
                    jasmine.clock().tick(1);
                    expect(mockInput.focus).toHaveBeenCalled();
                });
            });

            describe("for an unknown input", function() {
                it("throws an exception", function() {
                    expect(function() { ctrl.onClearInput(TestUtils.getRandomStringThatIsAlphaNumeric(10)); }).toThrow();
                });
            });
        });
    });

    function getFingerprintSettingsPromptText(platform) {
        switch (_.toLower(platform)) {
            case "android":
                return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.settingsPrompt.messageAndroid");
            case "ios":
                return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.settingsPrompt.messageIos");
            default:
                return _.get(mocks.globals.USER_LOGIN.CONFIG, "touchId.settingsPrompt.messageAndroid");
        }
    }

    function verifyEventTracked(event) {
        expect(mocks.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

    function createInput(query) {
        var nameIndexStart = query.indexOf("name=") + "name=".length;
        var nameIndexEnd = query.indexOf("]", nameIndexStart);
        var inputName = query.substring(nameIndexStart, nameIndexEnd);

        if(inputName === "userName" || inputName === "password") {
            return { name: inputName, focus: function() {} };
        }
        return null;
    }

}());
