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
            setUser    : setUser
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

        function setUser(userInfo) {
            user = userInfo;
        }

    }

    angular
        .module("app.components.user")
        .factory("UserManager", UserManager);
})();