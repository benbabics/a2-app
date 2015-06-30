(function () {
    "use strict";

    var UserModel = function () {

        function UserModel() {
            this.username = "";
            this.password = "";
            this.oauth = null;
        }

        UserModel.prototype.isLoggedIn = function () {
            return this.oauth;
        };

        UserModel.prototype.logOut = function () {
            this.oauth = null;
        };

        UserModel.prototype.set = function (userResource) {
            angular.extend(this, userResource);
        };

        return UserModel;
    };

    angular
        .module("app.shared.auth")
        .factory("UserModel", UserModel);
})();