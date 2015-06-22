(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UserManager(LocalStorage) {
        // Constants
        var USERKEY = "utoken";

        // Private members
        var profile = {};

        // Revealed Public members
        var service = {
            setProfile: setProfile,
            getProfile: getProfile
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            // TODO: move into a UserModel
            var user = {
                username: "",
                oauth: null,
                get loggedIn() {
                    return this.oauth;
                },
                logOut: function () {
                    this.oauth = null;
                }
            };

            var localUser = LocalStorage.getObject(USERKEY);
            if (localUser) {
                user.username = localUser.username;
                user.oauth = localUser.oauth;
            }

            profile = user;
        }

        function setProfile(username, oauth) {
            profile.username = username;
            profile.oauth = oauth;
            LocalStorage.setObject(USERKEY, profile);
        }

        function getProfile() {
            return profile;
        }

    }

    angular
        .module("app.shared.auth")
        .factory("UserManager", UserManager);
})();