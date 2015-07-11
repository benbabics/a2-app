(function () {
    "use strict";

    var UserModel = function () {

        function UserModel() {
            this.username = "";
            this.oauth = null;
        }

        UserModel.prototype.set = function (userResource) {
            angular.extend(this, userResource);
        };

        return UserModel;
    };

    angular
        .module("app.shared.auth")
        .factory("UserModel", UserModel);
})();