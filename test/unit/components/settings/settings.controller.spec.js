(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        $localStorage,
        $cordovaDialogs,
        Fingerprint,
        UserAuthorizationManager,
        SecureStorage,
        AnalyticsUtil,
        sessionCredentials,
        ctrl,
        credentials,
        globals;

    describe("A Settings Controller", function () {
        credentials = {
            clientId:     TestUtils.getRandomStringThatIsAlphaNumeric( 8 ),
            clientSecret: TestUtils.getRandomStringThatIsAlphaNumeric( 16 )
        };

        beforeEach(function () {
            module("app.shared");
            module("app.components");

            // stub the routing and template loading
            module(function($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });
            Fingerprint = jasmine.createSpyObj("Fingerprint", ["isAvailable"]);
            SecureStorage = jasmine.createSpyObj("SecureStorage", ["get", "remove"]);
            sessionCredentials = jasmine.createSpyObj("sessionCredentials", ["get"]);
            UserAuthorizationManager = jasmine.createSpyObj("UserAuthorizationManager", ["verify"]);
            AnalyticsUtil            = jasmine.createSpyObj( "AnalyticsUtil", ["trackEvent"] );
            $cordovaDialogs = jasmine.createSpyObj("$cordovaDialogs", ["confirm"]);

            inject(function ($controller, _$rootScope_, _$q_, _$localStorage_, _globals_) {
                // create a scope object for us to use.
                $rootScope    = _$rootScope_;
                $scope        = $rootScope.$new();
                $q            = _$q_;
                $localStorage = _$localStorage_;
                globals = _globals_;

                ctrl = $controller("SettingsController", {
                    $cordovaDialogs:          $cordovaDialogs,
                    $scope:                   $scope,
                    $localStorage:            $localStorage,
                    Fingerprint:              Fingerprint,
                    SecureStorage:            SecureStorage,
                    sessionCredentials:       sessionCredentials,
                    AnalyticsUtil:            AnalyticsUtil,
                    UserAuthorizationManager: UserAuthorizationManager
                });
            });

            //TODO - Test the failure condition of this
            $cordovaDialogs.confirm.and.returnValue($q.resolve(2));
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
