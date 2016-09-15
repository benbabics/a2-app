(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:9

    /* @ngInject */
    function SettingsController($q, $scope, $localStorage, globals, PlatformUtil, Fingerprint, UserAuthorizationManager, SecureStorage, sessionCredentials) {

        var DEVICE_IOS               = "ios",
            DEVICE_ANDROID           = "android",
            USERNAME_KEY             = globals.LOCALSTORAGE.KEYS.USERNAME,
            USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION_TYPES;

        var platform,
            vm = this;

        vm.username = null;
        vm.fingerprintAuthTextLabel    = "";
        vm.fingerprintProfileAvailable = null;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            $scope.$on( "$ionicView.beforeEnter", beforeEnter );
            $scope.$watch( "vm.fingerprintProfileAvailable", handleFingerprintProfileChange );
        }

        function beforeEnter() {
            setupUsername();
            setupFingerprintAvailability();
            getPlatform().then( setupContent );
        }

        function getPlatform() {
            var deferred = $q.defer();

            PlatformUtil.waitForCordovaPlatform(function () {
                platform = _.toLower( PlatformUtil.getPlatform() );
                deferred.resolve( platform );
            });

            return deferred.promise;
        }

        function setupUsername() {
            vm.username = $localStorage[ USERNAME_KEY ] || null;
        }

        function setupFingerprintAvailability() {
            var clientId = _.toLower( vm.username );

            // enable fingerprint login if there is an existing fingerprint profile for this user
            Fingerprint.isAvailable()
                .then(function () {
                    SecureStorage.get( clientId )
                        .then(function() { vm.fingerprintProfileAvailable = true; });
                });
        }

        function setupContent(platform) {
            switch (platform) {
                case DEVICE_IOS:
                    vm.fingerprintAuthTextLabel = "Use Touch ID";
                    break;
                case DEVICE_ANDROID:
                    vm.fingerprintAuthTextLabel = "Use fingerprint authentication";
                    break;
            }
        }

        function handleFingerprintProfileChange(shouldCreate) {
            sessionCredentials.get().then(function(credentials) {
                if ( shouldCreate ) { createFingerprintProfile(credentials); }
                else { destroyFingerprintProfile(credentials.clientId); }
            });
        }

        function createFingerprintProfile(credentials) {
            _.extend( credentials, { method: USER_AUTHORIZATION_TYPES.FINGERPRINT } );
            UserAuthorizationManager.verify( credentials, { bypassFingerprint: false } )
                .catch(function() { vm.fingerprintProfileAvailable = false; });
        }

        function destroyFingerprintProfile(clientId) {
            SecureStorage.remove( clientId );
        }

    }

    angular.module("app.components.settings")
        .controller("SettingsController", SettingsController);
})();
