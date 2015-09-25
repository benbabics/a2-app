(function () {
    "use strict";

    var UserAccountModel = function () {

        function UserAccountModel() {
            this.accountId = "";
            this.accountNumber = "";
            this.name = "";
        }

        UserAccountModel.prototype.set = function (userAccountResource) {
            angular.extend(this, userAccountResource);
        };

        return UserAccountModel;
    };

    angular
        .module("app.components.user")
        .factory("UserAccountModel", UserAccountModel);
})();