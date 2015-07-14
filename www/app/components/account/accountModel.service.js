(function () {
    "use strict";

    var AccountModel = function () {

        function AccountModel() {
            this.accountId = "";
            this.accountNumber = "";
            this.name = "";
        }

        AccountModel.prototype.set = function (accountResource) {
            angular.extend(this, accountResource);
        };

        return AccountModel;
    };

    angular
        .module("app.components.account")
        .factory("AccountModel", AccountModel);
})();