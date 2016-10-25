(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        $localStorage,
        Fingerprint,
        UserAuthorizationManager,
        SecureStorage,
        AnalyticsUtil,
        sessionCredentials,
        ctrl,
        credentials,
        mockGlobals = {
            "LOCALSTORAGE": {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "USERNAME": "USERNAME"
                }
            },
            "USER_AUTHORIZATION_TYPES": {
                "FINGERPRINT": "FINGERPRINT"
            },
            "SETTINGS": {
                "CONFIG": {
                    "title": "Settings",
                    "events": {
                        "AcceptTerms" : ["BiometricSettings", "EnableBiometrics", "AcceptTerms"],
                        "DeclineTerms": ["BiometricSettings", "EnableBiometrics", "DeclineTerms"],
                        "YesConfirm"  : ["BiometricSettings", "DisableBiometrics", "YesConfirm"],
                        "NoConfirm"   : ["BiometricSettings", "DisableBiometrics", "NoConfirm"]
                    },
                    "platformContent": {
                        "android": {
                            "fingerprintAuthName": "fingerprint authentication"
                        },
                        "ios": {
                            "fingerprintAuthName": "Touch ID®"
                        }
                    },
                    "fingerprintAuthTextLabel": "Use",
                    "removeFingerprintProfileConfirm": {
                        "message":   "Are you sure you want to turn off <%= fingerprintAuthName %> for your Username <%= username %>?",
                        "yesButton": "Yes",
                        "noButton":  "No"
                    },
                    "createFingerprintAuthMessage": "<%= fingerprintAuthName %> is now setup for your Username <%= username %>."
                }
            }
        };

    describe("A Settings Controller", function () {
        credentials = {
            clientId:     TestUtils.getRandomStringThatIsAlphaNumeric( 8 ),
            clientSecret: TestUtils.getRandomStringThatIsAlphaNumeric( 16 )
        };

        beforeEach(function () {
            Fingerprint              = jasmine.createSpyObj( "Fingerprint", ["isAvailable"] );
            SecureStorage            = jasmine.createSpyObj( "SecureStorage", ["get", "remove"] );
            sessionCredentials       = jasmine.createSpyObj( "sessionCredentials", ["get"] );
            UserAuthorizationManager = jasmine.createSpyObj( "UserAuthorizationManager", ["verify"] );
            AnalyticsUtil            = jasmine.createSpyObj( "AnalyticsUtil", ["trackEvent"] );

            module("app.shared");
            module("app.components");

            // stub the routing and template loading
            module(function($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function($provide) {
                $provide.value( "$ionicTemplateCache", function() {} );
            });

            module(["$provide", _.partial(TestUtils.provideCommonMockDependencies, _)]);

            inject(function ($controller, _$rootScope_, _$q_, _$localStorage_) {
                // create a scope object for us to use.
                $rootScope    = _$rootScope_;
                $scope        = $rootScope.$new();
                $q            = _$q_;
                $localStorage = _$localStorage_;

                ctrl = $controller("SettingsController", {
                    $scope:                   $scope,
                    $localStorage:            $localStorage,
                    globals:                  mockGlobals,
                    Fingerprint:              Fingerprint,
                    SecureStorage:            SecureStorage,
                    sessionCredentials:       sessionCredentials,
                    UserAuthorizationManager: UserAuthorizationManager,
                    AnalyticsUtil:            AnalyticsUtil,
                });
            });
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {
            beforeEach(function () {
                Fingerprint.isAvailable.and.returnValue( $q.resolve() );
            });

            describe("when the Username is stored in Local Storage", function () {
                beforeEach(function() {
                    $localStorage.USERNAME = TestUtils.getRandomStringThatIsAlphaNumeric( 20 );

                    // clear the username field so we can validate what it gets set to
                    ctrl.username = null;

                    $scope.$broadcast( "$ionicView.beforeEnter" );
                });

                it("should set the username with the value from Local Storage", function () {
                    expect( ctrl.username ).toEqual( $localStorage.USERNAME );
                });
            });

            describe("when the Username is NOT stored in Local Storage", function () {
                beforeEach(function() {
                    delete $localStorage.USERNAME;

                    // clear the username field so we can validate what it gets set to
                    ctrl.username = null;

                    $scope.$broadcast( "$ionicView.beforeEnter" );
                });

                it("should NOT set the username", function () {
                    expect( ctrl.username ).toBeNull();
                });
            });

            describe("defaults the value of the fingerprintProfileAvailable property", function () {
                beforeEach(function () {
                    $scope.$broadcast( "$ionicView.beforeEnter" );
                });

                describe("when the user has a stored fingerprint profile", function () {
                    beforeEach(function () {
                        SecureStorage.get.and.returnValue( $q.resolve() );
                        $rootScope.$digest();
                    });

                    it("should set fingerprintProfileAvailable to true", function () {
                        expect( ctrl.fingerprintProfileAvailable ).toBe( true );
                    });
                });

                describe("when the user does NOT have a stored fingerprint profile", function () {
                    beforeEach(function () {
                        SecureStorage.get.and.returnValue( $q.reject() );
                        $rootScope.$digest();
                    });

                    it("should NOT set fingerprintProfileAvailable to true", function () {
                        expect( ctrl.fingerprintProfileAvailable ).toBe( false );
                    });
                });
            });
        });

        describe("has a vm.handleFingerprintProfileChange() method that", function () {
            beforeEach(function () {
                sessionCredentials.get.and.returnValue( $q.resolve(credentials) );
                UserAuthorizationManager.verify.and.returnValue( $q.resolve() );
                SecureStorage.remove.and.returnValue( $q.resolve() );
            });

            describe("when vm.fingerprintProfileAvailable is true", function () {
                it("should send a message to UserAuthorizationManager.verify() with session credentials", function () {
                    ctrl.fingerprintProfileAvailable = true;
                    ctrl.handleFingerprintProfileChange();
                    $scope.$digest();

                    expect( sessionCredentials.get ).toHaveBeenCalled();
                    expect( UserAuthorizationManager.verify ).toHaveBeenCalledWith( credentials, { bypassFingerprint: false } );
                    expect( AnalyticsUtil.trackEvent ).toHaveBeenCalled();
                });
            });

            describe("when vm.fingerprintProfileAvailable is false", function () {
                it("should send a message to SecureStorage.remove() with the session clientId", function () {
                    ctrl.fingerprintProfileAvailable = false;
                    ctrl.handleFingerprintProfileChange();
                    $scope.$digest();

                    expect( sessionCredentials.get ).toHaveBeenCalled();
                    expect( SecureStorage.remove ).toHaveBeenCalledWith( credentials.clientId );
                    expect( AnalyticsUtil.trackEvent ).toHaveBeenCalled();
                });
            });
        });

    });

}());
