(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function FingerprintProfileUtil(_, globals, StorageManager) {

        var service = {
            clearProfile: clearProfile,
            getProfile  : getProfile,
            setProfile  : setProfile
        };

        return service;
        //////////////////////
        //Public functions:

        function clearProfile(username) {
            return StorageManager.remove(_.toLower(username), {secure: true});
        }

        function getProfile(username) {
            var clientId = _.toLower(username);

            return StorageManager.get(clientId, {secure: true})
                .then(_.partial(createProfileResponse, _));
        }

        function setProfile(username, password) {
            var clientId = _.toLower(username);

            //automatically enable remember me
            StorageManager.set(globals.LOCALSTORAGE.KEYS.USERNAME, username);

            return StorageManager.set(clientId, password, {secure: true})
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
