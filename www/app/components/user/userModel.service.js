(function () {
    "use strict";

    var UserModel = function (AccountModel) {

        function UserModel() {
            this.email = "";
            this.firstName = "";
            this.username = "";
            this.company = new AccountModel();
            this.billingCompany = new AccountModel();
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