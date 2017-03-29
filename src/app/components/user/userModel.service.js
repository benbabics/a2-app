(function () {
    "use strict";

    var UserModel = function ($q, globals, UserAccountModel) {

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
            var ONLINE_APPLICATION = globals.USER.ONLINE_APPLICATION;
            angular.extend(this, userResource);

            if (!userResource.brand) {
                this.brand = globals.BRAND.GENERIC;
            }

            this.company = new UserAccountModel();
            this.company.set(userResource.company);

            this.billingCompany = new UserAccountModel();
            this.billingCompany.set(userResource.billingCompany);

            this.isOnlineAppWolNp       = this.onlineApplication === ONLINE_APPLICATION.WOL_NP;
            this.isOnlineAppClassic     = this.onlineApplication === ONLINE_APPLICATION.CLASSIC;
            this.isOnlineAppDistributor = this.onlineApplication === ONLINE_APPLICATION.DISTRIBUTOR;
        };

        UserModel.prototype.getDisplayAccountNumber = function () {
            var ONLINE_APPLICATION = globals.USER.ONLINE_APPLICATION;

            switch (this.onlineApplication) {
                case ONLINE_APPLICATION.WOL_NP:
                case ONLINE_APPLICATION.DISTRIBUTOR:
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
