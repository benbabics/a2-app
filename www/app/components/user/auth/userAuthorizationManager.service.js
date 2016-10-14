(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UserAuthorizationManager(_, $q, $rootScope, globals, AuthenticationManager, Fingerprint,
                                      FingerprintProfileUtil, LoadingIndicator, Logger, Modal, PlatformUtil) {
        var USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION_TYPES;

        var service = {
            verify: verify
        };

        return service;
        //////////////////////
        //Public functions:

        function verify(credentials, options) {
            options = options || {};
            switch (_.get(credentials, "method", USER_AUTHORIZATION_TYPES.SECRET)) {
                case USER_AUTHORIZATION_TYPES.SECRET:
                    return verifyWithSecret(_.get(credentials, "clientId"), _.get(credentials, "clientSecret"), options);
                case USER_AUTHORIZATION_TYPES.FINGERPRINT:
                    return verifyWithFingerprint(_.get(credentials, "clientId"), _.get(credentials, "clientSecret"), options);
                default:
                    return $q.reject("Unrecognized user authorization type.");
            }
        }
        //////////////////////
        //Private functions:

        function getFingerprintTerms() {
            switch (_.toLower(PlatformUtil.getPlatform())) {
                case "android":
                    return _.get(this, "CONFIG.termsAndroid");
                case "ios":
                    return _.get(this, "CONFIG.termsIos");
                default:
                    return _.get(this, "CONFIG.termsAndroid");
            }
        }

        function verifyWithFingerprint(clientId, clientSecret, options) {
            options = _.extend( { bypassFingerprint: null }, options );

            var verificationOptions = {clientId: clientId},
                bypassFingerprint = options.bypassFingerprint,
                termsModal;

            //check to see if the user already set up a fingerprint profile
            return FingerprintProfileUtil.getProfile(clientId)
                //set up a new fingerprint profile with this clientId
                .catch(function () {
                    //authenticate the account with the given username/password
                    return verifyWithSecret(clientId, clientSecret, options)
                        //prompt the user to accept the terms of use
                        .then(_.partial(Modal.createByType, globals.MODAL_TYPES.FINGERPRINT_AUTH_TERMS, {
                            scopeVars: {getTerms: getFingerprintTerms}
                        }))
                        .then(function (modal) {
                            termsModal = modal;

                            return termsModal.show();
                        })
                        .then(function () {
                            var acceptedTermsDeferred = $q.defer();

                            $rootScope.$on("FingerprintAuthTerms.accepted", acceptedTermsDeferred.resolve);
                            $rootScope.$on("FingerprintAuthTerms.rejected", acceptedTermsDeferred.reject);

                            return acceptedTermsDeferred.promise;
                        })
                        //register a new fingerprint profile for this user
                        .then(_.partial(_.set, verificationOptions, "clientSecret", clientSecret))
                        .catch(function (error) {
                            if (_.isNull(bypassFingerprint) && termsModal && termsModal.isShown()) {
                                //user declined the terms, so bypass fingerprint auth
                                bypassFingerprint = true;
                            }

                            return $q.reject(error);
                        })
                        .finally(function () {
                            return termsModal.remove();
                        });
                })
                //verify the user's fingerprint
                .then(_.partial(Fingerprint.verify, verificationOptions))
                .then(_.partial(_.get, _, "clientSecret"))
                .catch(function (error) {
                    if (bypassFingerprint) {
                        //user changed their mind about using fingerprint auth, so login regularly
                        return $q.resolve(clientSecret);
                    }
                    else {
                        var errorStr = "Failed to verify user via fingerprint auth. ";

                        Logger.error(errorStr + error);
                        return $q.reject(errorStr);
                    }
                })
                .then(_.partial(verifyWithSecret, clientId, _, options));
        }

        function verifyWithSecret(clientId, clientSecret, options) {
            if (_.isNil(clientId)) {
                return $q.reject("clientId is required to verify user with secret.");
            }

            if (_.isNil(clientSecret)) {
                return $q.reject("clientSecret is required to verify user with secret.");
            }

            LoadingIndicator.begin();

            return AuthenticationManager.authenticate(clientId, clientSecret)
                .finally(LoadingIndicator.complete);
        }
    }

    angular
        .module("app.components.user.auth")
        .factory("UserAuthorizationManager", UserAuthorizationManager);
})();
