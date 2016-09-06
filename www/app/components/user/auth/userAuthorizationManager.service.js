(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UserAuthorizationManager(_, $q, $rootScope, globals,
                                      AuthenticationManager, Fingerprint, LoadingIndicator, Logger, Modal, SecureStorage) {
        var USER_AUTHORIZATION_TYPES = globals.USER_AUTHORIZATION_TYPES;

        var service = {
            verify: verify
        };

        return service;
        //////////////////////
        //Public functions:

        function verify(options) {
            switch (_.get(options, "method", USER_AUTHORIZATION_TYPES.SECRET)) {
                case USER_AUTHORIZATION_TYPES.SECRET:
                    return verifyWithSecret(_.get(options, "clientId"), _.get(options, "clientSecret"));
                case USER_AUTHORIZATION_TYPES.FINGERPRINT:
                    return verifyWithFingerprint(_.get(options, "clientId"), _.get(options, "clientSecret"));
                default:
                    return $q.reject("Unrecognized user authorization type.");
            }
        }
        //////////////////////
        //Private functions:

        function verifyWithFingerprint(clientId, clientSecret) {
            var verificationOptions = {clientId: clientId},
                bypassFingerprint = false,
                termsModal;

            //check to see if the user already set up a fingerprint profile
            return SecureStorage.get(clientId)
                //set up a new fingerprint profile with this clientId
                .catch(function () {
                    //authenticate the account with the given username/password
                    return verifyWithSecret(clientId, clientSecret)
                        //prompt the user to accept the terms of use
                        .then(_.partial(Modal.createByType, globals.MODAL_TYPES.FINGERPRINT_AUTH_TERMS, {}))
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
                            if (termsModal && termsModal.isShown()) {
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
                .then(_.partial(verifyWithSecret, clientId, _));
        }

        function verifyWithSecret(clientId, clientSecret) {
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
