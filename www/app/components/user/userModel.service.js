(function () {
    "use strict";

    var UserModel = function () {

        function UserModel() {
            this.username = "";
        }

        UserModel.prototype.set = function (userResource) {
            angular.extend(this, userResource);
        };

        return UserModel;
    };

    angular
        .module("app.components.user")
        .factory("UserModel", UserModel);
})();