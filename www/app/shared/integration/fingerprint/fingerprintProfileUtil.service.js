(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function FingerprintProfileUtil(_, SecureStorage) {

        var service = {
            clearProfile: clearProfile,
            getProfile  : getProfile,
            setProfile  : setProfile
        };

        return service;
        //////////////////////
        //Public functions:

        function clearProfile(username) {
            return SecureStorage.remove(_.toLower(username));
        }

        function getProfile(username) {
            var clientId = _.toLower(username);

            return SecureStorage.get(clientId)
                .then(_.partial(createProfileResponse, _));
        }

        function setProfile(username, password) {
            var clientId = _.toLower(username);

            return SecureStorage.set(clientId, password)
                .then(_.partial(createProfileResponse, password));
        }
        //////////////////////
        //Private functions:

        function createProfileResponse(clientSecret) {
            return {clientSecret: clientSecret};
        }
    }

    angular
        .module("app.shared.integration.fingerprint")
        .factory("FingerprintProfileUtil", FingerprintProfileUtil);
})();
