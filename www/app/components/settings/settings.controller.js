(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll
    // jshint maxparams:11

    /* @ngInject */
    function SettingsController($q, $scope, $localStorage, $cordovaDialogs, $timeout, globals, PlatformUtil, Fingerprint, UserAuthorizationManager, SecureStorage, sessionCredentials, wexTruncateStringFilter, AnalyticsUtil) {

        var USERNAME_KEY             = globals.LOCALSTORAGE.KEYS.USERNAME,
            USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION_TYPES;

        var platform,
            vm = this;

        vm.config = globals.SETTINGS.CONFIG;
        vm.username = null;
        vm.platformContent = {};
        vm.fingerprintProfileAvailable = false;

        vm.handleFingerprintProfileChange = handleFingerprintProfileChange;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            $scope.$on( "$ionicView.beforeEnter", beforeEnter );
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
            vm.platformContent = vm.config.platformContent[ platform ];
        }

        function handleFingerprintProfileChange() {
            var shouldCreate = vm.fingerprintProfileAvailable === true;
            sessionCredentials.get().then(function(credentials) {
                if ( shouldCreate ) { createFingerprintProfile(credentials); }
                else { destroyFingerprintProfile(credentials.clientId); }
            });
        }

        function createFingerprintProfile(credentials) {
            _.extend( credentials, { method: USER_AUTHORIZATION_TYPES.FINGERPRINT } );
            UserAuthorizationManager.verify( credentials, { bypassFingerprint: false } )
                .then(function() {
                    renderFingerprintProfileSuccessMessage( credentials.clientId );
                    trackEvent( "acceptTerms" );
                })
                .catch(function() {
                    vm.fingerprintProfileAvailable = false;
                    trackEvent( "declineTerms" );
                });
        }

        function destroyFingerprintProfile(clientId) {
            var content = vm.config.removeFingerprintProfileConfirm,
                message = _.template( content.message )({
                    fingerprintAuthName: vm.platformContent.fingerprintAuthName,
                    username:            wexTruncateStringFilter( clientId )
                });

            $cordovaDialogs.confirm(
                message, "", [ content.noButton, content.yesButton ]
            )
            .then(function (btnIndex) {
                if ( btnIndex === 2 ) {
                    SecureStorage.remove( clientId );
                    trackEvent( "YesConfirm" );
                }
                else {
                    vm.fingerprintProfileAvailable = true;
                    trackEvent( "NoConfirm" );
                }
            });
        }

        function renderFingerprintProfileSuccessMessage(clientId) {
            var message = _.template( vm.config.createFingerprintAuthMessage )({
                    fingerprintAuthName: vm.platformContent.fingerprintAuthName,
                    username:            wexTruncateStringFilter( clientId )
                });

            vm.fingerprintProfileSuccessMessage = message;

            $timeout(function() {
                vm.fingerprintProfileSuccessMessage = "";
            }, 3000);
        }

        function trackEvent(eventId) {
            _.spread( AnalyticsUtil.trackEvent )( vm.config.events[ eventId ] );
        }

    }

    angular.module("app.components.settings")
        .controller("SettingsController", SettingsController);
})();
