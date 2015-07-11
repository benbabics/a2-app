(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function UserManager(UserModel) {
        // Private members
        var user = {};

        // Revealed Public members
        var service = {
            getNewUser : getNewUser,
            getUsername: getUsername,
            setUser    : setUser,
            setUsername: setUsername
        };

        activate();

        return service;
        //////////////////////

        function activate() {
            user = getNewUser();
        }

        function getNewUser() {
            return new UserModel();
        }

        function getUsername() {
            return user.username;
        }

        function setUser(userInfo) {
            user = userInfo;
        }

        function setUsername(username) {
            user.username = username;
        }

    }

    angular
        .module("app.components.user")
        .factory("UserManager", UserManager);
})();