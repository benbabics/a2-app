(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UserManager(UserModel) {
        // Private members
        var profile = {};

        // Revealed Public members
        var service = {
            getNewUser: getNewUser,
            setProfile: setProfile,
            getProfile: getProfile
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            profile = getNewUser();
        }

        function getNewUser() {
            return new UserModel();
        }

        function setProfile(username, oauth) {
            profile.username = username;
            profile.oauth = oauth;
        }

        function getProfile() {
            return profile;
        }

    }

    angular
        .module("app.shared.auth")
        .factory("UserManager", UserManager);
})();