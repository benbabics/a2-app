(function () {
    "use strict";

    var _,
        $ionicHistory,
        $localStorage,
        $q,
        $rootScope,
        $scope,
        $state,
        $stateParams = {},
        $cordovaKeyboard,
        AnalyticsUtil,
        LoginManager,
        authenticateDeferred,
        ctrl,
        logInDeferred,
        AuthenticationManager,
        PlatformUtil,
        Fingerprint,
        UserAuthorizationManager,
        SecureStorage,
        fingerprintAvailableDeferred,
        mockGlobals = {
            "LOCALSTORAGE" : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "USERNAME": "USERNAME"
                }
            },
            "USER_LOGIN": {
                "CONFIG": {
                    "ANALYTICS"   : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "events"     : {
                            "successfulLogin"       : [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ],
                            "inactiveStatus"        : [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ],
                            "accountNotReadyStatus" : [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ],
                            "wrongCredentialsStatus": [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ],
                            "lockedPasswordStatus"  : [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ]
                        }
                    },
                    "title"       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "userName"    : {
                        "label"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "maxLength": TestUtils.getRandomInteger(1, 100)
                    },
                    "password"    : {
                        "label"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "maxLength": TestUtils.getRandomInteger(1, 100)
                    },
                    "rememberMe"    : {
                        "label"    : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "submitButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "serverErrors": {
                        "AUTHORIZATION_FAILED"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "DEFAULT"                           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "PASSWORD_EXPIRED"                  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "TOKEN_EXPIRED"                     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_LOCKED"                       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_MUST_ACCEPT_TERMS"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_MUST_SETUP_SECURITY_QUESTIONS": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "USER_NOT_ACTIVE"                   : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            },
            USER_AUTHORIZATION_TYPES: {
                "FINGERPRINT": "FINGERPRINT",
                "SECRET"     : "SECRET"
            }
        },
        mockConfig = mockGlobals.USER_LOGIN.CONFIG;

    describe("A Login Controller", function () {

        beforeEach(function () {

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["authenticate"]);
            $state = jasmine.createSpyObj("state", ["go"]);
            $cordovaKeyboard = jasmine.createSpyObj("$cordovaKeyboard", ["isVisible"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);
            LoginManager = jasmine.createSpyObj("LoginManager", ["logIn", "logOut"]);
            PlatformUtil = jasmine.createSpyObj("PlatformUtil", ["platformHasCordova"]);
            Fingerprint = jasmine.createSpyObj("Fingerprint", ["isAvailable"]);
            UserAuthorizationManager = jasmine.createSpyObj("UserAuthorizationManager", ["verify"]);
            SecureStorage = jasmine.createSpyObj("SecureStorage", ["get", "remove"]);

            module("app.shared");
            module("app.components", function($provide) {
                $provide.value("AnalyticsUtil", AnalyticsUtil);
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function (___, _$rootScope_, $controller, _$ionicHistory_, _$localStorage_, _$q_, BrandAssetModel, UserAccountModel, UserModel,
                             globals) {
                _ = ___;
                $ionicHistory = _$ionicHistory_;
                $localStorage = _$localStorage_;
                $scope = _$rootScope_.$new();
                $q = _$q_;
                $rootScope = _$rootScope_;
                authenticateDeferred = $q.defer();

                mockConfig.ANALYTICS.errorEvents = globals.USER_LOGIN.CONFIG.ANALYTICS.errorEvents;

                ctrl = $controller("LoginController", {
                    $localStorage           : $localStorage,
                    $scope                  : $scope,
                    $state                  : $state,
                    $stateParams            : $stateParams,
                    AnalyticsUtil           : AnalyticsUtil,
                    $cordovaKeyboard        : $cordovaKeyboard,
                    globals                 : mockGlobals,
                    AuthenticationManager   : AuthenticationManager,
                    LoginManager            : LoginManager,
                    PlatformUtil            : PlatformUtil,
                    Fingerprint             : Fingerprint,
                    UserAuthorizationManager: UserAuthorizationManager,
                    SecureStorage           : SecureStorage
                });

                //setup spies:
                logInDeferred = $q.defer();
                fingerprintAvailableDeferred = $q.defer();

                //setup mocks:
                LoginManager.logIn.and.returnValue(logInDeferred.promise);
                Fingerprint.isAvailable.and.returnValue(fingerprintAvailableDeferred.promise);
            });

        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                spyOn($ionicHistory, "clearHistory");

                //setup an existing values to test them being modified
                ctrl.globalError = "This is a previous error";
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
                    expect(ctrl.rememberMe).toBeTruthy();
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
                    expect(ctrl.rememberMe).toBeFalsy();
                });

            });

            describe("when fingerprint authentication is available", function () {

                beforeEach(function () {
                    fingerprintAvailableDeferred.resolve();

                    $scope.$broadcast("$ionicView.beforeEnter");
                });

                describe("when the user has a stored fingerprint profile", function () {

                    beforeEach(function () {
                        SecureStorage.get.and.returnValue($q.resolve());
                        $rootScope.$digest();
                    });

                    it("should set vm.fingerprintProfileAvailable to true", function () {
                        expect(ctrl.fingerprintProfileAvailable).toBe(true);
                    });

                    it("should set vm.fingerprintAuthAvailable to true", function () {
                        expect(ctrl.fingerprintAuthAvailable).toBe(true);
                    });
                });

                describe("when the user does NOT have a stored fingerprint profile", function () {

                    beforeEach(function () {
                        SecureStorage.get.and.returnValue($q.reject());
                        $rootScope.$digest();
                    });

                    it("should NOT set vm.fingerprintProfileAvailable to true", function () {
                        expect(ctrl.fingerprintProfileAvailable).toBe(false);
                    });

                    it("should set vm.fingerprintAuthAvailable to true", function () {
                        expect(ctrl.fingerprintAuthAvailable).toBe(true);
                    });
                });
            });

            describe("when fingerprint authentication is NOT available", function () {
                beforeEach(function () {
                    fingerprintAvailableDeferred.reject();

                    $scope.$broadcast("$ionicView.beforeEnter");
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
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.TOKEN_EXPIRED);
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
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

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
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

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
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

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
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

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a app:cordovaPause event handler function that", function () {
            it("should set globalError property to false", function () {
                ctrl.globalError = "an existing error.";

                $rootScope.$broadcast( "app:cordovaPause" );
                $rootScope.$digest();

                expect( ctrl.globalError ).toBe( false );
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

        describe("has a $cordovaKeyboard:hide event handler function that", function () {

            beforeEach(function () {
                document.body.classList.add("keyboard-open");
            });

            beforeEach(function () {
                $rootScope.$broadcast("$cordovaKeyboard:hide");
                $rootScope.$digest();
            });

            it("should remove the 'keyboard-open' class from the body", function () {
                expect(document.body.classList.contains("keyboard-open")).toBeFalsy();
            });
        });

        describe("has an logInUser function that", function () {

            var mockUser = {
                username: "someusername",
                password: "12345adfg"
            };

            beforeEach(function () {
                // clear Local Storage to start
                delete $localStorage.USERNAME;

                UserAuthorizationManager.verify.and.returnValue(authenticateDeferred.promise);

                ctrl.user = mockUser;
            });

            describe("when using fingerprint authentication", function () {

                beforeEach(function () {
                    ctrl.fingerprintProfileAvailable = true;

                    ctrl.logInUser(true);
                });

                it("should authorize the User", function () {
                    expect(UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                        clientId: ctrl.user.username,
                        clientSecret: ctrl.user.password,
                        method: mockGlobals.USER_AUTHORIZATION_TYPES.FINGERPRINT
                    }));
                });

                it("should NOT set vm.fingerprintProfileAvailable to false", function () {
                    expect(ctrl.fingerprintProfileAvailable).not.toBe(false);
                });

                it("should NOT call SecureStorage.remove with the expected value", function () {
                    expect(SecureStorage.remove).not.toHaveBeenCalled();
                });

                describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {
                    var errorObjectArg = new Error("BAD_CREDENTIALS");

                    beforeEach(function () {
                        authenticateDeferred.reject(errorObjectArg);
                        $scope.$digest();
                    });

                    it("should set vm.fingerprintProfileAvailable to false", function () {
                        expect(ctrl.fingerprintProfileAvailable).toBe(false);
                    });

                    it("should call SecureStorage.remove with the expected value", function () {
                        expect(SecureStorage.remove).toHaveBeenCalledWith(_.toLower(ctrl.user.username));
                    });
                });

                describe("when authorizing", logInUserAuthTests);
            });

            describe("when NOT using fingerprint authentication", function () {

                beforeEach(function () {
                    ctrl.logInUser(false);
                });

                it("should authorize the User", function () {
                    expect(UserAuthorizationManager.verify).toHaveBeenCalledWith(jasmine.objectContaining({
                        clientId: ctrl.user.username,
                        clientSecret: ctrl.user.password,
                        method: mockGlobals.USER_AUTHORIZATION_TYPES.SECRET
                    }));
                });

                it("should set vm.fingerprintProfileAvailable to false", function () {
                    expect(ctrl.fingerprintProfileAvailable).toBe(false);
                });

                it("should call SecureStorage.remove with the expected value", function () {
                    expect(SecureStorage.remove).toHaveBeenCalledWith(_.toLower(ctrl.user.username));
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

                it("should call LoginManager.logIn", function () {
                    expect(LoginManager.logIn).toHaveBeenCalled();
                });

                describe("when the login completes successfully", function () {

                    beforeEach(function () {
                        spyOn($ionicHistory, "nextViewOptions");

                        logInDeferred.resolve();
                    });

                    describe("when the Remember Me option is checked", function () {

                        beforeEach(function () {
                            ctrl.rememberMe = true;

                            $scope.$digest();
                        });

                        it("should set the username in Local Storage", function () {
                            expect($localStorage.USERNAME).toEqual(ctrl.user.username);
                        });

                        it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                            verifyEventTracked(mockConfig.ANALYTICS.events.successfulLogin);
                        });

                        it("should call disable backing up to the login page", function () {
                            expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                        });

                        it("should NOT have an error message", function () {
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        it("should navigate to the landing page", function () {
                            expect($state.go).toHaveBeenCalledWith("landing");
                        });

                    });

                    describe("when the Remember Me option is NOT checked", function () {

                        beforeEach(function () {
                            ctrl.rememberMe = false;

                            $scope.$digest();
                        });

                        it("should Remove the username from Local Storage", function () {
                            expect($localStorage.USERNAME).not.toBeDefined();
                        });

                        it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                            verifyEventTracked(mockConfig.ANALYTICS.events.successfulLogin);
                        });

                        it("should call disable backing up to the login page", function () {
                            expect($ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack: true});
                        });

                        it("should NOT have an error message", function () {
                            expect(ctrl.globalError).toBeFalsy();
                        });

                        it("should navigate to the landing page", function () {
                            expect($state.go).toHaveBeenCalledWith("landing");
                        });

                    });

                });

                describe("when the login does NOT complete successfully", function () {

                    var errorObjectArg = new Error("Something bad happened");

                    beforeEach(function () {
                        //reject with an error message
                        logInDeferred.reject(errorObjectArg);
                        $scope.$digest();
                    });

                    it("should call LoginManager.logOut", function () {
                        expect(LoginManager.logOut).toHaveBeenCalledWith();
                    });

                    it("should have an error message", function () {
                        expect(ctrl.globalError).toEqual(mockConfig.serverErrors.DEFAULT);
                    });

                    it("should NOT navigate away from the login page", function () {
                        expect($state.go).not.toHaveBeenCalled();
                    });

                    it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                        verifyEventTracked(mockConfig.ANALYTICS.events.wrongCredentialsStatus);
                    });

                });

            });

            describe("when the User is NOT Authenticated successfully with a BAD_CREDENTIALS error", function () {

                var errorObjectArg = new Error("BAD_CREDENTIALS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.DEFAULT);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.wrongCredentialsStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_NOT_ACTIVE error", function () {

                var errorObjectArg = new Error("USER_NOT_ACTIVE");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_NOT_ACTIVE);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_ACCEPT_TERMS error", function () {

                var errorObjectArg = new Error("USER_MUST_ACCEPT_TERMS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_MUST_ACCEPT_TERMS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_MUST_SETUP_SECURITY_QUESTIONS error", function () {

                var errorObjectArg = new Error("USER_MUST_SETUP_SECURITY_QUESTIONS");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_MUST_SETUP_SECURITY_QUESTIONS);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.inactiveStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a PASSWORD_EXPIRED error", function () {

                var errorObjectArg = new Error("PASSWORD_EXPIRED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.PASSWORD_EXPIRED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should NOT call AnalyticsUtil.trackEvent", function () {
                    expect(AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

            });

            describe("when the User is NOT Authenticated successfully with a USER_LOCKED error", function () {

                var errorObjectArg = new Error("USER_LOCKED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.USER_LOCKED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.lockedPasswordStatus);
                });

            });

            describe("when the User is NOT Authenticated successfully with a AUTHORIZATION_FAILED error", function () {

                var errorObjectArg = new Error("AUTHORIZATION_FAILED");

                beforeEach(function () {
                    //reject with an error message
                    authenticateDeferred.reject(errorObjectArg);
                    $scope.$digest();
                });

                it("should call LoginManager.logOut", function () {
                    expect(LoginManager.logOut).toHaveBeenCalledWith();
                });

                it("should have an error message", function () {
                    expect(ctrl.globalError).toEqual(mockConfig.serverErrors.AUTHORIZATION_FAILED);
                });

                it("should NOT navigate away from the login page", function () {
                    expect($state.go).not.toHaveBeenCalled();
                });

                it("should call AnalyticsUtil.trackEvent with the expected event", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.accountNotReadyStatus);
                });

            });
        }

        describe("has an isKeyboardVisible function that", function () {

            describe("when Cordova is available", function () {

                beforeEach(function () {
                    PlatformUtil.platformHasCordova.and.returnValue(true);
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
                    PlatformUtil.platformHasCordova.and.returnValue(false);
                });

                it("should return false", function () {
                    expect(ctrl.isKeyboardVisible()).toBeFalsy();
                });
            });
        });

    });

    function verifyEventTracked(event) {
        expect(AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());
