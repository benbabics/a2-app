(function () {
    "use strict";

    var UserModel = function () {

        function UserModel() {
            this.email = "";
            this.firstName = "";
            this.username = "";

            //TODO - Should these be moved into separate models?
            this.company = {};
            this.billingCompany = {};
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