(function () {
    "use strict";

    var UserModel = function (globals, UserAccountModel) {

        function UserModel() {
            this.billingCompany = "";
            this.brand = "";
            this.company = "";
            this.email = "";
            this.firstName = "";
            this.id = "";
            this.onlineApplication = "";
            this.username = "";
        }

        UserModel.prototype.set = function (userResource) {
            angular.extend(this, userResource);

            if (!userResource.brand) {
                this.brand = globals.BRAND.GENERIC;
            }

            this.company = new UserAccountModel();
            this.company.set(userResource.company);

            this.billingCompany = new UserAccountModel();
            this.billingCompany.set(userResource.billingCompany);
        };

        UserModel.prototype.getDisplayAccountNumber = function () {
            var ONLINE_APPLICATION = globals.USER.ONLINE_APPLICATION;

            switch (this.onlineApplication) {
                case ONLINE_APPLICATION.WOL_NP:
                    return this.billingCompany.accountNumber;
                case ONLINE_APPLICATION.CLASSIC:
                    return this.billingCompany.wexAccountNumber;
                default:
                    return this.billingCompany.accountNumber;
            }
        };

        return UserModel;
    };

    angular
        .module("app.components.user")
        .factory("UserModel", UserModel);
})();
