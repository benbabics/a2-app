(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UserManager(UserModel, CommonService) {
        // Private members
        var profile = {},
            _ = CommonService._;

        // Revealed Public members
        var service = {
            getNewUser         : getNewUser,
            setUserData        : setUserData,
            setProfile         : setProfile,
            getUsername        : getUsername,
            getAuthToken       : getAuthToken,
            hasAuthentication  : hasAuthentication,
            clearAuthentication: clearAuthentication
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

        function setUserData(username, oauth) {
            profile.username = username;
            profile.oauth = oauth;
        }

        function setProfile(userProfile) {
            profile = userProfile;
        }

        function getUsername() {
            return profile.username;
        }

        function getAuthToken() {
            return profile.oauth;
        }

        function hasAuthentication() {
            return (!_.isEmpty(profile.oauth));
        }

        function clearAuthentication() {
            profile.oauth = null;
        }

    }

    angular
        .module("app.shared.auth")
        .factory("UserManager", UserManager);
})();