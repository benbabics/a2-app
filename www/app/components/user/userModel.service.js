(function () {
    "use strict";

    var UserModel = function (UserAccountModel) {

        function UserModel() {
            this.email = "";
            this.firstName = "";
            this.username = "";
            this.company = "";
            this.billingCompany = "";
        }

        UserModel.prototype.set = function (userResource) {
            angular.extend(this, userResource);

            this.company = new UserAccountModel();
            this.company.set(userResource.company);

            this.billingCompany = new UserAccountModel();
            this.billingCompany.set(userResource.billingCompany);
        };

        return UserModel;
    };

    angular
        .module("app.components.user")
        .factory("UserModel", UserModel);
})();